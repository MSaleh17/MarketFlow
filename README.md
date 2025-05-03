MarketFlow

📖 Overview
A RESTful API for an e-commerce platform built with Node.js, Express.js, and MySQL, designed to handle user authentication, product management, shopping carts, order processing, and secure payments.

🎯 Features

User Authentication & Authorization: Secure JWT-based login and role-based access control.
Product Management: Full CRUD operations for products,
Shopping Cart Functionality: Add, update, and remove items from user carts.
Order Processing
Payment Integration: Secure transactions via Stripe.
File Upload Support: Upload product images using Multer.
Input Validation: Ensure data integrity with express-validator.

🛠️ Tech Stack

Languages: JavaScript
Frameworks: Node.js, Express.js
Database: MySQL (with Sequelize ORM)
Authentication: JWT
Payments: Stripe
Testing: Jest
File Uploads: Multer
Security: bcrypt, express-validator

🚀 Getting Started
Prerequisites

Node.js: v14 or higher
MySQL: A running MySQL database instance
npm or yarn: Package manager
Git: For cloning the repository

Installation

Clone the repository:
git clone https://github.com/MSaleh17/MarketFlow.git
cd MarketFlow

Install dependencies:
npm install

Set up environment variables:

Create a .env file in the root directory with the following:PORT=3000
DB_HOST=localhost
DB_USER_NAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=marketflow_db
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRES=7d
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

Set up the database:

Ensure MySQL is running.
Create a database (e.g., marketflow_db).

Start the development server:
npm start

The API will be available at http://localhost:3000.

Authentication

Protected routes require a JWT token in the Authorization header: Bearer <token>.
Tokens expire after 7 days (configurable via JWT_EXPIRES).

🧪 Testing
Run the test suite:
npm test

Run tests with coverage:
npm run test:coverage

Ensure Jest is installed (npm install --save-dev jest).
📂 Project Structure
├── controllers/ # Route controllers for business logic
├── models/ # Sequelize models for database schema
├── routes/ # API route definitions
├── middlewares/ # Custom middleware (e.g., authentication, validation)
├── utils/ # Utility functions (e.g., error handling)
├── **tests**/ # Jest test files
├── images/ # Storage for uploaded product images
├── server.js # Application entry point
└── package.json # Project dependencies and scripts

🔒 Security

Password Hashing: Passwords are hashed using bcrypt before storage.
JWT Authentication: Secure token-based authentication for protected routes.
Input Validation: express-validator ensures valid and sanitized input.
Environment Variables: Sensitive data (e.g., database credentials, API keys) stored in .env.
Database Transactions: Sequelize transactions ensure data integrity during order processing.

📜 License
This project is licensed under the ISC License.
