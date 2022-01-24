
const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");



  //get post 
  router.get("/:id", async (req, res) => {
    try {
        console.log(req.params.id);
    console.log(req.body.userId);
   const post = await Post.findById(req.params.id)
        const {updatedAt,...other} = post._doc
        res.status(200).json(other)
        
    } catch (error) {
        res.status(500).json(error)
    }
 
})

//get timeline

router.get("/timeline/all",async (req,res)=>{
        try {
            const currentUser = await User.findById(req.body.userId)
            console.log(currentUser);
            const userPosts = await Post.find({userId: currentUser._id})
            console.log(userPosts);
            const friendsPosts = await Promise.all(
                currentUser.followings.map(friendId=>{
                    Post.find({userId: friendId})
                })
            )

            res.json(userPosts.concat(friendsPosts))
        } catch (error) {
            
        }
})


//create a post 
router.post("/create", async (req, res) => {
    console.log(req.body.userId,
        req.body.desc,
        req.body.img);
    try {
        const post = new Post(req.body)

        await post.save()

        res.status(200).json("saved post")
    } catch (error) {
        res.status(500).json(error)
    }

})

//update post 

router.put("/:id", async (req, res) => {

    try {

        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {

            await Post.updateOne({ $set: req.body })
            res.status(200).json("the post has been updated")
        } else {
            res.status(403).json("you can update only your post")
        }


    } catch (error) {
        res.status(500).json(err)
    }



})

//delete Post 
router.delete("/:id", async (req, res) => {

    try {

        const post = await Post.findById(req.params.id)
        console.log(post.userId);
        console.log(req.body.userId);
        if (post.userId === req.body.userId) {

            await post.deleteOne()
            res.status(200).json("**the post deleted**")
        } else {
            res.status(403).json("you can deleted only your post!!")
        }


    } catch (error) {
        res.status(500).json(error)
    }



})
// like 

router.put("/:id/like", async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)
        console.log(req.params.id);
        console.log(req.body.userId);
        if (req.body.userId !== req.params.id) {
            if (!post.likes.includes(req.body.userId)) {
                await post.updateOne({ $push: { likes: req.body.userId } })

                res.status(200).json("liked")
            }
            else {
                await post.updateOne({ $pull: { likes: req.body.userId } })

                res.status(200).json("podt dislikes")
            }

        }
        else { res.status(500).json("cant like your post") }
    } catch (error) {

    }


  
})

module.exports = router