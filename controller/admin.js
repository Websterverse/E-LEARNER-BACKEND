
import trycatch from "../middleware/TryCatch.js";
import { Courses } from "../models/Course.js";
import { Lecture } from "../models/Lecture.js";
import {rm} from "fs" 
import {promisify} from 'util' ;
import fs from "fs"
import { User } from "../models/User.js";

export const CreateCourse = trycatch(async (req, res) => {
    const { title, description, category, createdBy, duration, price } = req.body;
  
    const image = req.file;
  
    await Courses.create({
      title,
      description,
      category,
      createdBy,
      image: image?.path,
      duration,
      price,
    });
  
    res.status(201).json({
      message: "Course Created Successfully",
    });
  });
  
  

export const addLectures = trycatch(async (req, res) => {
    const course = await Courses.findById(req.params.id);
  
    if (!course)
      return res.status(404).json({
        message: "No Course with this id",
      });
  
    const { title, description } = req.body;
  
    const file = req.file;
  
    const lecture = await Lecture.create({
      title,
      description,
      video: file?.path,
      course: course._id,
    });
  
    res.status(201).json({
      message: "Lecture Added",
      lecture,
    });
  });



  
  export const deleteLecture = trycatch(async(req , res)=>{

    const lecture = await Lecture.findById(req.params.id);
     rm(lecture.video , ()=>{
        console.log("video deleted");
     })
     
     await lecture.deleteOne();
     res.json({
        message: "Lecutre deleted" ,
     })

})


const unlinkAsync = promisify(fs.unlink) ; 

export const deleteCourse = trycatch(async(req , res)=>{
    const course = await Courses.findById(req.params.id);

    const lectures = await Lecture.find({course: course._id})
    ;

    await Promise.all(
        lectures.map(async(lecture)=>{
await unlinkAsync(lecture.video);
console.log("video deleted");
        })
    );

    rm(course.image , ()=>{
        console.log("Image deleted");
     })    

     await Lecture.find({course : req.params.id}).deleteMany();
     await course.deleteOne()

     await User.updateMany({} , {$pull:{subscription : req.params.id}})

     res.json({message : "Course Deleted"});
})


export const getAllStats = trycatch(async (req , res)=>{
const totalCourses = (await Courses.find()).length ; 
const totalLectures = (await Lecture.find()).length ; 
const totalUsers = (await User.find()).length ; 

const stats = {
    totalCourses ,
    totalLectures ,
    totalUsers ,
}
res.json({stats});

})





export const getAllUser = trycatch(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select(
    "-password"
  );

  res.json({ users });
});

export const updateRole = trycatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "This endpoint is assign to admin",
    });
  const user = await User.findById(req.params.id);

  if (user.role === "user") {
    user.role = "admin";
    await user.save();

    return res.status(200).json({
      message: "Role updated to admin",
    });
  }

  if (user.role === "admin") {
    user.role = "user";
    await user.save();

    return res.status(200).json({
      message: "Role updated",
    });
  }
});