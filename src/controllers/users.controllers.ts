import { Request, Response } from "express";
import prisma from "../db/prismaClient";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await prisma.user.findMany();
    res.status(201).send({ msg: "Here are all your users", data: allUsers });
  } catch (error) {
    res.status(400).send({ msg: "Error", error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, lastname, email, password, img, username, role } = req.body;
  if (!name || !lastname || !email || !password || !username) {
    return res
      .status(400)
      .send(
        "The fields name, lastname, email, password and username are required"
      );
  }
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        lastname,
        email,
        password,
        img,
        username,
        role,
      },
    });
    return res.status(201).send({
      msg: "New user created",
      data: newUser,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { name, lastname, email, password, img, username, role } = req.body;
  const { userId } = req.params;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        lastname,
        email,
        password,
        img,
        username,
        role,
      },
    });
    res
      .status(201)
      .send({ msg: "The user has been updated", data: updatedUser });
  } catch (error) {
    res.status(400).send({ msg: "ERROR" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const userDeleted = await prisma.user.delete({ where: { id: userId } });
    res
      .status(201)
      .send({ msg: "User has been deleted successfully", data: userDeleted });
  } catch (error) {
    res.status(400).send({ msg: "ERROR" });
  }
};
