const express = require('express')
const app = express();
const cors = require('cors');
const userRouter = require('./routes/user.route');
const authRouter = require('./routes/auth.route');
const fileRouter = require('./routes/file.route');
const errorHandler = require('./middlewares/error.middleware');
const insightRouter = require('./routes/insights.route');

const corsOptions = {
  origin: true, 
  credentials: true,            
}

app.use(cors(corsOptions));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Routes
app.use('/api/v1/user',userRouter);
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/file',fileRouter);
app.use('/api/v1/insights',insightRouter);

//Error middleware
app.use(errorHandler);
// Handle undefined routes
// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

module.exports = app;