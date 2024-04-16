import { Router }  from "express";
import { createUser, deleteUser, getAllUsers, updateUser } from "../controllers/users.controllers";

const userRoutes = Router();

userRoutes.get("/", getAllUsers)
userRoutes.post("/", createUser)
userRoutes.patch("/", updateUser)
userRoutes.delete("/", deleteUser)

export default userRoutes;