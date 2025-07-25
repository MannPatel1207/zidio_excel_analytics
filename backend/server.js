require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db.config');

const PORT = process.env.PORT || 5000;

connectDB()
.then(() => {
    console.log("Database connected");
});

app.listen(PORT,()=>{
    console.log(`app listing on port ${PORT}`);
});