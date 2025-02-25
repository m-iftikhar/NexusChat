import prisma from "../config/dbclient";
import  Router  from "express";
import { auth } from "../middleware/user";
import cloudinary from "../config/cloudinary";

const messageRoute = Router(); 
  
// create message
// Create message with optional image
messageRoute.post("/create", auth, async (req: any, res: any) => {
    try {
        const { receiverId, content, image } = req.body;
        const userId = req?.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!receiverId || !content) {
            return res.status(400).json({ error: "Receiver ID and content are required" });
        }

        let imageUrl = null;

        // Upload image to Cloudinary if provided
        if (image) {
            const uploadedImage = await cloudinary.uploader.upload(image, {
                folder: "messages",
                resource_type: "auto", // Handles all file types
            });
            imageUrl = uploadedImage.secure_url;
        }

        // Save message in DB
        const message = await prisma.message.create({
            data: {
                content,
                senderId: Number(userId),
                receiverId: Number(receiverId),
                image: imageUrl,
            },
        });

        res.status(200).json(message);
    } catch (error: any) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
});

// get message

messageRoute.get("/",auth,async(req:any,res:any)=>{
    try {
        console.log("Query Params:", req.query);

        const {senderId}=req.query;
      
        const userId=req?.user?.id;
        

console.log("Sender ID:", senderId, "User ID:", userId);

        if(!userId){
            return res.status(401).json({error:"Unauthorized"});
        }
        const messages= await prisma.message.findMany({
            where:{
                OR:[
                    {senderId:Number(userId),receiverId:Number(senderId)},
                    {senderId:Number(senderId),receiverId:Number(userId)}
                ]  
            },
            include: {
                sender: true,  // Relation "SentMessages"
                receiver: true // Relation "ReceivedMessages"
            }
        });
        res.json(messages);
        
    } catch (error:any) {
        res.status(500).json({message:error?.message})
    }
})



export default messageRoute;