import { Request, Response } from 'express';
import prisma from '../db/prismaClient';

export const getAllGenres = (req: Request, res: Response) => {
  try {
    const allGenres = prisma.genre.findMany();
    return res.status(200).send({
      msg: 'All genres',
      data: allGenres,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};

export const createGenre = (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send('Name is required');
  }

  try {
    const newGenre = prisma.genre.create({
      data: {
        name,
      },
    });
    return res.status(201).send({
      msg: 'New genre created',
      data: newGenre,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};

export const updateGenre = (req: Request, res: Response) => {
  const { name } = req.body;
  const { genreId } = req.params;

  try {
    const genreUpdated = prisma.genre.update({
      where: {
        id: genreId,
      },
      data: {
        name,
      },
    });
    return res.status(200).send({
      msg: 'Genre updated',
      data: genreUpdated,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};

export const deleteGenre = (req: Request, res: Response) => {
  const { genreId } = req.params;

  try {
    const genreDeleted = prisma.genre.delete({
      where: { id: genreId },
    });
    return res.status(200).send({
      msg: 'Genre deleted successfully',
      data: genreDeleted,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};
