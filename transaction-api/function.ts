import { FastifyReply, FastifyRequest } from "fastify";
import { MongoClient, Db, Collection, ObjectId } from "mongodb";

// MongoDB connection
const MONGODB_URI = process.env['MONGODB_URI'] || "mongodb_xxxx";
const AUTH_SERVICE_URL = process.env['AUTH_SERVICE_URL'] || "https://freeserverless.com/invok/cf749b32-a29a-4080-bbd0-87a66a9d1b00/auth-service";

interface Transaction {
    _id?: ObjectId;
    userId: string;
    amount: number;
    description: string;
    category: string;
    date: Date;
    type: 'income' | 'expense';
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
    recurringId?: string;
    attachments?: string[];
}

interface TransactionRequest {
    amount: number;
    description: string;
    category: string;
    date: string;
    type: 'income' | 'expense';
    tags?: string[];
}

interface TransactionResponse {
    success: boolean;
    data?: Transaction[] | Transaction | undefined;
    error?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

interface QueryParams {
    id?: string;
    category?: string;
    type?: 'income' | 'expense';
    startDate?: string;
    endDate?: string;
    tags?: string;
    page?: string;
    limit?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

interface AuthServiceResponse {
    success: boolean;
    user?: {
        _id: string;
        email: string;
        firstName: string;
        lastName: string;
        [key: string]: any;
    };
    error?: string;
}

// Database connection
let cachedDb: Db | null = null;

async function connectToDatabase(): Promise<Db> {
    if (cachedDb) {
        return cachedDb;
    }

    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();

        const db = client.db('finance-tracker');
        cachedDb = db;

        // Create indexes for better performance
        await db.collection('transactions').createIndex({ userId: 1, date: -1 });
        await db.collection('transactions').createIndex({ userId: 1, category: 1 });
        await db.collection('transactions').createIndex({ userId: 1, type: 1 });
        await db.collection('transactions').createIndex({ userId: 1, createdAt: -1 });

        return db;
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw new Error('Database connection failed');
    }
}

// Helper functions
async function getUserFromToken(authHeader: string | undefined): Promise<string> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Authorization token required');
    }

    try {
        // Call auth-service to verify token and get user info
        const response = await fetch(`${AUTH_SERVICE_URL}?action=verify`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json() as AuthServiceResponse;

        if (!result.success) {
            throw new Error(result.error || 'Token verification failed');
        }

        if (!result.user || !result.user._id) {
            throw new Error('Invalid user data from auth service');
        }

        return result.user._id;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Authentication failed: ${error.message}`);
        }
        throw new Error('Authentication failed');
    }
}

function buildTransactionFilter(userId: string, query: QueryParams): any {
    const filter: any = { userId };

    if (query.category) {
        filter.category = query.category;
    }

    if (query.type) {
        filter.type = query.type;
    }

    if (query.startDate || query.endDate) {
        filter.date = {};
        if (query.startDate) {
            filter.date.$gte = new Date(query.startDate);
        }
        if (query.endDate) {
            filter.date.$lte = new Date(query.endDate);
        }
    }

    if (query.tags) {
        const tagArray = query.tags.split(',').map(tag => tag.trim());
        filter.tags = { $in: tagArray };
    }

    if (query.search) {
        filter.$or = [
            { description: { $regex: query.search, $options: 'i' } },
            { category: { $regex: query.search, $options: 'i' } }
        ];
    }

    return filter;
}

// CRUD operations
async function createTransaction(userId: string, transactionData: TransactionRequest): Promise<TransactionResponse> {
    try {
        const db = await connectToDatabase();
        const transactions: Collection<Transaction> = db.collection('transactions');

        const newTransaction: Transaction = {
            userId,
            amount: transactionData.amount,
            description: transactionData.description,
            category: transactionData.category,
            date: new Date(transactionData.date),
            type: transactionData.type,
            tags: transactionData.tags || [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await transactions.insertOne(newTransaction);
        const createdTransaction = await transactions.findOne({ _id: result.insertedId });

        return {
            success: true,
            data: createdTransaction || undefined
        };
    } catch (error) {
        console.error('Create transaction error:', error);
        return {
            success: false,
            error: 'Failed to create transaction'
        };
    }
}

async function getTransactions(userId: string, query: QueryParams): Promise<TransactionResponse> {
    try {
        const db = await connectToDatabase();
        const transactions: Collection<Transaction> = db.collection('transactions');

        const filter = buildTransactionFilter(userId, query);
        const page = parseInt(query.page || '1');
        const limit = parseInt(query.limit || '20');
        const skip = (page - 1) * limit;

        // Build sort options
        const sortBy = query.sortBy || 'date';
        const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
        const sort: any = { [sortBy]: sortOrder };

        // Get transactions with pagination
        const [transactionList, total] = await Promise.all([
            transactions.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .toArray(),
            transactions.countDocuments(filter)
        ]);

        return {
            success: true,
            data: transactionList,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error('Get transactions error:', error);
        return {
            success: false,
            error: 'Failed to retrieve transactions'
        };
    }
}

async function getTransactionById(userId: string, transactionId: string): Promise<TransactionResponse> {
    try {
        const db = await connectToDatabase();
        const transactions: Collection<Transaction> = db.collection('transactions');

        if (!ObjectId.isValid(transactionId)) {
            return {
                success: false,
                error: 'Invalid transaction ID'
            };
        }

        const transaction = await transactions.findOne({
            _id: new ObjectId(transactionId),
            userId
        });

        if (!transaction) {
            return {
                success: false,
                error: 'Transaction not found'
            };
        }

        return {
            success: true,
            data: transaction
        };
    } catch (error) {
        console.error('Get transaction by ID error:', error);
        return {
            success: false,
            error: 'Failed to retrieve transaction'
        };
    }
}

async function updateTransaction(userId: string, transactionId: string, updates: Partial<TransactionRequest>): Promise<TransactionResponse> {
    try {
        const db = await connectToDatabase();
        const transactions: Collection<Transaction> = db.collection('transactions');

        if (!ObjectId.isValid(transactionId)) {
            return {
                success: false,
                error: 'Invalid transaction ID'
            };
        }

        const updateData: any = {
            ...updates,
            updatedAt: new Date()
        };

        if (updates.date) {
            updateData.date = new Date(updates.date);
        }

        const result = await transactions.findOneAndUpdate(
            {
                _id: new ObjectId(transactionId),
                userId
            },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (!result) {
            return {
                success: false,
                error: 'Transaction not found'
            };
        }

        return {
            success: true,
            data: result
        };
    } catch (error) {
        console.error('Update transaction error:', error);
        return {
            success: false,
            error: 'Failed to update transaction'
        };
    }
}

async function deleteTransaction(userId: string, transactionId: string): Promise<TransactionResponse> {
    try {
        const db = await connectToDatabase();
        const transactions: Collection<Transaction> = db.collection('transactions');

        if (!ObjectId.isValid(transactionId)) {
            return {
                success: false,
                error: 'Invalid transaction ID'
            };
        }

        const result = await transactions.findOneAndDelete({
            _id: new ObjectId(transactionId),
            userId
        });

        if (!result) {
            return {
                success: false,
                error: 'Transaction not found'
            };
        }

        return {
            success: true,
            data: result
        };
    } catch (error) {
        console.error('Delete transaction error:', error);
        return {
            success: false,
            error: 'Failed to delete transaction'
        };
    }
}

export default {
    function: async (request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply): Promise<any> => {
        // Enable CORS
        reply.header('Access-Control-Allow-Origin', '*');
        reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (request.method === 'OPTIONS') {
            reply.code(200);
            return {};
        }

        const method = request.method;
        const query = request.query as QueryParams;

        try {
            // Get user ID from token
            const userId = await getUserFromToken(request.headers.authorization);

            switch (method) {
                case 'POST':
                    // POST /transaction-api - Create new transaction
                    if (!request.body) {
                        reply.code(400);
                        return {
                            success: false,
                            error: 'Request body is required',
                            function: 'transaction-api',
                            runtime: 'TypeScript'
                        };
                    }

                    const result = await createTransaction(userId, request.body as TransactionRequest);
                    reply.code(result.success ? 201 : 400);
                    return {
                        ...result,
                        function: 'transaction-api',
                        runtime: 'TypeScript'
                    };

                case 'GET':
                    if (query.id) {
                        // GET /transaction-api?id=123 - Get specific transaction
                        const result = await getTransactionById(userId, query.id);
                        reply.code(result.success ? 200 : 404);
                        return {
                            ...result,
                            function: 'transaction-api',
                            runtime: 'TypeScript'
                        };
                    } else {
                        // GET /transaction-api - Get all transactions with filters
                        const result = await getTransactions(userId, query);
                        reply.code(200);
                        return {
                            ...result,
                            function: 'transaction-api',
                            runtime: 'TypeScript'
                        };
                    }

                case 'PUT':
                    // PUT /transaction-api?id=123 - Update specific transaction
                    if (!query.id) {
                        reply.code(400);
                        return {
                            success: false,
                            error: 'Transaction ID is required in query params',
                            function: 'transaction-api',
                            runtime: 'TypeScript'
                        };
                    }

                    if (!request.body) {
                        reply.code(400);
                        return {
                            success: false,
                            error: 'Request body is required',
                            function: 'transaction-api',
                            runtime: 'TypeScript'
                        };
                    }

                    const updateResult = await updateTransaction(userId, query.id, request.body as Partial<TransactionRequest>);
                    reply.code(updateResult.success ? 200 : 404);
                    return {
                        ...updateResult,
                        function: 'transaction-api',
                        runtime: 'TypeScript'
                    };

                case 'DELETE':
                    // DELETE /transaction-api?id=123 - Delete specific transaction
                    if (!query.id) {
                        reply.code(400);
                        return {
                            success: false,
                            error: 'Transaction ID is required in query params',
                            function: 'transaction-api',
                            runtime: 'TypeScript'
                        };
                    }

                    const deleteResult = await deleteTransaction(userId, query.id);
                    reply.code(deleteResult.success ? 200 : 404);
                    return {
                        ...deleteResult,
                        function: 'transaction-api',
                        runtime: 'TypeScript'
                    };

                default:
                    reply.code(405);
                    return {
                        success: false,
                        error: 'Method not allowed',
                        function: 'transaction-api',
                        runtime: 'TypeScript'
                    };
            }
        } catch (error) {
            console.error('Transaction API error:', error);

            const errorMessage = (error as Error).message;
            if (errorMessage === 'Authorization token required' || errorMessage.includes('Authentication failed')) {
                reply.code(401);
                return {
                    success: false,
                    error: errorMessage,
                    function: 'transaction-api',
                    runtime: 'TypeScript'
                };
            }

            reply.code(500);
            return {
                success: false,
                error: 'Internal server error',
                details: process.env['NODE_ENV'] === 'development' ? errorMessage : undefined,
                function: 'transaction-api',
                runtime: 'TypeScript'
            };
        }
    },
    name: 'transaction-api',
};