import express,{Application,Request,Response} from 'express'
import cors from 'cors';
import path from 'path';
import prisma from './config/dbclient';
import fileUpload from "express-fileupload";
import userRoute from './routes/user';
import authRoute from './routes/auth';
import messageRoute from './routes/message';
import { Server } from 'socket.io';
import { appMessages } from './sockets/socket';
const PORT=process.env.PORT || 5000;
const app:Application=express();


// middleware
app.use(cors());
app.use(express.json({limit:"1gb"}));
app.use(fileUpload());
app.use(express.urlencoded({extended:false}));
app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/message",messageRoute);
app.use("/api/files",express.static(path.join("dist/storage")));

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Welcome to the server");
});

const startServer =async()=>{
    try {
        await prisma.$connect();
        console.log("prisma connected to database");
        const server=app.listen(PORT,()=>{
            console.log(`server is ruuning on ${PORT}`)
        })
        const socketIo = new Server(server,{
            pingTimeout:60000,
            cors:{
                origin:["http://localhost:3000"],
                methods:["GET","POST"]
            }
        })
        socketIo.on("connection",(socket)=>{
            appMessages(socket,socketIo);
        })
    } catch (error) {
        console.error("❌ failed to connect:", error);
        process.exit(1);
    }
}

startServer();
