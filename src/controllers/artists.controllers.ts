import { Request, Response } from 'express';
import prisma from '../db/prismaClient';
import {
  deleteImageCloudinary,
  uploadImageCloudinary,
} from '../utils/cloudinary';
import fs from 'fs-extra';

export const getAllArtists = async (req: Request, res: Response) => {
  try {
    const allArtists = await prisma.artist.findMany();
    res
      .status(201)
      .send({ msg: 'Here are all your artists', data: allArtists });
  } catch (error) {
    res.status(400).send({ msg: 'Error', error });
  }
};

export const createArtist = async (req: Request, res: Response) => {
  const { name, followers } = req.body;
  const img = req.files?.img;

  if (!name || !followers || !img) {
    return res
      .status(400)
      .send('The fields name, url, followers and img are required');
  }
  try {
    if (Array.isArray(img)) {
      return res.status(400).json({
        msg: 'You can only upload one file per artist.',
      });
    } else {
      const result = await uploadImageCloudinary(img.tempFilePath); // Subir el archivo único
      const newArtist = await prisma.artist.create({
        data: {
          name,
          followers,
          img: result.secure_url,
          public_id_img: result.public_id,
        },
      });
      await fs.unlink(img.tempFilePath);
      return res.status(201).send({
        msg: 'New artist created',
        data: newArtist,
      });
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};

export const updateArtist = async (req: Request, res: Response) => {
  const { name, followers, img } = req.body;
  const { artistId } = req.params;
  try {
    const updatedArtist = await prisma.artist.update({
      where: { id: artistId },
      data: {
        name,
        followers,
        img,
      },
    });

    if (req.files && req.files.img) {
      //Eliminar la imagen para volverla a subir
      //Elimina
      if (updatedArtist.public_id_img) {
        await deleteImageCloudinary(updatedArtist.public_id_img);
      }
      //Sube mismo método que el create
      if (Array.isArray(req.files.img)) {
        return res.status(400).json({
          msg: 'You can only upload one file per artist.',
        });
      } else {
        const result = await uploadImageCloudinary(req.files.img.tempFilePath); // Subir el archivo único
        const newArtistImg = await prisma.artist.update({
          where: { id: artistId },
          data: {
            img: result.secure_url,
            public_id_img: result.public_id,
          },
        });

        await fs.unlink(req.files.img.tempFilePath);
        return res.status(201).send({
          msg: 'New artist created',
          data: newArtistImg,
        });
      }
    }

    res
      .status(201)
      .send({ msg: 'The artist has been updated', data: updatedArtist });
  } catch (error) {
    res.status(400).send({ msg: 'ERROR' });
  }
};

export const deleteArtist = async (req: Request, res: Response) => {
  const { artistId } = req.params;

  try {
    const artistDeleted = await prisma.artist.delete({
      where: { id: artistId },
    });

    if (artistDeleted.public_id_img) {
      await deleteImageCloudinary(artistDeleted.public_id_img);
    }

    res.status(201).send({
      msg: 'Artist has been deleted successfully',
      data: artistDeleted,
    });
  } catch (error) {
    res.status(400).send({ msg: 'ERROR' });
  }
};
