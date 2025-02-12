import prisma from "../config/dbclient";
import  Router  from "express";
import { auth } from "../middleware/user";


const messageRoute = Router(); 

messageRoute.post("/create",async(req:any,res:any)=>{
    try {
        
    } catch (error:any) {
        res.status(500).json({message:error?.message})
    }
})



export default messageRoute;