const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const config = require("config")

const dataBase = require("./config/mongoose-connection");
const msgRouter = require("./routes/userMessage");
const userRouter = require("./routes/user");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));

app.use('/message', msgRouter);
app.use('/user', userRouter)

app.listen(config.get('PORT'));
