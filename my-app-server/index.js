require('./config/db');

const app = require('express')();
const port = process.env.PORT;

const userRouter = require('./api/user');

const bodyparser = require('express').json;
app.use(bodyparser());

const cors = require("cors");
const corsOptions = {
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
    optionsSuccessStatus: 204 
  };
  
  app.use(cors(corsOptions)); 
  
  
  app.options('*', cors(corsOptions));

app.use('/user' , userRouter);

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})
