import { Request, Response } from 'express';
import fs from 'fs-extra';
import prisma from '../db/prismaClient';
import {
  deleteImageCloudinary,
  uploadImageCloudinary,
} from '../utils/cloudinary';

export const getAllAlbums = async (req: Request, res: Response) => {
  try {
    const allAlbums = await prisma.album.findMany({
      include: {
        artist: true,
      },
    });
    res.status(201).send({ msg: 'Here are all your albums', data: allAlbums });
  } catch (error) {
    res.status(400).send({ msg: 'Error', error });
  }
};

export const createAlbum = async (req: Request, res: Response) => {
  const { name, artistId } = req.body;
  const thumbnail = req.files?.thumbnail;

  if (!name || !thumbnail) {
    return res
      .status(400)
      .send('The fields name, thumbnail and tracks are required');
  }
  try {
    if (Array.isArray(thumbnail)) {
      return res.status(400).send({
        msg: 'You can only upload one file per track.',
      });
    } else {
      const resultThumbnail = await uploadImageCloudinary(
        thumbnail.tempFilePath
      ); // Subir el archivo único
      const newAlbum = await prisma.album.create({
        data: {
          name,
          thumbnail: resultThumbnail.secure_url,
          public_id_thumbnail: resultThumbnail.public_id,
        },
      });
      await fs.unlink(thumbnail.tempFilePath);
      await prisma.artistAlbum.create({
        data: {
          albumId: newAlbum.id,
          artistId,
        },
      });
      return res.status(201).send({
        msg: 'New album has been created successfully',
        data: newAlbum,
      });
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};

export const updateAlbum = async (req: Request, res: Response) => {
  const { name, likes } = req.body;
  const thumbnail = req.files?.thumbnail;
  const { albumId } = req.params;
  try {
    const updatedAlbum = await prisma.album.update({
      where: { id: albumId },
      data: {
        name,
        likes,
      },
    });
    if (req.files && thumbnail) {
      //Eliminar la imagen para volverla a subir
      //Elimina
      if (updatedAlbum.public_id_thumbnail) {
        await deleteImageCloudinary(updatedAlbum.public_id_thumbnail);
      }
      //Sube mismo método que el create
      if (Array.isArray(thumbnail)) {
        return res.status(400).send({
          msg: 'You can only upload one file per user.',
        });
      } else {
        const result = await uploadImageCloudinary(thumbnail.tempFilePath); // Subir el archivo único
        const newAlbumThumbnail = await prisma.album.update({
          where: { id: albumId },
          data: {
            thumbnail: result.secure_url,
            public_id_thumbnail: result.public_id,
          },
        });
        await fs.unlink(thumbnail.tempFilePath);
        return res
          .status(201)
          .send({ msg: 'The album has been updated', data: newAlbumThumbnail });
      }
    }
    return res
      .status(201)
      .send({ msg: 'The album has been updated', data: updatedAlbum });
  } catch (error) {
    res.status(400).send({ msg: 'ERROR' });
  }
};

export const deleteAlbum = async (req: Request, res: Response) => {
  const { albumId } = req.params;

  try {
    const albumDeleted = await prisma.album.delete({ where: { id: albumId } });
    await deleteImageCloudinary(albumDeleted.public_id_thumbnail);
    res
      .status(201)
      .send({ msg: 'Album has been deleted successfully', data: albumDeleted });
  } catch (error) {
    res.status(400).send({ msg: 'ERROR' });
  }
};
