const express = require("express");
const app =express()
const mongoose = require("mongoose")
const dotenv =require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const userRoute = require("./routes/users.js")
const authRoute = require("./routes/auth.js")
const postRoute= require("./routes/posts.js")
dotenv.config()

mongoose.connect("mongodb+srv://< your db link >",
  {  useNewUrlParser: true, useUnifiedTopology: true},()=>{console.log("DB connected")}
);


//middleWare  
app.use(express.json());
app.use(helmet())
app.use(morgan("common"))


app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/posts",postRoute)

app.listen(3300,()=> console.log("working"))
