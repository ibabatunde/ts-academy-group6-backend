# Payroll Management System API

A Node.js/Express backend API for managing employee payroll with role-based access control, JWT authentication, and automated attendance tracking.

## Features

- **Employee Management** - Create, read, update employees with role-based permissions
- **Payroll Processing** - Automated payroll calculation with attendance tracking
- **Authentication & Authorization** - JWT-based auth with Admin, Manager, and Employee roles
- **API Documentation** - Swagger UI for interactive API documentation
- **Email Notifications** - Mailtrap integration for email functionality

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Email**: Nodemailer + Mailtrap

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB instance (local or MongoDB Atlas)
- Mailtrap account (for email testing)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ibabatunde/ts-academy-group6-backend.git
cd ts-academy-group6-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
Create a `properties.env` file in the root directory:
```env
PORT=5050
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/payroll
JWT_SECRET=your_jwt_secret_key
MAILTRAP_API_KEY=your_mailtrap_api_key
MAILTRAP_USE_SANDBOX=false
MAILTRAP_INBOX_ID=your_inbox_id
```

4. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5050`

## API Documentation

Interactive API documentation is available via Swagger UI at:
```
http://localhost:5050/api-docs
```

## API Endpoints

### Authentication
- `POST /api/v1/employees/login` - Login with email and password
- `PUT /api/v1/employees/update-password` - Update password (authenticated)

### Employee Management (Admin/Manager only)
- `POST /api/v1/employees/register` - Register new employee (Admin only)
- `GET /api/v1/employees` - Get all employees
- `GET /api/v1/employees/:id` - Get single employee
- `PUT /api/v1/employees/:id` - Update employee

### Payroll Management (Admin/Manager only)
- `GET /api/v1/employees/payroll/all` - Get all payroll records
- `GET /api/v1/employees/payroll/:id` - Get single payroll
- `PUT /api/v1/employees/payroll/:id` - Update payroll
- `DELETE /api/v1/employees/payrolls/:payrollId/attendance/:logId` - Revert attendance log

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm run seed` | Run database seeder |

## Database Models

### Employee
- `firstName`, `lastName` - Personal details
- `email`, `password` - Login credentials (password hashed)
- `role` - Enum: Admin, Manager, Employee
- `department` - Department name
- `baseSalary` - Monthly base salary
- `bankDetails` - Account info
- `isActive`, `isLeaveApproved` - Status flags

### Payroll
- `employeeId` - Reference to Employee
- `month`, `year` - Payroll period
- `netPay` - Calculated pay
- `attendanceLogs` - Daily attendance entries
- `status` - Enum: Pending, Paid

## Project Structure

```
├── src/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   └── EmployeeController.js
│   ├── middleware/
│   │   ├── authenticate.js    # JWT verification
│   │   └── authorizeRoles.js  # Role-based access
│   ├── models/
│   │   ├── Employee.js
│   │   └── Payroll.js
│   ├── routes/
│   │   └── EmployeeRoute.js
│   └── utils/
│       ├── generateAuthToken.js
│       ├── mailer.js
│       └── seeder.js
├── index.js                   # Entry point
├── src/app.js                 # Express app configuration
└── package.json
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5050) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `MAILTRAP_API_KEY` | Mailtrap API key |
| `MAILTRAP_USE_SANDBOX` | Enable sandbox mode (true/false) |
| `MAILTRAP_INBOX_ID` | Mailtrap inbox ID |

## Security

- Passwords are hashed with bcrypt (10 salt rounds)
- JWT tokens for stateless authentication
- Role-based access control on protected routes
- CORS enabled for cross-origin requests

## License

ISC

## Repository

- GitHub: [https://github.com/ibabatunde/ts-academy-group6-backend](https://github.com/ibabatunde/ts-academy-group6-backend)
- Issues: [https://github.com/ibabatunde/ts-academy-group6-backend/issues](https://github.com/ibabatunde/ts-academy-group6-backend/issues)
