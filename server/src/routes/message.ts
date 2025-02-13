import prisma from "../config/dbclient";
import  Router  from "express";
import { auth } from "../middleware/user";


const messageRoute = Router(); 

messageRoute.post("/create",auth,async(req:any,res:any)=>{
    try {
        const {receiverId , content}=req.body;
        const userId=req?.user?.id;
        if(!userId){
            return res.status(401).json({error:"unauthorized"})
        }
        if(!receiverId || !content){
            return res.status(401).json({error:"receiver id and conetnt are required"})
        }
        const message= await prisma.message.create({
            data:{
                content:content as string,
                senderId:userId as number,
                receiverId:receiverId as number
            }
        });
        res.status(200).json(message)
    } catch (error:any) {
        res.status(500).json({message:error?.message})
    }
})



export default messageRoute;