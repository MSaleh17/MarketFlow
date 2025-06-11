# MarketFlow 🌱

A RESTful API for an e-commerce platform built with Node.js, Express.js, and MySQL, designed to handle user authentication, product management, shopping carts, order processing, and secure payments.

## 🎯 Features
- **User Authentication & Authorization**: Secure JWT-based login and role-based access control.
- **Product Management**: Full CRUD operations for products.
- **Shopping Cart Functionality**: Add, update, and remove items from user carts.
- **Order Processing**: Efficient order handling and tracking.
- **Payment Integration**: Secure transactions via Stripe.
- **File Upload Support**: Upload product images using Multer.
- **Input Validation**: Ensure data integrity with express-validator.

## 🛠️ Tech Stack
- **Languages**: JavaScript
- **Frameworks**: Node.js, Express.js
- **Database**: MySQL (with Sequelize ORM)
- **Authentication**: JWT
- **Payments**: Stripe
- **Testing**: Jest
- **File Uploads**: Multer
- **Security**: bcrypt, express-validator

## 🚀 Getting Started

### Prerequisites
- Node.js: v14 or higher
- MySQL: A running MySQL database instance
- npm or yarn
- Git

### Installation
1. Clone the repository:
```bash
git clone https://github.com/MSaleh17/MarketFlow.git
cd MarketFlow
```
2. Install dependencies:
```bash
npm install
```
3. Create .env file:
```bash
PORT=3000
DB_HOST=localhost
DB_USER_NAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRES= your_jwt_expiration_expiration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```
4. Database Setup:
- Ensure MySQL is running
- Create marketflow_db database

5. Start server:
```bash
npm start
```
API available at http://localhost:3000

🔐 Authentication
- Protected routes require JWT in the Authorization header: Bearer <token>
- Tokens expire after 7 days (configurable via JWT_EXPIRES)

🧪 Testing
```bash
npm test          # Run test suite
npm run test:coverage  # Test with coverage
```

📂 Project Structure
```bash
├── controllers/    # Route controllers
├── models/         # Sequelize models
├── routes/         # API routes
├── middlewares/    # Custom middleware
├── utils/          # Utility functions
├── tests/          # Jest tests
├── images/         # Product images
├── server.js       # Entry point
└── package.json    # Dependencies
```

🔒 Security

    ✅ Password hashing with bcrypt

    🔑 JWT authentication

    🛡️ Input validation with express-validator

    🔒 Environment variables for sensitive data

    💾 Database transactions with Sequelize

📜 License

This project is licensed under the ISC License.

## Author

Mahmoud Saleh
