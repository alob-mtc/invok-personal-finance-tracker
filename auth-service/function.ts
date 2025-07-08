import { FastifyReply, FastifyRequest } from "fastify";
import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Joi from "joi";

// MongoDB connection
const MONGODB_URI = process.env['MONGODB_URI'];
const JWT_SECRET = process.env['JWT_SECRET'];

interface User {
    _id?: ObjectId;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
    isEmailVerified?: boolean;
    profile?: {
        avatar?: string;
        currency?: string;
        timezone?: string;
    };
}

interface LoginRequest {
    email: string;
    password: string;
}

interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

interface AuthResponse {
    success: boolean;
    data?: {
        user: Omit<User, 'password'>;
        token: string;
        expiresIn: string;
    };
    error?: string;
}

interface QueryParams {
    action?: string;
}

// Validation schemas
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

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

        // Create indexes
        await db.collection('users').createIndex({ email: 1 }, { unique: true });

        return db;
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw new Error('Database connection failed');
    }
}

// Helper functions
function generateToken(userId: string): string {
    return jwt.sign(
        { userId, type: 'access' },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
}

function verifyToken(token: string): any {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
}

async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
}

async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

function sanitizeUser(user: User): Omit<User, 'password'> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
}

// Auth service functions
async function registerUser(userData: RegisterRequest): Promise<AuthResponse> {
    try {
        const db = await connectToDatabase();
        const users: Collection<User> = db.collection('users');

        // Check if user already exists
        const existingUser = await users.findOne({ email: userData.email.toLowerCase() });
        if (existingUser) {
            return {
                success: false,
                error: 'User with this email already exists'
            };
        }

        // Hash password
        const hashedPassword = await hashPassword(userData.password);

        // Create user
        const newUser: User = {
            email: userData.email.toLowerCase(),
            password: hashedPassword,
            firstName: userData.firstName,
            lastName: userData.lastName,
            createdAt: new Date(),
            updatedAt: new Date(),
            isEmailVerified: false,
            profile: {
                currency: 'USD',
                timezone: 'America/New_York'
            }
        };

        const result = await users.insertOne(newUser);
        const createdUser = await users.findOne({ _id: result.insertedId });

        if (!createdUser) {
            throw new Error('Failed to create user');
        }

        // Generate JWT token
        const token = generateToken(createdUser._id!.toString());

        return {
            success: true,
            data: {
                user: sanitizeUser(createdUser),
                token,
                expiresIn: '24h'
            }
        };
    } catch (error) {
        console.error('Registration error:', error);
        return {
            success: false,
            error: 'Registration failed. Please try again.'
        };
    }
}

async function loginUser(credentials: LoginRequest): Promise<AuthResponse> {
    try {
        const db = await connectToDatabase();
        const users: Collection<User> = db.collection('users');

        // Find user by email
        const user = await users.findOne({ email: credentials.email.toLowerCase() });
        if (!user) {
            return {
                success: false,
                error: 'Invalid email or password'
            };
        }

        // Verify password
        const isPasswordValid = await comparePassword(credentials.password, user.password);
        if (!isPasswordValid) {
            return {
                success: false,
                error: 'Invalid email or password'
            };
        }

        // Update last login
        await users.updateOne(
            { _id: user._id },
            { $set: { updatedAt: new Date() } }
        );

        // Generate JWT token
        const token = generateToken(user._id!.toString());

        return {
            success: true,
            data: {
                user: sanitizeUser(user),
                token,
                expiresIn: '24h'
            }
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: 'Login failed. Please try again.'
        };
    }
}

async function verifyUserToken(token: string): Promise<{ success: boolean; user?: Omit<User, 'password'>; error?: string }> {
    try {
        const decoded = verifyToken(token);
        const db = await connectToDatabase();
        const users: Collection<User> = db.collection('users');

        // Convert string userId to ObjectId for MongoDB lookup
        const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
        if (!user) {
            return {
                success: false,
                error: 'User not found'
            };
        }

        return {
            success: true,
            user: sanitizeUser(user)
        };
    } catch (error) {
        return {
            success: false,
            error: 'Invalid or expired token'
        };
    }
}

export default {
    // The name of the route/function (AUTO-GENERATED: do not change manually)
    name: 'auth-service',
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
        const { action } = request.query as QueryParams;

        try {
            switch (method) {
                case 'POST':
                    if (action === 'register') {
                        // POST /auth-service?action=register - User registration
                        const { error, value } = registerSchema.validate(request.body);
                        if (error) {
                            reply.code(400);
                            return {
                                success: false,
                                error: error.details[0].message,
                                function: 'auth-service',
                                runtime: 'TypeScript'
                            };
                        }

                        const result = await registerUser(value as RegisterRequest);
                        reply.code(result.success ? 201 : 400);
                        return {
                            ...result,
                            function: 'auth-service',
                            runtime: 'TypeScript'
                        };
                    } else if (action === 'login') {
                        // POST /auth-service?action=login - User login
                        const { error, value } = loginSchema.validate(request.body);
                        if (error) {
                            reply.code(400);
                            return {
                                success: false,
                                error: error.details[0].message,
                                function: 'auth-service',
                                runtime: 'TypeScript'
                            };
                        }

                        const result = await loginUser(value as LoginRequest);
                        reply.code(result.success ? 200 : 401);
                        return {
                            ...result,
                            function: 'auth-service',
                            runtime: 'TypeScript'
                        };
                    } else {
                        reply.code(400);
                        return {
                            success: false,
                            error: 'Invalid action. Use action=register or action=login',
                            function: 'auth-service',
                            runtime: 'TypeScript'
                        };
                    }

                case 'GET':
                    if (action === 'verify') {
                        // GET /auth-service?action=verify - Verify JWT token
                        const authHeader = request.headers.authorization;
                        if (!authHeader || !authHeader.startsWith('Bearer ')) {
                            reply.code(401);
                            return {
                                success: false,
                                error: 'Authorization token required',
                                function: 'auth-service',
                                runtime: 'TypeScript'
                            };
                        }

                        const token = authHeader.substring(7);
                        const result = await verifyUserToken(token);
                        reply.code(result.success ? 200 : 401);
                        return {
                            ...result,
                            function: 'auth-service',
                            runtime: 'TypeScript'
                        };
                    } else if (action === 'health') {
                        // GET /auth-service?action=health - Health check
                        reply.code(200);
                        return {
                            success: true,
                            status: 'healthy',
                            timestamp: new Date().toISOString(),
                            function: 'auth-service',
                            runtime: 'TypeScript'
                        };
                    } else {
                        reply.code(400);
                        return {
                            success: false,
                            error: 'Invalid action. Use action=verify or action=health',
                            function: 'auth-service',
                            runtime: 'TypeScript'
                        };
                    }

                default:
                    reply.code(405);
                    return {
                        success: false,
                        error: 'Method not allowed',
                        function: 'auth-service',
                        runtime: 'TypeScript'
                    };
            }
        } catch (error) {
            console.error('Auth service error:', error);
            reply.code(500);
            return {
                success: false,
                error: 'Internal server error',
                details: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined,
                function: 'auth-service',
                runtime: 'TypeScript'
            };
        }
    },
};