import prisma from "../config/dbclient";
import  Router  from "express";
import { auth } from "../middleware/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userRoute = Router(); 



userRoute.get("/users", auth, async (req: any, res: any) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: req?.user?.id
                }
            }
        });

        // Send the retrieved users as a response
        res.json(users);
        

    } catch (error: any) {
        res.status(500).json({ message: error?.message });
    }
});     // toke  chnge krna to check this agar login dubaar krna h 


userRoute.get("/user", auth, async (req: any, res: any) => {
    try {
        const users = await prisma.user.findUnique({
            where: {
                id: req?.user?.id
                
            }
        });

        // Send the retrieved users as a response
        res.json(users);
        

    } catch (error: any) {
        res.status(500).json({ message: error?.message });
    }
});

export default userRoute; 