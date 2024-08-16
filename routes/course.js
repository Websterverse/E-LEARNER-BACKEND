import express from "express"
import { checkout, fetchLecture, fetchLectures, getAllCourses, getMyCourses, paymentVerification, singleCourse } from "../controller/course.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router()

router.get("/course/all" , getAllCourses);
router.get("/course/:id" , singleCourse);
router.get("/lectures/:id" ,    isAuth  ,  fetchLectures);
router.get("/lecture/:id" ,    isAuth  ,  fetchLecture);
router.get("/mycourses" , isAuth , getMyCourses);
// router.post("/course/checkout/:id" , isAuth  , checkout);
// router.post("/verification/:id" , isAuth , paymentVerification)
router.post("/course/checkout/:id", isAuth, checkout);
router.post("/verification/:id", isAuth, paymentVerification);

export default router ; 