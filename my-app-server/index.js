require('./config/db');

const app = require('express')();
const port = process.env.PORT;

const userRouter = require('./api/user');

const bodyparser = require('express').json;
app.use(bodyparser());

const cors = require("cors");
app.use(cors());
app.use(cors({ origin: ['https://opguru-autenticate.vercel.app/'] }));

app.use('/user' , userRouter);

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})
