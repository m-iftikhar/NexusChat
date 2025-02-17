import prisma from "../config/dbclient";
import { Router, Request, Response } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getStoragePath } from "../config/storage";
import "dotenv/config";
import { auth } from "../middleware/user";
const authRoute = Router(); 

const imagePath=process.env.IMAGES_PATH;

authRoute.post("/register", async (req:any, res:any) => {
    try {
        const { name, email, password } = req.body;
        console.log(req?.body, req.files, "data");

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        let file: UploadedFile | undefined;
        if (req?.files?.profileImage) {
            file = req.files.profileImage as UploadedFile;
            let storagePath = getStoragePath(file);
            console.log(storagePath, "storagepath");
            await file.mv(storagePath);
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword,
                profileImage: file ? imagePath + file.name : undefined,  // Changed `null` to `undefined`
            },
        });

        return res.status(201).json({ message: "User registered successfully", user });

    } catch (error: any) {
        res.status(400).json({ message: error?.message });
    }
});

authRoute.post("/login",async(req:any,res:any)=>{
    try {
        const {email,password}=req.body;
        const user=await prisma.user.findUnique({
            where:{email}
        });
        if(!user){
            return res.status(404).json({message:"email or password is wrong"})
        }
        const validPassword= await bcrypt.compare(password,user.password);
        if(!validPassword){
            res.status(404).json({message:"invalid password"});
        }
        const token = jwt.sign({id:user.id},process.env.JWT_SECRET as string);
        res.status(200).json({token,user});

    } catch (error:any) {
    res.status(500).json({message:error?.message})
    }
})

authRoute.get("/users", auth,async(req:any,res:any)=>{
    try {
        const users= await prisma.user.findMany({
            where:{
                id:{
                    not:req?.user?.id
                }
            }
        })
        
    } catch (error:any) {
        res.status(500).json({message:error?.message})
    }
})

export default authRoute; 