import express from "express"
import { loginUser, myProfile, register, verify } from "../controller/user.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.post('/user/register' , register)
router.post('/user/verify' , verify)
router.post('/user/login' , loginUser)
router.get('/user/myprofile' , isAuth , myProfile)

export default router ;