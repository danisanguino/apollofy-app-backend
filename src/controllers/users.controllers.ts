import { Request, Response } from "express";
import prisma from "../db/prismaClient"

export const getAllUsers = async (req: Request, res: Response) => {
    

    try {

        console.log("Ji ome")
        res.status(201).send("Te traigo todo los users calentitos")
    } catch (error) {
        
    }
}

export const createUser = async (req: Request, res: Response) => {
    const {name, lastname, email, password, img, username, role} = req.body
    console.log("hola")
    if(!name || !lastname || !email || !password || !username) {
        return res.status(400).send("Te falta calle")
    }
    try {
        const newUser = await prisma.user.create({
            data: {
                name,
                lastname,
                email,
                password,
                username,
            }
        })
        console.log("Ji ome un usuario nuevo")
        return res.status(201).send({msg: "He añadido un usuario nuevo calentito tambien", data: newUser})
    } catch (error) {
        return res.status(400).send(error)
    }
}

export const updateUser = async (req: Request, res: Response) => {
    
    try {
        console.log("Ji ome te he modificado un usuario")
        res.status(201).send("He actualizado un usuario calentito tambien")
    } catch (error) {
        
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    
    try {
        console.log("Ji ome te he borrao un usuario")
        res.status(201).send("He borrao un usuario calentito tambien")
    } catch (error) {
        
    }
}