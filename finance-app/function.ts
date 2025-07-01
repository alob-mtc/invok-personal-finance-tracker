import { FastifyReply, FastifyRequest } from "fastify";

interface QueryParams {
    page?: string;
}

export default {
    // The name of the route/function (AUTO-GENERATED: do not change manually)
    name: 'finance-app',
    function: async (_request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply): Promise<any> => {
        reply.type('text/html');

        // Set CSP headers to allow inline scripts
        reply.header('Content-Security-Policy', "script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' 'unsafe-inline' https: data:;");

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Personal Finance Tracker - Powered by Invok</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif;
            background: linear-gradient(135deg, #4f46e5 0%, #3b4cca 100%);
            min-height: 100vh;
            color: #1f2937;
            line-height: 1.6;
        }
        
        /* Main App Container */
        .app-wrapper {
            padding: 2rem;
            min-height: 100vh;
        }
        
        .main-container {
            background: white;
            border-radius: 32px;
            padding: 0;
            max-width: 1400px;
            margin: 0 auto;
            min-height: calc(100vh - 4rem);
            display: flex;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        /* Sidebar Navigation */
        .sidebar {
            width: 280px;
            background: #f8fafc;
            padding: 2rem 1.5rem;
            border-right: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 3rem;
        }
        
        .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #4f46e5, #3b4cca);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 1.125rem;
        }
        
        .logo-text {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1f2937;
        }
        
        .nav-menu {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .nav-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #64748b;
        }
        
        .nav-item:hover {
            background: #e2e8f0;
            color: #1f2937;
        }
        
        .nav-item.active {
            background: #4f46e5;
            color: white;
        }
        
        .nav-icon {
            font-size: 1.25rem;
            width: 24px;
            text-align: center;
        }
        
        .nav-text {
            font-weight: 500;
            font-size: 0.875rem;
        }
        
        /* Main Content Area */
        .content-area {
            flex: 1;
            padding: 2rem;
            overflow-y: auto;
        }
        
        /* Header */
        .content-header {
            display: flex;
            justify-content: between;
            align-items: center;
            margin-bottom: 2rem;
        }
        
        .page-title {
            font-size: 2rem;
            font-weight: 700;
            color: #1f2937;
        }
        
        .header-actions {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-left: auto;
        }
        
        .search-bar {
            position: relative;
        }
        
        .search-input {
            width: 300px;
            padding: 0.75rem 1rem 0.75rem 2.5rem;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            background: #f8fafc;
            font-size: 0.875rem;
            outline: none;
            transition: all 0.2s ease;
        }
        
        .search-input:focus {
            border-color: #4f46e5;
            background: white;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
        
        .search-icon {
            position: absolute;
            left: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            color: #9ca3af;
        }
        
        .user-profile {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.5rem;
            border-radius: 12px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .user-profile:hover {
            background: #f1f5f9;
        }
        
        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
        }
        
        .user-name {
            font-weight: 600;
            color: #1f2937;
            font-size: 0.875rem;
        }
        
        /* Stats Cards */
        .stats-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .stat-card {
            background: #f8fafc;
            border-radius: 16px;
            padding: 1.5rem;
            position: relative;
            overflow: hidden;
            z-index: 1;
        }
        
        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--accent-color);
            z-index: -1;
        }
        
        .stat-card.income::before {
            background: #4f46e5;
        }
        
        .stat-card.expense::before {
            background: #f59e0b;
        }
        
        .stat-card.health::before {
            background: #10b981;
        }
        
        .stat-label {
            font-size: 0.75rem;
            font-weight: 500;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 0.5rem;
            position: relative;
            z-index: 2;
        }
        
        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #1f2937;
            position: relative;
            z-index: 2;
        }
        
        .stat-icon {
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            opacity: 0.1;
            z-index: 1;
        }
        
        /* Right Sidebar */
        .right-sidebar {
            width: 320px;
            background: #f8fafc;
            padding: 2rem 1.5rem;
            border-left: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
        
        /* Credit Card Widget */
        .credit-card {
            background: linear-gradient(135deg, #4f46e5 0%, #3b4cca 100%);
            border-radius: 16px;
            padding: 1.5rem;
            color: white;
            position: relative;
            overflow: hidden;
        }
        
        .credit-card::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        }
        
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .card-type {
            font-size: 0.75rem;
            font-weight: 500;
            opacity: 0.8;
        }
        
        .card-brand {
            font-size: 1.25rem;
            font-weight: 700;
        }
        
        .card-balance {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }
        
        .card-number {
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
            margin-bottom: 1rem;
            opacity: 0.9;
        }
        
        .card-footer {
            display: flex;
            justify-content: space-between;
            font-size: 0.75rem;
            opacity: 0.8;
        }
        
        /* Transaction List */
        .widget {
            background: white;
            border-radius: 16px;
            padding: 1.5rem;
            border: 1px solid #e2e8f0;
            position: relative;
            z-index: 1;
        }
        
        .widget-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .widget-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: #1f2937;
        }
        
        .widget-action {
            color: #4f46e5;
            font-size: 0.875rem;
            cursor: pointer;
            font-weight: 500;
        }
        
        .transaction-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .transaction-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            position: relative;
            z-index: 1;
        }
        
        .transaction-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.125rem;
        }
        
        .transaction-icon.income {
            background: #dcfce7;
            color: #16a34a;
        }
        
        .transaction-icon.expense {
            background: #fef3c7;
            color: #d97706;
        }
        
        .transaction-details {
            flex: 1;
        }
        
        .transaction-name {
            font-weight: 500;
            color: #1f2937;
            font-size: 0.875rem;
            margin-bottom: 0.125rem;
        }
        
        .transaction-date {
            font-size: 0.75rem;
            color: #6b7280;
        }
        
        .transaction-amount {
            font-weight: 600;
            font-size: 0.875rem;
        }
        
        .amount-positive {
            color: #16a34a;
        }
        
        .amount-negative {
            color: #dc2626;
        }
        
        /* Chart Area */
        .chart-section {
            background: white;
            border-radius: 16px;
            padding: 1.5rem;
            border: 1px solid #e2e8f0;
            margin-bottom: 2rem;
        }
        
        .chart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .chart-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: #1f2937;
        }
        
        .chart-filter {
            background: #4f46e5;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 500;
            cursor: pointer;
        }
        
        /* Buttons */
        .btn {
            padding: 0.75rem 1.5rem;
            border-radius: 12px;
            border: none;
            font-weight: 500;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-primary {
            background: #4f46e5;
            color: white;
        }
        
        .btn-primary:hover {
            background: #4338ca;
        }
        
        .btn-secondary {
            background: #f1f5f9;
            color: #4f46e5;
        }
        
        .btn-secondary:hover {
            background: #e2e8f0;
        }
        
        /* Forms */
        .transaction-form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        
        .transaction-form .form-group:last-child {
            grid-column: 1 / -1;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #374151;
            font-size: 0.875rem;
        }
        
        .form-input, .form-select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            background: white;
            color: #374151;
            font-size: 0.875rem;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        
        .form-input:focus, .form-select:focus {
            outline: none;
            border-color: #4f46e5;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
        
        /* Auth Container */
        .auth-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
        }
        
        .auth-card {
            background: white;
            border-radius: 24px;
            padding: 3rem;
            max-width: 400px;
            width: 100%;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .auth-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .auth-title {
            font-size: 1.875rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 0.5rem;
        }
        
        .auth-subtitle {
            color: #6b7280;
            font-size: 0.875rem;
        }
        
        .auth-tabs {
            display: flex;
            background: #f1f5f9;
            border-radius: 12px;
            padding: 0.25rem;
            margin-bottom: 2rem;
        }
        
        .auth-tab {
            flex: 1;
            padding: 0.75rem;
            border: none;
            background: transparent;
            color: #6b7280;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: 500;
            font-size: 0.875rem;
        }
        
        .auth-tab.active {
            background: white;
            color: #1f2937;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        
        /* Utilities */
        .hidden {
            display: none !important;
        }
        
        .loading {
            opacity: 0.6;
            pointer-events: none;
        }
        
        .text-center {
            text-align: center;
        }
        
        .empty-state {
            text-align: center;
            padding: 3rem 1rem;
            color: #6b7280;
        }
        
        .empty-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }
        
        .empty-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 0.5rem;
        }
        
        .empty-subtitle {
            font-size: 0.875rem;
            color: #6b7280;
        }
        
        /* Messages */
        .error-message {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 1rem;
            color: #dc2626;
            font-size: 0.875rem;
            margin: 1rem 0;
        }
        
        .success-message {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            padding: 1rem;
            color: #16a34a;
            font-size: 0.875rem;
            margin: 1rem 0;
        }
        
        /* Mobile Navigation Toggle */
        .mobile-nav-toggle {
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #4f46e5;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 8px;
            transition: background-color 0.2s;
        }
        
        .mobile-nav-toggle:hover {
            background: #f1f5f9;
        }
        
        .mobile-nav-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
        }
        
        .mobile-nav-overlay.active {
            display: block;
        }
        
        /* Responsive Breakpoints */
        @media (max-width: 1200px) {
            .main-container {
                max-width: 100%;
                margin: 0;
            }
            
            .right-sidebar {
                width: 280px;
            }
        }
        
        @media (max-width: 1024px) {
            .main-container {
                flex-direction: column;
                min-height: auto;
            }
            
            .sidebar {
                width: 100%;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 1.5rem;
                border-right: none;
                border-bottom: 1px solid #e2e8f0;
            }
            
            .nav-menu {
                flex-direction: row;
                gap: 0.5rem;
                margin-bottom: 0;
            }
            
            .nav-item {
                padding: 0.75rem 1rem;
                border-radius: 8px;
                min-width: auto;
            }
            
            .nav-text {
                display: none;
            }
            
            .nav-icon {
                font-size: 1.125rem;
            }
            
            .right-sidebar {
                width: 100%;
                border-left: none;
                border-top: 1px solid #e2e8f0;
                flex-direction: row;
                gap: 1.5rem;
                padding: 1.5rem;
            }
            
            .credit-card,
            .widget {
                flex: 1;
            }
            
            .stats-row {
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
            }
            
            .stat-card:last-child {
                grid-column: 1 / -1;
            }
            
            .content-header {
                flex-direction: column;
                gap: 1rem;
                align-items: stretch;
            }
            
            .header-actions {
                justify-content: space-between;
                margin-left: 0;
            }
            
            .search-input {
                width: 250px;
            }
        }
        
        @media (max-width: 768px) {
            .app-wrapper {
                padding: 0.5rem;
            }
            
            .main-container {
                border-radius: 16px;
            }
            
            .sidebar {
                padding: 1rem;
                position: relative;
            }
            
            .logo-text {
                font-size: 1.125rem;
            }
            
            .nav-menu {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                margin-top: 0.5rem;
                padding: 0.5rem;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                flex-direction: column;
                gap: 0.25rem;
                z-index: 1000;
                display: none;
            }
            
            .nav-menu.mobile-open {
                display: flex;
            }
            
            .nav-item {
                padding: 0.75rem 1rem;
                border-radius: 8px;
                width: 100%;
                justify-content: flex-start;
            }
            
            .nav-text {
                display: block;
                margin-left: 0.5rem;
            }
            
            .nav-icon {
                width: 20px;
                text-align: center;
            }
            
            .mobile-nav-toggle {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .content-area {
                padding: 1rem;
            }
            
            .page-title {
                font-size: 1.5rem;
            }
            
            .header-actions {
                flex-direction: column;
                gap: 0.75rem;
            }
            
            .search-bar {
                order: 2;
                width: 100%;
            }
            
            .search-input {
                width: 100%;
            }
            
            .user-profile {
                order: 1;
                align-self: flex-end;
            }
            
            .user-name {
                display: none;
            }
            
            .stats-row {
                grid-template-columns: 1fr;
                gap: 0.75rem;
            }
            
            .stat-card {
                padding: 1.25rem;
            }
            
            .stat-value {
                font-size: 1.5rem;
            }
            
            .right-sidebar {
                flex-direction: column;
                gap: 1rem;
                padding: 1rem;
            }
            
            .credit-card {
                padding: 1.25rem;
            }
            
            .card-balance {
                font-size: 1.5rem;
            }
            
            .transaction-list {
                gap: 0.75rem;
            }
            
            .transaction-item {
                padding: 0.75rem;
                background: #f8fafc;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
            }
            
            .transaction-amount {
                font-size: 0.875rem;
                font-weight: 600;
            }
            
            .widget {
                padding: 1rem;
            }
            
            .widget-header {
                flex-direction: column;
                gap: 0.75rem;
                align-items: stretch;
            }
            
            .widget-action {
                align-self: flex-start;
            }
            
            .btn {
                padding: 0.875rem 1.25rem;
                font-size: 0.875rem;
                min-height: 44px; /* Minimum touch target */
            }
            
            .form-input,
            .form-select {
                padding: 0.875rem;
                font-size: 16px; /* Prevent zoom on iOS */
                min-height: 44px;
            }
            
            .auth-card {
                padding: 2rem 1.5rem;
                margin: 1rem;
                max-width: none;
                width: auto;
            }
            
                         .auth-title {
                 font-size: 1.5rem;
             }
             
             .transaction-form {
                 grid-template-columns: 1fr;
             }
        }
        
        @media (max-width: 480px) {
            .app-wrapper {
                padding: 0.25rem;
            }
            
            .main-container {
                border-radius: 12px;
            }
            
            .sidebar {
                padding: 0.75rem;
            }
            
            .logo-icon {
                width: 32px;
                height: 32px;
                font-size: 1rem;
            }
            
            .logo-text {
                font-size: 1rem;
            }
            
            .content-area {
                padding: 0.75rem;
            }
            
            .page-title {
                font-size: 1.25rem;
            }
            
            .stats-row {
                gap: 0.5rem;
            }
            
            .stat-card {
                padding: 1rem;
            }
            
            .stat-label {
                font-size: 0.6875rem;
            }
            
            .stat-value {
                font-size: 1.25rem;
            }
            
            .stat-icon {
                width: 32px;
                height: 32px;
                font-size: 1rem;
            }
            
            .right-sidebar {
                padding: 0.75rem;
            }
            
            .credit-card {
                padding: 1rem;
            }
            
            .card-balance {
                font-size: 1.25rem;
            }
            
            .card-number {
                font-size: 0.875rem;
            }
            
            .widget {
                padding: 0.75rem;
            }
            
            .widget-title {
                font-size: 1rem;
            }
            
            .transaction-item {
                padding: 0.5rem;
            }
            
            .transaction-icon {
                width: 32px;
                height: 32px;
                font-size: 1rem;
            }
            
            .transaction-name {
                font-size: 0.8125rem;
            }
            
            .transaction-date {
                font-size: 0.6875rem;
            }
            
            .transaction-amount {
                font-size: 0.8125rem;
            }
            
            .auth-card {
                padding: 1.5rem 1rem;
                margin: 0.5rem;
            }
            
            .form-group {
                margin-bottom: 1rem;
            }
            
            .form-input,
            .form-select {
                padding: 0.75rem;
            }
            
            .btn {
                padding: 0.75rem 1rem;
                font-size: 0.8125rem;
            }
        }
        
        /* Touch Improvements */
        @media (hover: none) and (pointer: coarse) {
            .nav-item,
            .btn,
            .user-profile,
            .transaction-item,
            .auth-tab {
                min-height: 44px;
                min-width: 44px;
            }
            
            .nav-item:hover,
            .btn:hover,
            .user-profile:hover {
                background: initial;
                transform: scale(0.98);
                transition: transform 0.1s ease;
            }
            
            .nav-item:active,
            .btn:active,
            .user-profile:active {
                transform: scale(0.95);
            }
        }
        
        /* Landscape Phone */
        @media (max-width: 768px) and (orientation: landscape) {
            .right-sidebar {
                flex-direction: row;
                gap: 1rem;
            }
            
            .stats-row {
                grid-template-columns: repeat(3, 1fr);
            }
            
            .stat-card:last-child {
                grid-column: auto;
            }
        }
    </style>
</head>
<body>
    <!-- Authentication Views -->
    <div id="auth-container" class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                <div class="logo">
                    <div class="logo-icon">₿</div>
                    <div class="logo-text">FinanceTracker</div>
                </div>
                <div class="auth-subtitle">Professional financial management platform</div>
            </div>

            <div class="auth-tabs">
                <button class="auth-tab active" onclick="showAuthTab('login')">Login</button>
                <button class="auth-tab" onclick="showAuthTab('register')">Sign Up</button>
            </div>

            <!-- Login Form -->
            <div id="login-form">
                <form id="loginForm">
                    <div class="form-group">
                        <label class="form-label">Email Address</label>
                        <input type="email" name="email" class="form-input" placeholder="Enter your email" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <input type="password" name="password" class="form-input" placeholder="Enter your password" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;" id="login-btn">Sign In</button>
                </form>
            </div>

            <!-- Register Form -->
            <div id="register-form" class="hidden">
                <form id="registerForm">
                    <div class="form-group">
                        <label class="form-label">First Name</label>
                        <input type="text" name="firstName" class="form-input" placeholder="Enter your first name" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Last Name</label>
                        <input type="text" name="lastName" class="form-input" placeholder="Enter your last name" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email Address</label>
                        <input type="email" name="email" class="form-input" placeholder="Enter your email" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <input type="password" name="password" class="form-input" placeholder="Create a secure password (min 6 characters)" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;" id="register-btn">Create Account</button>
                </form>
            </div>

            <div id="auth-messages"></div>
        </div>
    </div>

    <!-- Main App Container -->
    <div id="app-container" class="app-wrapper hidden">
        <div class="main-container">
            <!-- Left Sidebar -->
            <div class="sidebar">
                <div class="logo">
                    <div class="logo-icon">₿</div>
                    <div class="logo-text">FinanceTracker</div>
                </div>
                
                <button class="mobile-nav-toggle" onclick="toggleMobileNav()" aria-label="Toggle navigation">
                    ☰
                </button>
                
                <ul class="nav-menu" id="nav-menu">
                    <li class="nav-item active" onclick="showTab('dashboard')">
                        <div class="nav-icon">📊</div>
                        <div class="nav-text">Dashboard</div>
                    </li>
                    <li class="nav-item" onclick="showTab('transactions')">
                        <div class="nav-icon">💳</div>
                        <div class="nav-text">Transactions</div>
                    </li>
                    <li class="nav-item" onclick="showTab('budgets')">
                        <div class="nav-icon">📈</div>
                        <div class="nav-text">Budget</div>
                    </li>
                    <li class="nav-item" onclick="showTab('insights')">
                        <div class="nav-icon">🧠</div>
                        <div class="nav-text">Insights</div>
                    </li>
                </ul>
            </div>

            <!-- Main Content Area -->
            <div class="content-area">
                <!-- Header -->
                <div class="content-header">
                    <h1 class="page-title" id="page-title">Dashboard</h1>
                    <div class="header-actions">
                        <div class="search-bar">
                            <div class="search-icon">🔍</div>
                            <input type="text" class="search-input" placeholder="Search transactions...">
                        </div>
                        <div class="user-profile" onclick="logout()">
                            <div class="user-avatar" id="user-avatar">U</div>
                            <div class="user-name" id="user-name-display">User</div>
                        </div>
                    </div>
                </div>

                <!-- Dashboard View -->
                <div id="dashboard-view">
                    <!-- Stats Row -->
                    <div class="stats-row">
                        <div class="stat-card income">
                            <div class="stat-label">Income</div>
                            <div class="stat-value amount-positive" id="total-income">$0.00</div>
                            <div class="stat-icon">💰</div>
                        </div>
                        <div class="stat-card expense">
                            <div class="stat-label">Expense</div>
                            <div class="stat-value amount-negative" id="total-expenses">$0.00</div>
                            <div class="stat-icon">💸</div>
                        </div>
                        <div class="stat-card health">
                            <div class="stat-label">Health Score</div>
                            <div class="stat-value" id="health-score">50/100</div>
                            <div class="stat-icon">📊</div>
                        </div>
                    </div>

                    <!-- Chart Section -->
                    <div class="chart-section">
                        <div class="chart-header">
                            <h3 class="chart-title">Statistics</h3>
                            <button class="chart-filter">Week</button>
                        </div>
                        <div style="text-align: center; padding: 2rem; color: #6b7280;">
                            <div style="font-size: 2rem; margin-bottom: 1rem;">📊</div>
                            <div>Chart visualization coming soon</div>
                        </div>
                    </div>
                </div>

                <!-- Transactions View -->
                <div id="transactions-view" class="hidden">
                    <div class="widget">
                        <div class="widget-header">
                            <h3 class="widget-title">All Transactions</h3>
                            <button class="btn btn-secondary" onclick="document.getElementById('add-transaction-form').scrollIntoView()">
                                ➕ Add Transaction
                            </button>
                        </div>
                        <div id="all-transactions">
                            <div class="loading">Loading transactions...</div>
                        </div>
                    </div>

                    <!-- Add Transaction Form -->
                    <div class="widget" id="add-transaction-form" style="margin-top: 2rem;">
                        <div class="widget-header">
                            <h3 class="widget-title">Add New Transaction</h3>
                        </div>
                        <form id="transaction-form" class="transaction-form">
                            <div class="form-group">
                                <label class="form-label">Description</label>
                                <input type="text" name="description" class="form-input" placeholder="Enter transaction description" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Amount ($)</label>
                                <input type="number" name="amount" class="form-input" placeholder="0.00" step="0.01" min="0.01" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Category</label>
                                <select name="category" class="form-select" required>
                                    <option value="">Select a category</option>
                                    <option value="food">Food & Dining</option>
                                    <option value="utilities">Utilities</option>
                                    <option value="transportation">Transportation</option>
                                    <option value="entertainment">Entertainment</option>
                                    <option value="salary">Salary & Income</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="shopping">Shopping</option>
                                    <option value="housing">Housing & Rent</option>
                                    <option value="education">Education</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Transaction Type</label>
                                <select name="type" class="form-select" required>
                                    <option value="">Select type</option>
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <button type="submit" class="btn btn-primary" style="width: 100%;" id="add-transaction-btn">
                                    Add Transaction
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Budgets View -->
                <div id="budgets-view" class="hidden">
                    <div class="widget">
                        <div class="widget-header">
                            <h3 class="widget-title">Budget Overview</h3>
                            <span style="color: #6b7280; font-size: 0.875rem;">Budget categories and spending</span>
                        </div>
                        <div id="budget-overview">
                            <div class="loading">Loading budget overview...</div>
                        </div>
                    </div>
                    
                    <div class="widget">
                        <div class="widget-header">
                            <h3 class="widget-title">Budget Analysis</h3>
                            <span style="color: #6b7280; font-size: 0.875rem;">Real-time budget monitoring</span>
                        </div>
                        <div id="detailed-budget-analysis">
                            <div class="loading">Loading detailed budget analysis...</div>
                        </div>
                    </div>
                </div>

                <!-- Insights View -->
                <div id="insights-view" class="hidden">
                    <div class="widget">
                        <div class="widget-header">
                            <h3 class="widget-title">Financial Insights</h3>
                            <span style="color: #6b7280; font-size: 0.875rem;">AI-powered financial analysis</span>
                        </div>
                        <div id="financial-insights">
                            <div class="loading">Loading financial insights...</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Sidebar -->
            <div class="right-sidebar">
                <!-- Credit Card Widget -->
                <div class="credit-card">
                    <div class="card-header">
                        <div class="card-type">Balance</div>
                        <div class="card-brand">INVOK</div>
                    </div>
                    <div class="card-balance" id="card-balance">$0.00</div>
                    <div class="card-number">•••• •••• •••• 3362</div>
                    <div class="card-footer">
                        <div id="card-holder">User Name</div>
                        <div>03/25</div>
                    </div>
                </div>

                <!-- Recent Transactions Widget -->
                <div class="widget">
                    <div class="widget-header">
                        <h3 class="widget-title">Recent Activity</h3>
                        <div class="widget-action" onclick="showTab('transactions')">•••</div>
                    </div>
                    <div class="transaction-list" id="recent-transactions">
                        <div class="loading">Loading transactions...</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="invok-badge">
        ⚡ Powered by <strong>Invok</strong> Serverless
    </div>

    <script>
        // API Configuration
        const API_BASE = '/invok/cf749b32-a29a-4080-bbd0-87a66a9d1b00';
        
        let currentUser = null;
        let authToken = null;
        let currentData = {
            transactions: [],
            insights: null,
            budgetAnalysis: null
        };

        // Authentication functions
        function getAuthHeaders() {
            return authToken ? { 'Authorization': \`Bearer \${authToken}\` } : {};
        }

        window.showAuthTab = function(tabName) {
            document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');
            
            document.getElementById('login-form').classList.toggle('hidden', tabName !== 'login');
            document.getElementById('register-form').classList.toggle('hidden', tabName !== 'register');
        }

        function showAuthMessage(message, isError = false) {
            const container = document.getElementById('auth-messages');
            container.innerHTML = \`<div class="\${isError ? 'error-message' : 'success-message'}">\${message}</div>\`;
            setTimeout(() => container.innerHTML = '', 5000);
        }

        async function login(credentials) {
            try {
                const response = await fetch(\`\${API_BASE}/auth-service?action=login\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    authToken = result.data.token;
                    currentUser = result.data.user;
                    localStorage.setItem('authToken', authToken);
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    showApp();
                } else {
                    showAuthMessage(result.error || 'Login failed', true);
                }
            } catch (error) {
                showAuthMessage('Network error. Please try again.', true);
            }
        }

        async function register(userData) {
            try {
                const response = await fetch(\`\${API_BASE}/auth-service?action=register\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    authToken = result.data.token;
                    currentUser = result.data.user;
                    localStorage.setItem('authToken', authToken);
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    showApp();
                } else {
                    showAuthMessage(result.error || 'Registration failed', true);
                }
            } catch (error) {
                showAuthMessage('Network error. Please try again.', true);
            }
        }

        window.logout = function() {
            authToken = null;
            currentUser = null;
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            showAuth();
        }

        function showAuth() {
            document.getElementById('auth-container').classList.remove('hidden');
            document.getElementById('app-container').classList.add('hidden');
        }

        function showApp() {
            document.getElementById('auth-container').classList.add('hidden');
            document.getElementById('app-container').classList.remove('hidden');
            
            if (currentUser) {
                const fullName = currentUser.firstName + ' ' + currentUser.lastName;
                document.getElementById('user-name-display').textContent = fullName;
                
                // Set user avatar (first letter of first name)
                document.getElementById('user-avatar').textContent = currentUser.firstName.charAt(0).toUpperCase();
                
                // Set card holder name
                document.getElementById('card-holder').textContent = fullName;
            }
            
            initializeApp();
        }

        // Utility functions
        function formatCurrency(amount) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(Math.abs(amount));
        }

        function showError(containerId, message) {
            const container = document.getElementById(containerId);
            if (!container) {
                console.warn('Error container not found:', containerId);
                return;
            }
            container.innerHTML = \`<div class="error-message">❌ \${message}</div>\`;
        }

        function showSuccess(containerId, message) {
            const container = document.getElementById(containerId);
            if (!container) {
                console.warn('Success container not found:', containerId);
                return;
            }
            container.innerHTML = \`<div class="success-message">✅ \${message}</div>\`;
        }

        // API Functions
        async function fetchTransactions() {
            try {
                const response = await fetch(\`\${API_BASE}/transaction-api\`, {
                    headers: getAuthHeaders()
                });
                
                if (!response.ok) {
                    if (response.status === 401) {
                        logout();
                        return;
                    }
                    throw new Error('Failed to fetch transactions');
                }
                
                const data = await response.json();
                currentData.transactions = data.data || [];
                updateTransactionViews();
                updateDashboardStats();
            } catch (error) {
                console.error('Error fetching transactions:', error);
                showError('recent-transactions', 'Failed to load transactions');
                showError('all-transactions', 'Failed to load transactions');
            }
        }

        async function fetchInsights() {
            try {
                const response = await fetch(\`\${API_BASE}/calculate-insights\`, {
                    headers: getAuthHeaders()
                });
                
                if (!response.ok) {
                    if (response.status === 401) {
                        logout();
                        return;
                    }
                    throw new Error('Failed to fetch insights');
                }
                
                const result = await response.json();
                if (result.success) {
                    currentData.insights = result.data; // Extract the data object
                    updateInsightsView();
                    updateDashboardStats();
                } else {
                    throw new Error(result.error || 'Failed to fetch insights');
                }
            } catch (error) {
                console.error('Error fetching insights:', error);
                showError('financial-insights', 'Failed to load financial insights');
            }
        }

        async function fetchBudgetAnalysis() {
            try {
                const response = await fetch(\`\${API_BASE}/budget-analyzer\`, {
                    headers: getAuthHeaders()
                });
                if (!response.ok) throw new Error('Failed to fetch budget analysis');
                const data = await response.json();
                console.log('Budget analysis response:', data); // Debug log
                currentData.budgetAnalysis = data;
                updateBudgetViews();
            } catch (error) {
                console.error('Error fetching budget analysis:', error);
                showError('budget-overview', 'Failed to load budget analysis');
                showError('detailed-budget-analysis', 'Failed to load detailed budget analysis');
            }
        }

        async function addTransaction(transactionData) {
            try {
                const response = await fetch(\`\${API_BASE}/transaction-api\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeaders()
                    },
                    body: JSON.stringify(transactionData)
                });
                
                if (!response.ok) {
                    if (response.status === 401) {
                        logout();
                        return;
                    }
                    throw new Error('Failed to add transaction');
                }
                
                // Refresh data after adding transaction
                await Promise.all([fetchTransactions(), fetchInsights(), fetchBudgetAnalysis()]);
                return true;
            } catch (error) {
                console.error('Error adding transaction:', error);
                throw error;
            }
        }

        // View Update Functions
        function updateTransactionViews() {
            const recentContainer = document.getElementById('recent-transactions');
            const allContainer = document.getElementById('all-transactions');
            
            // Add null checks to prevent errors
            if (!recentContainer || !allContainer) {
                console.warn('Transaction containers not found - recent:', !!recentContainer, 'all:', !!allContainer);
                return;
            }
            
            if (currentData.transactions.length === 0) {
                const emptyState = \`
                    <div style="text-align: center; padding: 2rem; color: #64748b;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📊</div>
                        <h4 style="margin-bottom: 0.5rem; color: #1e293b;">No transactions yet</h4>
                        <p style="font-size: 0.875rem;">Add your first transaction to get started with financial tracking</p>
                    </div>
                \`;
                recentContainer.innerHTML = emptyState;
                allContainer.innerHTML = emptyState;
                return;
            }

            // Function to get transaction icon
            function getTransactionIcon(type, category) {
                if (type === 'income') return '💰';
                
                // Expense icons by category
                switch(category.toLowerCase()) {
                    case 'food': return '🍔';
                    case 'transportation': return '🚗';
                    case 'utilities': return '💡';
                    case 'entertainment': return '🎬';
                    case 'healthcare': return '🏥';
                    case 'shopping': return '🛍️';
                    case 'housing': return '🏠';
                    case 'education': return '📚';
                    default: return '💸';
                }
            }

            // Function to format date
            function formatDate(dateString) {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                });
            }

            // Function to render transaction item
            function renderTransaction(transaction) {
                const icon = getTransactionIcon(transaction.type, transaction.category);
                const isIncome = transaction.type === 'income';
                
                return \`
                    <div class="transaction-item">
                        <div class="transaction-icon \${transaction.type}">
                            \${icon}
                        </div>
                        <div class="transaction-details">
                            <div class="transaction-name">\${transaction.description}</div>
                            <div class="transaction-date">\${transaction.category} • \${formatDate(transaction.date)}</div>
                        </div>
                        <div class="transaction-amount \${isIncome ? 'amount-positive' : 'amount-negative'}">
                            \${isIncome ? '+' : '-'}\${formatCurrency(transaction.amount)}
                        </div>
                    </div>
                \`;
            }

            // Recent transactions (last 5)
            const recentTransactions = currentData.transactions.slice(0, 5);
            recentContainer.innerHTML = recentTransactions.map(renderTransaction).join('');

            // All transactions
            allContainer.innerHTML = currentData.transactions.map(renderTransaction).join('');
        }

        function updateDashboardStats() {
            // Calculate totals from transactions using type field instead of amount sign
            const totalIncome = currentData.transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            
            const totalExpenses = currentData.transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            // Add null checks for dashboard elements
            const totalIncomeEl = document.getElementById('total-income');
            const totalExpensesEl = document.getElementById('total-expenses');
            const cardBalanceEl = document.getElementById('card-balance');
            
            if (totalIncomeEl) totalIncomeEl.textContent = formatCurrency(totalIncome);
            if (totalExpensesEl) totalExpensesEl.textContent = formatCurrency(totalExpenses);
            
            // Update card balance (net balance)
            const netBalance = totalIncome - totalExpenses;
            if (cardBalanceEl) cardBalanceEl.textContent = formatCurrency(netBalance);

            // Update health score from insights
            const healthElement = document.getElementById('health-score');
            if (!healthElement) {
                console.warn('Health score element not found');
                return;
            }
            
            if (currentData.insights && currentData.insights.financial_health_score !== undefined) {
                const healthScore = Math.round(currentData.insights.financial_health_score);
                healthElement.textContent = healthScore + '/100';
                
                // Add color coding
                if (healthScore >= 80) {
                    healthElement.className = 'stat-value health-score excellent';
                } else if (healthScore >= 60) {
                    healthElement.className = 'stat-value health-score good';
                } else {
                    healthElement.className = 'stat-value health-score poor';
                }
            } else {
                // Calculate a simple health score based on transactions
                const netIncome = totalIncome - totalExpenses;
                const simpleHealthScore = totalIncome > 0 ? Math.min(100, Math.max(0, (netIncome / totalIncome) * 100)) : 0;
                healthElement.textContent = Math.round(simpleHealthScore) + '/100';
                
                if (simpleHealthScore >= 80) {
                    healthElement.className = 'stat-value health-score excellent';
                } else if (simpleHealthScore >= 60) {
                    healthElement.className = 'stat-value health-score good';
                } else {
                    healthElement.className = 'stat-value health-score poor';
                }
            }
        }

        function updateBudgetViews() {
            const overviewContainer = document.getElementById('budget-overview');
            const detailedContainer = document.getElementById('detailed-budget-analysis');

            // Add null checks to prevent errors
            if (!overviewContainer || !detailedContainer) {
                console.warn('Budget containers not found - budget overview:', !!overviewContainer, 'detailed analysis:', !!detailedContainer);
                return;
            }

            console.log('Updating budget views with data:', currentData.budgetAnalysis); // Debug log

            // Handle case where we have budget data but no success field (old API format)
            if (!currentData.budgetAnalysis) {
                // Create simple budget based on transactions using type field
                const categories = {};
                currentData.transactions.forEach(t => {
                    if (t.type === 'expense') { // use type field instead of amount sign
                        categories[t.category] = (categories[t.category] || 0) + t.amount;
                    }
                });

                if (Object.keys(categories).length === 0) {
                    overviewContainer.innerHTML = '<p>No spending data available yet.</p>';
                    detailedContainer.innerHTML = '<p>Add more transactions to see detailed budget analysis.</p>';
                    return;
                }

                const budgetHtml = Object.entries(categories).map(([category, spent]) => {
                    const budget = spent * 1.5; // Simple budget = 150% of current spending
                    const percentage = (spent / budget) * 100;
                    
                    return \`
                        <div class="budget-item">
                            <div class="budget-header">
                                <div class="budget-category">\${category}</div>
                                <span class="budget-percentage" style="color: \${percentage > 100 ? '#dc2626' : percentage > 80 ? '#eab308' : '#16a34a'}">\${Math.round(percentage)}%</span>
                            </div>
                            <div class="budget-bar">
                                <div class="budget-progress \${percentage > 100 ? 'danger' : percentage > 80 ? 'warning' : ''}" style="width: \${Math.min(percentage, 100)}%;"></div>
                            </div>
                            <div class="budget-amounts">
                                <span>Spent: \${formatCurrency(spent)}</span>
                                <span>Budget: \${formatCurrency(budget)}</span>
                            </div>
                        </div>
                    \`;
                }).join('');

                overviewContainer.innerHTML = budgetHtml;
                detailedContainer.innerHTML = '<p>Add more transactions to see AI-powered budget analysis.</p>';
                return;
            }

            // Use real budget analysis data - handle multiple API response formats
            try {
                // New API format
                const budgetData = currentData.budgetAnalysis.data;
                const budgets = currentData.budgetAnalysis.budgets;
                
                // Current API format (direct budgets array)
                const directBudgets = Array.isArray(currentData.budgetAnalysis.budgets) ? currentData.budgetAnalysis.budgets : [];

                console.log('Budget data:', budgetData, 'Budgets:', budgets, 'Direct budgets:', directBudgets); // Debug log

                if (budgetData && budgetData.budget_categories && budgetData.budget_categories.length > 0) {
                // Budget overview with real budget categories
                const budgetCategories = budgetData.budget_categories || [];
                
                overviewContainer.innerHTML = budgetCategories.map(budget => {
                    const percentage = budget.percentage_used || 0;
                    const isOver = percentage >= 100;
                    const isWarning = percentage >= 80;
                    
                    return \`
                        <div class="budget-item">
                            <div class="budget-header">
                                <div class="budget-category">\${budget.category}</div>
                                <span class="budget-percentage" style="color: \${isOver ? '#dc2626' : isWarning ? '#eab308' : '#16a34a'}">\${Math.round(percentage)}%</span>
                            </div>
                            <div class="budget-bar">
                                <div class="budget-progress \${isOver ? 'danger' : isWarning ? 'warning' : ''}" style="width: \${Math.min(percentage, 100)}%;"></div>
                            </div>
                            <div class="budget-amounts">
                                <span>Spent: \${formatCurrency(budget.spent || 0)}</span>
                                <span>Budget: \${formatCurrency(budget.budgeted || 0)}</span>
                            </div>
                            <div class="budget-prediction" style="margin-top: 0.5rem; font-size: 0.8rem; color: #64748b;">
                                <span>Predicted: \${formatCurrency(budget.predicted_spend || 0)}</span>
                                <span style="margin-left: 1rem;">Days left: \${budget.days_remaining || 0}</span>
                            </div>
                        </div>
                    \`;
                }).join('');
                            } else if (directBudgets.length > 0) {
                    // Handle current API format: direct budgets array
                    console.log('Using direct budgets array:', directBudgets);
                    
                    // Calculate simple spending vs budget for current format
                    const categories = {};
                    currentData.transactions.forEach(t => {
                        if (t.type === 'expense') {
                            categories[t.category] = (categories[t.category] || 0) + t.amount;
                        }
                    });
                    
                    overviewContainer.innerHTML = directBudgets.map(budget => {
                        const spent = categories[budget.category] || 0;
                        const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
                        const isOver = percentage >= 100;
                        const isWarning = percentage >= 80;
                        
                        return \`
                            <div class="budget-item">
                                <div class="budget-header">
                                    <div class="budget-category">\${budget.category}</div>
                                    <span class="budget-percentage" style="color: \${isOver ? '#dc2626' : isWarning ? '#eab308' : '#16a34a'}">\${Math.round(percentage)}%</span>
                                </div>
                                <div class="budget-bar">
                                    <div class="budget-progress \${isOver ? 'danger' : isWarning ? 'warning' : ''}" style="width: \${Math.min(percentage, 100)}%;"></div>
                                </div>
                                <div class="budget-amounts">
                                    <span>Spent: \${formatCurrency(spent)}</span>
                                    <span>Budget: \${formatCurrency(budget.amount || 0)}</span>
                                </div>
                                <div class="budget-prediction" style="margin-top: 0.5rem; font-size: 0.8rem; color: #64748b;">
                                    <span>Period: \${budget.period || 'monthly'}</span>
                                    <span style="margin-left: 1rem;">Remaining: \${formatCurrency((budget.amount || 0) - spent)}</span>
                                </div>
                            </div>
                        \`;
                    }).join('');
                } else if (budgets && budgets.length > 0) {
                    // Fallback: Use budgets array from new API format
                    console.log('Using budgets array from new format:', budgets);
                    
                    overviewContainer.innerHTML = budgets.map(budget => {
                        const percentage = budget.amount > 0 ? 50 : 0; // Default percentage since we don't have spent data
                        
                        return \`
                            <div class="budget-item">
                                <div class="budget-header">
                                    <div class="budget-category">\${budget.category}</div>
                                    <span class="budget-percentage" style="color: #16a34a">Budget Set</span>
                                </div>
                                <div class="budget-bar">
                                    <div class="budget-progress" style="width: 0%;"></div>
                                </div>
                                <div class="budget-amounts">
                                    <span>Budget: \${formatCurrency(budget.amount || 0)}</span>
                                    <span>Period: \${budget.period || 'monthly'}</span>
                                </div>
                            </div>
                        \`;
                    }).join('');
                } else {
                    overviewContainer.innerHTML = '<p>No budget categories found. Add more transactions to generate budgets.</p>';
                }

            // Detailed budget analysis with real data
            if (budgetData) {
                // Handle new API format with full analysis
                const healthScore = budgetData.health_score || 0;
                const overallStatus = budgetData.overall_status || 'unknown';
                const recommendations = budgetData.recommendations || [];
                const alerts = budgetData.alerts || [];

                detailedContainer.innerHTML = \`
                    <div class="insight-card">
                        <h4>Overall Budget Health</h4>
                        <div class="health-score \${healthScore >= 80 ? 'excellent' : healthScore >= 60 ? 'good' : 'poor'}">
                            \${Math.round(healthScore)}/100
                        </div>
                        <p>Status: <strong style="text-transform: capitalize; color: \${overallStatus === 'healthy' ? '#16a34a' : overallStatus === 'warning' ? '#eab308' : '#dc2626'}">\${overallStatus}</strong></p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                            <div style="text-align: center; padding: 0.75rem; background: #f0fdf4; border-radius: 6px;">
                                <div style="font-weight: 600; color: #16a34a;">\${formatCurrency(budgetData.total_budgeted || 0)}</div>
                                <div style="color: #64748b; font-size: 0.75rem;">Total Budget</div>
                            </div>
                            <div style="text-align: center; padding: 0.75rem; background: #fef2f2; border-radius: 6px;">
                                <div style="font-weight: 600; color: #dc2626;">\${formatCurrency(budgetData.total_spent || 0)}</div>
                                <div style="color: #64748b; font-size: 0.75rem;">Total Spent</div>
                            </div>
                            <div style="text-align: center; padding: 0.75rem; background: #eff6ff; border-radius: 6px;">
                                <div style="font-weight: 600; color: #3b82f6;">\${formatCurrency(budgetData.total_remaining || 0)}</div>
                                <div style="color: #64748b; font-size: 0.75rem;">Remaining</div>
                            </div>
                        </div>
                    </div>
                    
                    \${alerts && alerts.length > 0 ? \`
                        <div class="insight-card">
                            <h4>🚨 Budget Alerts</h4>
                            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                \${alerts.map(alert => \`
                                    <div style="padding: 0.75rem; background: #fef2f2; border-radius: 6px; border-left: 4px solid #dc2626;">
                                        <p style="margin: 0; color: #1e293b; font-size: 0.875rem;">⚠️ \${alert}</p>
                                    </div>
                                \`).join('')}
                            </div>
                        </div>
                    \` : ''}
                    
                    \${recommendations && recommendations.length > 0 ? \`
                        <div class="insight-card">
                            <h4>💡 AI Recommendations</h4>
                            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                \${recommendations.map(rec => \`
                                    <div style="padding: 0.75rem; background: #eff6ff; border-radius: 6px; border-left: 4px solid #3b82f6;">
                                        <p style="margin: 0; color: #1e293b; font-size: 0.875rem;">\${rec}</p>
                                    </div>
                                \`).join('')}
                            </div>
                        </div>
                    \` : ''}
                    
                    \${budgetData.budget_categories && budgetData.budget_categories.length > 0 ? \`
                        <div class="insight-card">
                            <h4>📊 Category Details</h4>
                            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                \${budgetData.budget_categories.map(category => \`
                                    <div style="padding: 1rem; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                            <strong style="color: #1e293b; text-transform: capitalize;">\${category.category}</strong>
                                            <span style="color: \${category.status === 'over_budget' ? '#dc2626' : category.status === 'warning' ? '#eab308' : '#16a34a'}; font-weight: 600; text-transform: capitalize;">\${category.status.replace('_', ' ')}</span>
                                        </div>
                                        <p style="margin: 0.5rem 0; color: #64748b; font-size: 0.875rem;">\${category.recommendation}</p>
                                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.5rem; font-size: 0.875rem;">
                                            <div><strong>Days left:</strong> \${category.days_remaining || 0}</div>
                                            <div><strong>Predicted:</strong> \${formatCurrency(category.predicted_spend || 0)}</div>
                                        </div>
                                    </div>
                                \`).join('')}
                            </div>
                        </div>
                    \` : ''}
                \`;
            } else if (directBudgets.length > 0) {
                // Handle current API format - create basic analysis
                const categories = {};
                let totalBudget = 0;
                let totalSpent = 0;
                
                currentData.transactions.forEach(t => {
                    if (t.type === 'expense') {
                        categories[t.category] = (categories[t.category] || 0) + t.amount;
                        totalSpent += t.amount;
                    }
                });
                
                directBudgets.forEach(budget => {
                    totalBudget += budget.amount || 0;
                });
                
                const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
                const healthScore = Math.max(0, 100 - overallPercentage);
                const overallStatus = overallPercentage >= 90 ? 'critical' : overallPercentage >= 75 ? 'warning' : 'healthy';
                
                detailedContainer.innerHTML = \`
                    <div class="insight-card">
                        <h4>Budget Overview</h4>
                        <div class="health-score \${healthScore >= 80 ? 'excellent' : healthScore >= 60 ? 'good' : 'poor'}">
                            \${Math.round(healthScore)}/100
                        </div>
                        <p>Status: <strong style="text-transform: capitalize; color: \${overallStatus === 'healthy' ? '#16a34a' : overallStatus === 'warning' ? '#eab308' : '#dc2626'}">\${overallStatus}</strong></p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                            <div style="text-align: center; padding: 0.75rem; background: #f0fdf4; border-radius: 6px;">
                                <div style="font-weight: 600; color: #16a34a;">\${formatCurrency(totalBudget)}</div>
                                <div style="color: #64748b; font-size: 0.75rem;">Total Budget</div>
                            </div>
                            <div style="text-align: center; padding: 0.75rem; background: #fef2f2; border-radius: 6px;">
                                <div style="font-weight: 600; color: #dc2626;">\${formatCurrency(totalSpent)}</div>
                                <div style="color: #64748b; font-size: 0.75rem;">Total Spent</div>
                            </div>
                            <div style="text-align: center; padding: 0.75rem; background: #eff6ff; border-radius: 6px;">
                                <div style="font-weight: 600; color: #3b82f6;">\${formatCurrency(totalBudget - totalSpent)}</div>
                                <div style="color: #64748b; font-size: 0.75rem;">Remaining</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="insight-card">
                        <h4>📊 Budget Categories</h4>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            \${directBudgets.map(budget => {
                                const spent = categories[budget.category] || 0;
                                const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
                                const status = percentage >= 100 ? 'over budget' : percentage >= 80 ? 'warning' : 'on track';
                                
                                return \`
                                    <div style="padding: 1rem; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                            <strong style="color: #1e293b; text-transform: capitalize;">\${budget.category}</strong>
                                            <span style="color: \${status === 'over budget' ? '#dc2626' : status === 'warning' ? '#eab308' : '#16a34a'}; font-weight: 600; text-transform: capitalize;">\${status}</span>
                                        </div>
                                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.5rem; font-size: 0.875rem;">
                                            <div><strong>Spent:</strong> \${formatCurrency(spent)}</div>
                                            <div><strong>Budget:</strong> \${formatCurrency(budget.amount || 0)}</div>
                                            <div><strong>Usage:</strong> \${Math.round(percentage)}%</div>
                                            <div><strong>Remaining:</strong> \${formatCurrency((budget.amount || 0) - spent)}</div>
                                        </div>
                                    </div>
                                \`;
                            }).join('')}
                        </div>
                    </div>
                \`;
            } else {
                detailedContainer.innerHTML = '<p>No detailed budget analysis available.</p>';
            }
            } catch (error) {
                console.error('Error processing budget data:', error);
                console.log('Raw budget analysis data:', currentData.budgetAnalysis);
                
                // Fallback: Show basic message with raw data info
                overviewContainer.innerHTML = '<p>Budget data received but processing failed. Check console for details.</p>';
                detailedContainer.innerHTML = \`
                    <div class="insight-card">
                        <h4>Debug Information</h4>
                        <p>Budget analysis data was received but couldn't be processed.</p>
                        <p>Check browser console for more details.</p>
                        <pre style="background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow: auto; max-height: 200px;">
                            \${JSON.stringify(currentData.budgetAnalysis, null, 2)}
                        </pre>
                    </div>
                \`;
            }
        }

        function updateInsightsView() {
            if (!currentData.insights) return;

            const container = document.getElementById('financial-insights');
            if (!container) {
                console.warn('Financial insights container not found');
                return;
            }
            
            const insights = currentData.insights;
            const healthScore = Math.round(insights.financial_health_score || 0);
            
            container.innerHTML = \`
                <div class="insight-card">
                    <div class="insight-header">
                        <div class="insight-icon">📊</div>
                        <h3 class="insight-title">Financial Health Score</h3>
                    </div>
                    <div class="health-score \${healthScore >= 80 ? 'excellent' : healthScore >= 60 ? 'good' : 'poor'}">
                        \${healthScore}/100
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                        <div>
                            <p style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Savings Rate</p>
                            <p style="font-weight: 600; color: #1e293b;">\${Math.round(insights.savings_rate || 0)}%</p>
                        </div>
                        <div>
                            <p style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Net Worth</p>
                            <p style="font-weight: 600; color: #1e293b;">\${formatCurrency(insights.net_worth || 0)}</p>
                        </div>
                    </div>
                </div>
                
                <div class="insight-card">
                    <div class="insight-header">
                        <div class="insight-icon">💰</div>
                        <h3 class="insight-title">Income & Expenses</h3>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div style="text-align: center; padding: 1rem; background: #f0fdf4; border-radius: 8px;">
                            <div style="color: #16a34a; font-size: 1.5rem; font-weight: 700;">\${formatCurrency(insights.monthly_income || 0)}</div>
                            <div style="color: #64748b; font-size: 0.875rem;">Monthly Income</div>
                        </div>
                        <div style="text-align: center; padding: 1rem; background: #fef2f2; border-radius: 8px;">
                            <div style="color: #dc2626; font-size: 1.5rem; font-weight: 700;">\${formatCurrency(insights.monthly_expenses || 0)}</div>
                            <div style="color: #64748b; font-size: 0.875rem;">Monthly Expenses</div>
                        </div>
                    </div>
                </div>
                
                \${insights.spending_by_category && Object.keys(insights.spending_by_category).length > 0 ? \`
                    <div class="insight-card">
                        <div class="insight-header">
                            <div class="insight-icon">🏷️</div>
                            <h3 class="insight-title">Spending by Category</h3>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            \${Object.entries(insights.spending_by_category)
                                .sort(([,a], [,b]) => b - a)
                                .slice(0, 5)
                                .map(([category, amount]) => \`
                                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #f8fafc; border-radius: 6px;">
                                        <span style="font-weight: 500; color: #1e293b; text-transform: capitalize;">\${category}</span>
                                        <span style="font-weight: 600; color: #dc2626;">\${formatCurrency(amount)}</span>
                                    </div>
                                \`).join('')}
                        </div>
                    </div>
                \` : ''}
                
                \${insights.recommendations && insights.recommendations.length > 0 ? \`
                    <div class="insight-card">
                        <div class="insight-header">
                            <div class="insight-icon">🤖</div>
                            <h3 class="insight-title">AI Recommendations</h3>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            \${insights.recommendations.map(rec => \`
                                <div style="padding: 1rem; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
                                    <p style="margin: 0; color: #1e293b; font-size: 0.875rem;">\${rec}</p>
                                </div>
                            \`).join('')}
                        </div>
                    </div>
                \` : ''}
                
                \${insights.trend_analysis ? \`
                    <div class="insight-card">
                        <div class="insight-header">
                            <div class="insight-icon">📈</div>
                            <h3 class="insight-title">Financial Trends</h3>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div style="text-align: center; padding: 0.75rem; background: #f8fafc; border-radius: 6px;">
                                <div style="font-weight: 600; color: #1e293b; font-size: 1.25rem;">\${Math.round(insights.trend_analysis.income_growth || 0)}%</div>
                                <div style="color: #64748b; font-size: 0.75rem;">Income Growth</div>
                            </div>
                            <div style="text-align: center; padding: 0.75rem; background: #f8fafc; border-radius: 6px;">
                                <div style="font-weight: 600; color: #1e293b; font-size: 1.25rem;">\${Math.round(insights.trend_analysis.expense_growth || 0)}%</div>
                                <div style="color: #64748b; font-size: 0.75rem;">Expense Growth</div>
                            </div>
                            <div style="text-align: center; padding: 0.75rem; background: #f8fafc; border-radius: 6px;">
                                <div style="font-weight: 600; color: #1e293b; font-size: 1.25rem;">\${Math.round(insights.trend_analysis.savings_growth || 0)}%</div>
                                <div style="color: #64748b; font-size: 0.75rem;">Savings Growth</div>
                            </div>
                            <div style="text-align: center; padding: 0.75rem; background: #f8fafc; border-radius: 6px;">
                                <div style="font-weight: 600; color: #1e293b; font-size: 1.25rem;">\${Math.round((insights.trend_analysis.spending_velocity || 0) * 100)}%</div>
                                <div style="color: #64748b; font-size: 0.75rem;">Spending Velocity</div>
                            </div>
                        </div>
                    </div>
                \` : ''}
            \`;
        }

        // Mobile navigation toggle
        window.toggleMobileNav = function() {
            const navMenu = document.getElementById('nav-menu');
            navMenu.classList.toggle('mobile-open');
        };

        // Tab switching
        window.showTab = function(tabName) {
            // Hide all views
            document.querySelectorAll('[id$="-view"]').forEach(view => {
                view.classList.add('hidden');
            });
            
            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Show selected view
            document.getElementById(tabName + '-view').classList.remove('hidden');
            
            // Add active class to clicked nav item
            event.target.closest('.nav-item').classList.add('active');
            
            // Update page title
            const titles = {
                'dashboard': 'Dashboard',
                'transactions': 'Transactions',
                'budgets': 'Budget Analysis',
                'insights': 'Financial Insights'
            };
            document.getElementById('page-title').textContent = titles[tabName] || 'Dashboard';
            
            // Close mobile nav if open
            const navMenu = document.getElementById('nav-menu');
            if (navMenu) {
                navMenu.classList.remove('mobile-open');
            }
            
            // Load data if needed
            if (tabName === 'insights' && !currentData.insights) {
                fetchInsights();
            }
            if (tabName === 'budgets' && !currentData.budgetAnalysis) {
                fetchBudgetAnalysis();
            }
        }

        // Form handling
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const btn = document.getElementById('login-btn');
            
            btn.disabled = true;
            btn.textContent = 'Logging in...';
            
            await login({
                email: formData.get('email'),
                password: formData.get('password')
            });
            
            btn.disabled = false;
            btn.textContent = 'Login';
        });

        document.getElementById('registerForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const btn = document.getElementById('register-btn');
            
            btn.disabled = true;
            btn.textContent = 'Creating Account...';
            
            await register({
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                password: formData.get('password')
            });
            
            btn.disabled = false;
            btn.textContent = 'Create Account';
        });

        document.getElementById('transaction-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const btn = document.getElementById('add-transaction-btn');
            const formData = new FormData(e.target);
            
            const transactionData = {
                description: formData.get('description'),
                amount: parseFloat(formData.get('amount')),
                category: formData.get('category'),
                type: formData.get('type'),
                date: new Date().toISOString().split('T')[0]
            };
            
            // Remove amount adjustment logic - amounts should always be positive and type determines income vs expense
            
            btn.disabled = true;
            btn.textContent = 'Adding...';
            
            try {
                await addTransaction(transactionData);
                e.target.reset();
                showSuccess('all-transactions', 'Transaction added successfully!');
                setTimeout(() => {
                    document.querySelector('.success-message')?.remove();
                }, 3000);
            } catch (error) {
                showError('all-transactions', 'Failed to add transaction: ' + error.message);
            } finally {
                btn.disabled = false;
                btn.textContent = 'Add Transaction';
            }
        });

        // Initialize app
        async function initializeApp() {
            console.log('Initializing Personal Finance Tracker...');
            
            try {
                // Load all data in parallel
                await Promise.all([
                    fetchTransactions(),
                    fetchInsights(),
                    fetchBudgetAnalysis()
                ]);
                
                console.log('App initialized successfully!');
            } catch (error) {
                console.error('Failed to initialize app:', error);
            }
        }

        // Check authentication on page load
        function checkAuth() {
            const storedToken = localStorage.getItem('authToken');
            const storedUser = localStorage.getItem('currentUser');
            
            if (storedToken && storedUser) {
                authToken = storedToken;
                currentUser = JSON.parse(storedUser);
                showApp();
            } else {
                showAuth();
            }
        }

        // Start the app
        checkAuth();
        
        // Close mobile nav when clicking outside
        document.addEventListener('click', function(e) {
            const navMenu = document.getElementById('nav-menu');
            const sidebar = document.querySelector('.sidebar');
            
            if (navMenu && navMenu.classList.contains('mobile-open')) {
                if (!sidebar || !sidebar.contains(e.target)) {
                    navMenu.classList.remove('mobile-open');
                }
            }
        });
    </script>
</body>
</html>
        `;

        return html;
    },
};