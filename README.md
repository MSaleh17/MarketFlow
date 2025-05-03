# MarketFlow

A RESTful API for an e-commerce platform built with Node.js, Express, and MySQL.

## Features

- User authentication and authorization
- Product management
- Shopping cart functionality
- Order processing
- Payment integration with Stripe
- File upload support
- Input validation

## Tech Stack

- Node.js
- Express.js
- MySQL (with Sequelize ORM)
- JWT for authentication
- Stripe for payments
- Jest for testing
- Multer for file uploads

## Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone https://github.com/MSaleh17/MarketFlow.git
cd MarketFlow
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
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

4. Start the development server:

```bash
npm start
```

## Testing

Run tests with:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Project Structure

```
├── controllers/     # Route controllers
├── models/         # Database models
├── routes/         # API routes
├── middlewares/    # Custom middlewares
├── utils/          # Utility functions
├── __tests__/      # Test files
├── images/         # Uploaded images
├── server.js       # Application entry point
└── package.json    # Project dependencies
```

## Security

- Password hashing using bcrypt
- JWT authentication
- Input validation using express-validator
- Environment variables for sensitive data

## License

This project is licensed under the ISC License.

## Author

Mahmoud Saleh
