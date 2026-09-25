const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '..', '..', '.env') });
const app = require('./app');
const connectDB = require('./config/db');

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening to Port: ${PORT}`);
});