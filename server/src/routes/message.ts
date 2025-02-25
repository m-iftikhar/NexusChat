import prisma from "../config/dbclient";
import  Router  from "express";
import { auth } from "../middleware/user";
import cloudinary from "../config/cloudinary";

const messageRoute = Router(); 
  
// create message



// POST route to create a message with file (image, audio, or video)
messageRoute.post("/create", auth, async (req: any, res: any) => {
  try {
    console.log("Received Files:", req.files);
    if (!req.files) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const { receiverId, content, image, audio, video, file } = req.body;
    const userId = req?.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!receiverId || !content) {
      return res.status(400).json({ error: "Receiver ID and content are required" });
    }

    let imageUrl = null;
    let audioUrl = null;
    let videoUrl = null;
    let fileUrl = null;

    // Upload image to Cloudinary if provided
    if (req.files?.image) {
        const uploadedImage = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
          folder: "messages",
          resource_type: "image", // Ensure it's treated as an image
        });
        imageUrl = uploadedImage.secure_url;
      }
   

    // Upload video to Cloudinary if provided
    if (req.files?.video) {
        const uploadedVideo = await cloudinary.uploader.upload(req.files.video.tempFilePath, {
          folder: "messages",
          resource_type: "video", // Cloudinary handles video properly
        });
        videoUrl = uploadedVideo.secure_url;
      }
      

    // Upload other files to Cloudinary if provided
    if (req.files?.audio) {
        const uploadedAudio = await cloudinary.uploader.upload(req.files.audio.tempFilePath, {
          folder: "messages",
          resource_type: "video", // Cloudinary handles audio as video
        });
        audioUrl = uploadedAudio.secure_url;
      }
      
      if (req.files?.file) {
        const uploadedFile = await cloudinary.uploader.upload(req.files.file.tempFilePath, {
          folder: "messages",
          resource_type: "raw", // Handles all other file types
        });
        fileUrl = uploadedFile.secure_url;
      }
      

    // Save message in the database with URLs for image, audio, video, or file
    const message = await prisma.message.create({
      data: {
        content,
        senderId: Number(userId),
        receiverId: Number(receiverId),
        image: imageUrl,
        audio: audioUrl,
        video: videoUrl,
        file: fileUrl,
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