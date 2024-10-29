require("dotenv").config();

const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("DB connected succesfully");
  })
  .catch((error) => console.log(error));
