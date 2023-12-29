import express from "express";

const router = express.Router();
router.post('/api/users/signout',(req,res)=>{
    // we're going to send back a header that's going to tell
    // the user's broswer to dump all the info inside the cookie
    req.session = null;
    res.send({});

});

export {router as signoutRouter}; 