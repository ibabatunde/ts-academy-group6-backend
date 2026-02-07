require('dotenv').config({ path: 'properties.env' });
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
    console.log(`Payroll Engine humming on port ${PORT}`);
});