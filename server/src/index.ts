import express,{Application,Request,Response} from 'express'
import cors from 'cors';
import path from 'path';
import prisma from './config/dbclient';
const PORT=process.env.PORT || 5000;
const app:Application=express();

const startServer =async()=>{
    try {
        await prisma.$connect();
        console.log("prisma connected to database");
        const server=app.listen(PORT,()=>{
            console.log(`server is ruuning on ${PORT}`)
        })
    } catch (error) {
        console.error("❌ Error connecting to Prisma:", error);
    }
}

startServer();
