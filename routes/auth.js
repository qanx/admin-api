//all users APIs is here < update, delete, add 

const router = require("express").Router();
const User = require("../models/User");

const bcrypt = require("bcrypt");
const { send } = require("express/lib/response");
//REGISTER
router.post("/register", async (req, res) => {
    // res.send("hey its auth route")





    try {
        //genrate new Password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)


        //create new User &&  respond
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword

        })

        const user = await newUser.save();

        res.status(200).json(user);

    } catch (error) {
        console.log(error);
    }

    //Login
  

})


router.post("/login",async(req,res)=>{
    try {
        const user = await User.findOne({email:req.body.email})
        !user && res.status(404).send("user not found")
        
        const vaildPassword = await bcrypt.compare(req.body.password, user.password)
        !vaildPassword && res.status(400).json("worng password")

        res.status(200).json(user)
    } catch (error) {
        console.log(error);
    }
   
})

module.exports = router