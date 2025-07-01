package main

import (
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net/http"
	"strings"
	"time"
)

type Budget struct {
	ID       int     `json:"id"`
	Category string  `json:"category"`
	Amount   float64 `json:"amount"`
	Period   string  `json:"period"` // monthly, weekly, daily
}

type BudgetAnalysis struct {
	Category       string  `json:"category"`
	Budgeted       float64 `json:"budgeted"`
	Spent          float64 `json:"spent"`
	Remaining      float64 `json:"remaining"`
	PercentageUsed float64 `json:"percentage_used"`
	Status         string  `json:"status"` // on_track, warning, over_budget
	DaysRemaining  int     `json:"days_remaining"`
	PredictedSpend float64 `json:"predicted_spend"`
	Recommendation string  `json:"recommendation"`
}

type OverallBudgetHealth struct {
	TotalBudgeted    float64          `json:"total_budgeted"`
	TotalSpent       float64          `json:"total_spent"`
	TotalRemaining   float64          `json:"total_remaining"`
	OverallStatus    string           `json:"overall_status"`
	BudgetCategories []BudgetAnalysis `json:"budget_categories"`
	Alerts           []string         `json:"alerts"`
	HealthScore      float64          `json:"health_score"`
	Recommendations  []string         `json:"recommendations"`
}

type Transaction struct {
	ID          string  `json:"_id"`
	UserID      string  `json:"userId"`
	Description string  `json:"description"`
	Amount      float64 `json:"amount"`
	Category    string  `json:"category"`
	Date        string  `json:"date"`
	Type        string  `json:"type"`
	CreatedAt   string  `json:"createdAt"`
}

type TransactionAPIResponse struct {
	Success  bool          `json:"success"`
	Data     []Transaction `json:"data"`
	Function string        `json:"function"`
	Runtime  string        `json:"runtime"`
}

