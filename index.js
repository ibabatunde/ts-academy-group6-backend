require('dotenv').config({ path: 'properties.env' });
const app = require('./src/app');
const connectDB = require('./src/config/db');
const swaggerjsdoc = require("swagger-jsdoc")
const swaggerui = require("swagger-ui-express")
const PORT = process.env.PORT || 5000;

const options = {
    definition: {
        openapi: "3.0.0",
        servers: [
            {
                url: "http://localhost:5050",
            },
        ],
        info: {
            title: "Payroll Managament API",
            version: "1.0.0",
            description: "API documentation for the Payroll Management System",
        },
    },
    apis: ["./src/routes/**/*.js"],
};

const specs = swaggerjsdoc(options);
app.use(
    "/api-docs",
    swaggerui.serve, 
    swaggerui.setup(specs)
)


connectDB();

app.listen(PORT, () => {
    console.log(`Payroll Engine humming on port ${PORT}`);
});