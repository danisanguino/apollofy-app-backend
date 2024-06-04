import { Request, Response } from "express";
import prisma from "../db/prismaClient";

const getAllGenres = async (req: Request, res: Response) => {
  try {
    const allGenres = await prisma.genre.findMany();
    return res.status(200).send({
      msg: "All genres",
      data: allGenres,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const createGenre = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send("Name is required");
  }

  try {
    const newGenre = await prisma.genre.create({
      data: {
        name,
      },
    });
    return res.status(201).send({
      msg: "New genre created",
      data: newGenre,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const updateGenre = async (req: Request, res: Response) => {
  const { name } = req.body;
  const { genreId } = req.params;

  try {
    const genreUpdated = await prisma.genre.update({
      where: {
        id: genreId,
      },
      data: {
        name,
      },
    });
    return res.status(200).send({
      msg: "Genre updated",
      data: genreUpdated,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const deleteGenre = async (req: Request, res: Response) => {
  const { genreId } = req.params;

  try {
    const genreDeleted = await prisma.genre.delete({
      where: { id: genreId },
    });
    return res.status(200).send({
      msg: "Genre deleted successfully",
      data: genreDeleted,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};

module.exports = {
  getAllGenres,
  createGenre,
  updateGenre,
  deleteGenre,
};