// Fetch transactions from transaction-api
func fetchTransactions(authToken string) ([]Transaction, error) {
	// Get the base URL from environment or use default
	baseURL := "https://freeserverless.com/invok/cf749b32-a29a-4080-bbd0-87a66a9d1b00"

	client := &http.Client{Timeout: 30 * time.Second}
	req, err := http.NewRequest("GET", baseURL+"/transaction-api", nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	if authToken != "" {
		req.Header.Set("Authorization", "Bearer "+authToken)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch transactions: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == 401 {
		return nil, fmt.Errorf("unauthorized - invalid or missing auth token")
	}

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("transaction API returned status %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %v", err)
	}

	var apiResponse TransactionAPIResponse
	if err := json.Unmarshal(body, &apiResponse); err != nil {
		return nil, fmt.Errorf("failed to parse response: %v", err)
	}

	if !apiResponse.Success {
		return nil, fmt.Errorf("transaction API returned unsuccessful response")
	}

	return apiResponse.Data, nil
}

// Generate realistic budgets based on spending patterns
func generateBudgetsFromSpending(transactions []Transaction) []Budget {
	spendingByCategory := make(map[string]float64)

	// Calculate total spending per category
	for _, transaction := range transactions {
		if transaction.Type == "expense" {
			spendingByCategory[transaction.Category] += transaction.Amount
		}
	}

	var budgets []Budget
	budgetMultiplier := 1.3 // Set budgets 30% higher than current spending

	// Create budgets for each category with realistic amounts
	for category, totalSpent := range spendingByCategory {
		if totalSpent > 0 {
			budgetAmount := totalSpent * budgetMultiplier

			// Apply category-specific adjustments for realistic budgets
			switch strings.ToLower(category) {
			case "housing":
				budgetAmount = totalSpent * 1.05 // Housing is usually fixed
			case "utilities":
				budgetAmount = totalSpent * 1.15 // Utilities have some variation
			case "food":
				budgetAmount = totalSpent * 1.25 // Food can be optimized
			case "transportation":
				budgetAmount = totalSpent * 1.20 // Transportation varies
			case "entertainment":
				budgetAmount = totalSpent * 1.50 // Entertainment is flexible
			case "shopping":
				budgetAmount = totalSpent * 1.40 // Shopping can be reduced
			case "healthcare":
				budgetAmount = totalSpent * 1.10 // Healthcare is mostly needed
			case "education":
				budgetAmount = totalSpent * 1.20 // Education investment
			default:
				budgetAmount = totalSpent * 1.30 // Default 30% buffer
			}

			budget := Budget{
				ID:       len(budgets) + 1,
				Category: category,
				Amount:   math.Round(budgetAmount*100) / 100, // Round to 2 decimal places
				Period:   "monthly",
			}
			budgets = append(budgets, budget)
		}
	}

	return budgets
}

// Calculate days passed and remaining in current month
func calculateMonthProgress() (daysPassed int, daysRemaining int) {
	now := time.Now()
	year, month, _ := now.Date()

	// First day of current month
	firstDay := time.Date(year, month, 1, 0, 0, 0, 0, now.Location())

	// First day of next month
	nextMonth := firstDay.AddDate(0, 1, 0)

	// Days passed since start of month
	daysPassed = int(now.Sub(firstDay).Hours() / 24)

	// Total days in month
	totalDays := int(nextMonth.Sub(firstDay).Hours() / 24)

	// Days remaining
	daysRemaining = totalDays - daysPassed

	if daysPassed <= 0 {
		daysPassed = 1 // Minimum 1 day passed
	}
	if daysRemaining <= 0 {
		daysRemaining = 1 // Minimum 1 day remaining
	}

	return daysPassed, daysRemaining
}

// High-performance budget analysis engine
func analyzeBudgets(budgets []Budget, transactions []Transaction) OverallBudgetHealth {
	budgetMap := make(map[string]Budget)
	spendingMap := make(map[string]float64)

	// Create budget lookup map
	for _, budget := range budgets {
		budgetMap[budget.Category] = budget
	}

	// Calculate spending by category for current month only
	currentTime := time.Now()
	currentMonth := currentTime.Month()
	currentYear := currentTime.Year()

	for _, transaction := range transactions {
		if transaction.Type == "expense" {
			// Parse transaction date
			transactionTime, err := time.Parse("2006-01-02T15:04:05.000Z", transaction.Date)
			if err != nil {
				// Try alternative date format
				transactionTime, err = time.Parse("2006-01-02", transaction.Date)
				if err != nil {
					continue // Skip invalid dates
				}
			}

			// Only include transactions from current month
			if transactionTime.Month() == currentMonth && transactionTime.Year() == currentYear {
				spendingMap[transaction.Category] += transaction.Amount
			}
		}
	}

	var analyses []BudgetAnalysis
	var totalBudgeted, totalSpent float64
	var alerts []string

	daysPassed, daysRemaining := calculateMonthProgress()

	// Analyze each budget category
	for category, budget := range budgetMap {
		spent := spendingMap[category]
		remaining := budget.Amount - spent
		percentageUsed := 0.0
		if budget.Amount > 0 {
			percentageUsed = (spent / budget.Amount) * 100
		}

		// Determine status
		var status string
		var recommendation string

		if percentageUsed >= 100 {
			status = "over_budget"
			recommendation = "⚠️ Over budget! Reduce spending immediately"
			alerts = append(alerts, category+" is over budget")
		} else if percentageUsed >= 80 {
			status = "warning"
			recommendation = "🔶 Approaching budget limit - spend carefully"
			alerts = append(alerts, category+" is approaching budget limit")
		} else if percentageUsed >= 60 {
			status = "on_track"
			recommendation = "👍 On track - maintain current spending"
		} else {
			status = "on_track"
			recommendation = "💚 Well under budget - good job!"
		}

		// Predictive spending analysis
		spendingRate := 0.0
		if daysPassed > 0 {
			spendingRate = spent / float64(daysPassed)
		}

		totalDaysInMonth := daysPassed + daysRemaining
		predictedSpend := spendingRate * float64(totalDaysInMonth)

		analysis := BudgetAnalysis{
			Category:       category,
			Budgeted:       budget.Amount,
			Spent:          spent,
			Remaining:      remaining,
			PercentageUsed: math.Round(percentageUsed*100) / 100,
			Status:         status,
			DaysRemaining:  daysRemaining,
			PredictedSpend: math.Round(predictedSpend*100) / 100,
			Recommendation: recommendation,
		}

		analyses = append(analyses, analysis)
		totalBudgeted += budget.Amount
		totalSpent += spent
	}

	totalRemaining := totalBudgeted - totalSpent
	overallPercentage := 0.0
	if totalBudgeted > 0 {
		overallPercentage = (totalSpent / totalBudgeted) * 100
	}

	var overallStatus string
	if overallPercentage >= 90 {
		overallStatus = "critical"
	} else if overallPercentage >= 75 {
		overallStatus = "warning"
	} else {
		overallStatus = "healthy"
	}

	// Calculate health score (0-100)
	healthScore := calculateBudgetHealthScore(analyses)

	// Generate recommendations
	recommendations := generateBudgetRecommendations(OverallBudgetHealth{
		TotalBudgeted:    totalBudgeted,
		TotalSpent:       totalSpent,
		TotalRemaining:   totalRemaining,
		OverallStatus:    overallStatus,
		BudgetCategories: analyses,
		Alerts:           alerts,
		HealthScore:      healthScore,
	})

	return OverallBudgetHealth{
		TotalBudgeted:    math.Round(totalBudgeted*100) / 100,
		TotalSpent:       math.Round(totalSpent*100) / 100,
		TotalRemaining:   math.Round(totalRemaining*100) / 100,
		OverallStatus:    overallStatus,
		BudgetCategories: analyses,
		Alerts:           alerts,
		HealthScore:      math.Round(healthScore*100) / 100,
		Recommendations:  recommendations,
	}
}

func calculateBudgetHealthScore(analyses []BudgetAnalysis) float64 {
	if len(analyses) == 0 {
		return 50 // Neutral score when no data
	}

	totalScore := 0.0
	for _, analysis := range analyses {
		categoryScore := 100.0

		// Deduct points based on budget usage
		if analysis.PercentageUsed >= 100 {
			categoryScore = 0 // Over budget = 0 points
		} else if analysis.PercentageUsed >= 90 {
			categoryScore = 20
		} else if analysis.PercentageUsed >= 80 {
			categoryScore = 50
		} else if analysis.PercentageUsed >= 70 {
			categoryScore = 75
		} else if analysis.PercentageUsed >= 50 {
			categoryScore = 90
		}
		// else stays at 100

		totalScore += categoryScore
	}

	return totalScore / float64(len(analyses))
}

func generateBudgetRecommendations(health OverallBudgetHealth) []string {
	var recommendations []string

	if health.HealthScore >= 80 {
		recommendations = append(recommendations, "🌟 Excellent budget management! Keep it up!")
		recommendations = append(recommendations, "💡 Consider increasing your savings rate")
	} else if health.HealthScore >= 60 {
		recommendations = append(recommendations, "👍 Good budget control with room for improvement")
		recommendations = append(recommendations, "📊 Review categories approaching their limits")
	} else {
		recommendations = append(recommendations, "⚠️ Budget needs attention - consider reviewing spending habits")
		recommendations = append(recommendations, "🎯 Focus on reducing spending in over-budget categories")
	}

	if health.OverallStatus == "critical" {
		recommendations = append(recommendations, "🚨 Critical: Review all expenses immediately")
		recommendations = append(recommendations, "✂️ Cut non-essential spending this month")
	}

	if len(health.Alerts) > 0 {
		recommendations = append(recommendations, "📊 Check category-specific alerts for details")
	}

	// Add specific recommendations based on spending patterns
	overBudgetCategories := []string{}
	for _, category := range health.BudgetCategories {
		if category.Status == "over_budget" {
			overBudgetCategories = append(overBudgetCategories, category.Category)
		}
	}

	if len(overBudgetCategories) > 0 {
		recommendations = append(recommendations,
			fmt.Sprintf("🎯 Focus on reducing: %s", strings.Join(overBudgetCategories, ", ")))
	}

	return recommendations
}

// High-performance budget analysis endpoint
func BudgetAnalyzerHandler(w http.ResponseWriter, r *http.Request) {
	// Enable CORS
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method == "GET" {
		// Extract auth token from Authorization header
		authHeader := r.Header.Get("Authorization")
		authToken := ""
		if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
			authToken = strings.TrimPrefix(authHeader, "Bearer ")
		}

		if authToken == "" {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]interface{}{
				"success":  false,
				"error":    "Authorization token required",
				"function": "budget-analyzer",
				"runtime":  "Go",
			})
			return
		}

		// Fetch real transactions from transaction-api
		transactions, err := fetchTransactions(authToken)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{
				"success":  false,
				"error":    fmt.Sprintf("Failed to fetch transactions: %v", err),
				"function": "budget-analyzer",
				"runtime":  "Go",
			})
			return
		}

		// Generate realistic budgets based on spending patterns
		budgets := generateBudgetsFromSpending(transactions)

		// Perform budget analysis
		startTime := time.Now()
		analysis := analyzeBudgets(budgets, transactions)
		processingTime := time.Since(startTime).Milliseconds()

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success":            true,
			"data":               analysis,
			"budgets":            budgets,
			"transaction_count":  len(transactions),
			"computed_at":        time.Now().Unix(),
			"processing_time_ms": processingTime,
			"function":           "budget-analyzer",
			"runtime":            "Go",
		})
		return
	}

	if r.Method == "POST" {
		authHeader := r.Header.Get("Authorization")
		authToken := ""
		if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
			authToken = strings.TrimPrefix(authHeader, "Bearer ")
		}

		var requestData struct {
			Budgets      []Budget      `json:"budgets"`
			Transactions []Transaction `json:"transactions"`
		}

		if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
			// If no custom data provided, fetch from transaction-api
			if authToken == "" {
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode(map[string]interface{}{
					"success": false,
					"error":   "Invalid request data and no auth token provided",
				})
				return
			}

			transactions, err := fetchTransactions(authToken)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]interface{}{
					"success": false,
					"error":   fmt.Sprintf("Failed to fetch transactions: %v", err),
				})
				return
			}

			requestData.Budgets = generateBudgetsFromSpending(transactions)
			requestData.Transactions = transactions
		}

		startTime := time.Now()
		analysis := analyzeBudgets(requestData.Budgets, requestData.Transactions)
		processingTime := time.Since(startTime).Milliseconds()

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success":            true,
			"data":               analysis,
			"budgets":            requestData.Budgets,
			"computed_at":        time.Now().Unix(),
			"processing_time_ms": processingTime,
			"function":           "budget-analyzer",
			"runtime":            "Go",
		})
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": false,
		"error":   "Method not allowed",
	})
}
