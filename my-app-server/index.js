require('./config/db');

const app = require('express')();
const port = 3000;

const userRouter = require('./api/user');

const bodyparser = require('express').json;
app.use(bodyparser());

const cors = require("cors");
app.use(cors());

app.use('/user' , userRouter);

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})