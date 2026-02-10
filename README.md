Payroll Management System Specifications
Project Name: Payroll Management System
Team: Group 6
Tech Stack: Node.js, Express, Database (PostgreSQL - preferred as data is relational / MongoDB), JWT
Required Middleware: Logging, authentication, authorisation, validation, global error handler
Roles & Access Model
Role
Description
Permissions
Employee
Self-service access
View own payslips
HR
Employee and payroll management
Manage employees (create, update, delete), create payroll run, generate payroll, view payroll
Admin
System-wide control
All HR permissions, approve payroll
Authorisation is enforced using middleware.
Core Domain Model
Entity Field Definitions
User
Field
Data type
Required
Notes
id
uuid
True
PK
email
string
True
passwordHash
string
True
role
enum
True
Employee / HR / Admin
isActive
boolean
True
Only active users can log in
Employee
Field
Data type
Required
Notes
id
uuid
True
PK
userId
uuid
False
FK to User. Not all employees would need to log in. so they may not all need user profiles.
name
string
True
department
string
True
jobTitle
string
True
baseSalary
float
True
isDeleted
boolean
True
System should only allow soft-deletion. Employees marked as deleted should not be calculated in payroll run.
Payroll
Field
Data type
Required
Notes
id
uuid
True
PK
month
integer
True
year
integer
True
status
enum
True
Draft / Generated / Approved / Paid
Payslip
Field
Data type
Required
Notes
id
uuid
True
PK
payrollId
uuid
True
FK to Payroll
employeeId
uuid
True
FK to Employee
grossPay
float
True
deductions
float
True
netPay
float
True
isPaid
boolean
True
Relationships
One User -> One Employee
One Payroll -> Many Payslips
One Employee -> Many Payslips
System-Wide Conventions
Authentication: On login, a JWT bearer token is issued. This token is included in the ‘Authorization’ header of every request going forward. It is required for all endpoints excluding auth.
Authorisation: Enforced using a single middleware, which is called after the authentication middleware. Forbidden access returns a 403 response.
Validation: All requests (request body, params, queries) are validated. Done by validation middleware before controllers are called. Invalid input returns a 400 response.
Error handling: Error handling is centralised using a custom AppError class defined in utils.
Logging: Every request is logged, including method, path, and status code. All errors are logged also.
APIs
Auth APIs
Method
Path
Roles
Description
Notes
POST
/auth/register
ADMIN
Create user
POST
/auth/login
ALL
Authenticate user
Returns JWT
Employee APIs
Method
Path
Roles
Description
Notes
POST
/employees
ADMIN, HR
Create employee
GET
/employees
ADMIN, HR
List all employees
GET
/employees/:id
ADMIN, HR
Get individual employee’s info
PUT
/employees/:id
ADMIN, HR
Edit employee details
DELETE
/employees/:id
ADMIN, HR
Delete employee
Marks employee as deleted but details remain in DB
GET
/employees/:id/payslips
EMPLOYEE
View payslips
Employees can only view their own payslips
