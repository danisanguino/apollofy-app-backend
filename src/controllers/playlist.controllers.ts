import { Request, Response } from 'express';
import prisma from '../db/prismaClient';
import fs from 'fs-extra';
import {
  deleteImageCloudinary,
  uploadImageCloudinary,
} from '../utils/cloudinary';

export const getAllPlaylists = async (req: Request, res: Response) => {
  try {
    const allPlaylist = await prisma.playlist.findMany({
      include: {
        tracks: true,
      },
    });
    res.status(202).send({ msg: 'Here are all the playlist', allPlaylist });
  } catch (error) {
    res.status(404).send('An error occurred to get playlist');
  }
};

export const createPlaylist = async (req: Request, res: Response) => {
  const { name, description, tracksId, publicPlaylist } = req.body;
  //No desestructurar
  const thumbnail = req.files?.thumbnail;
  const { userId } = req.params;

  if (!name || !description) {
    return res.status(404).send('Name and descriptions are required');
  }

  try {
    const newPlaylist = await prisma.playlist.create({
      //Crear datos texto
      data: {
        name,
        description,
        publicPlaylist,
        // tracks: { connect: tracksId.map((g: any) => ({ id: g })) },
        userId,
      },
    });

    //Crear la imagen si fuese necesario, opcional
    if (req.files && thumbnail) {
      if (Array.isArray(thumbnail)) {
        return res.status(400).json({
          msg: 'You can only upload one file per playlist.',
        });
      } else {
        const result = await uploadImageCloudinary(thumbnail.tempFilePath); // Subir el archivo único
        const newPlaylistThumbnail = await prisma.playlist.update({
          where: { id: newPlaylist.id },
          data: {
            thumbnail: result.secure_url,
            public_id_thumbnail: result.public_id,
          },
        });

        await fs.unlink(thumbnail.tempFilePath);
        return res.status(201).send({
          msg: 'New playlist created',
          data: newPlaylistThumbnail,
        });
      }
    }

    const tracksRelated = tracksId.map((t: string) => ({
      trackId: t,
      playlistId: newPlaylist.id,
    }));

    await prisma.playlistTrack.createMany({
      data: tracksRelated,
    });

    return res.status(201).send({
      msg: 'New playlist created',
      data: newPlaylist,
    });
  } catch (error) {
    res.status(404).send('An error occurred to create the playlist' + error);
  }
};

export const updatePlaylist = async (req: Request, res: Response) => {
  const { name, likes, description, publicPlaylist, tracksId } = req.body;
  const thumbnail = req.files?.thumbnail;
  const { playListId } = req.params;

  try {
    const updatingPlaylist = await prisma.playlist.update({
      where: { id: playListId },
      data: {
        name,
        description,
        publicPlaylist,
        likes,
      },
    });

    if (req.files && thumbnail) {
      //Eliminar la imagen para volverla a subir
      //Elimina
      if (updatingPlaylist.public_id_thumbnail) {
        await deleteImageCloudinary(updatingPlaylist.public_id_thumbnail);
      }
      //Sube mismo método que el create
      if (Array.isArray(thumbnail)) {
        return res.status(400).json({
          msg: 'You can only upload one file per playlist.',
        });
      } else {
        const result = await uploadImageCloudinary(thumbnail.tempFilePath); // Subir el archivo único
        const newPlaylistThumbnail = await prisma.playlist.update({
          where: { id: playListId },
          data: {
            thumbnail: result.secure_url,
            public_id_thumbnail: result.public_id,
          },
        });

        await fs.unlink(thumbnail.tempFilePath);
        return res.status(201).send({
          msg: 'The thumbnail of Playlist has been updated',
          data: newPlaylistThumbnail,
        });
      }
    }

    if (tracksId && tracksId.length) {
      const tracksRelated = tracksId.map((t: string) => ({
        trackId: t,
        playListId,
      }));

      await prisma.playlistTrack.deleteMany({
        where: {
          playlistId: playListId,
        },
      });

      await prisma.playlistTrack.createMany({
        data: tracksRelated,
      });
    }

    res
      .status(201)
      .send({ msg: 'The playlist has been updated', data: updatingPlaylist });
  } catch (error) {
    res.status(400).send({ msg: 'ERROR' });
  }
};

export const deletePlaylist = async (req: Request, res: Response) => {
  const { playListId } = req.params;

  try {
    const playListDeleted = await prisma.playlist.delete({
      where: { id: playListId },
    });

    if (playListDeleted.public_id_thumbnail) {
      await deleteImageCloudinary(playListDeleted.public_id_thumbnail);
    }

    res
      .status(201)
      .send({ msg: 'Playlist has been deleted', data: playListDeleted });
  } catch (error) {
    res.status(400).send({ msg: 'ERROR', error });
  }
};
