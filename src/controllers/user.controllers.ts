import { Request, Response } from 'express';
import prisma from '../db/prismaClient';
import fs from 'fs-extra';
import {
  uploadImageCloudinary,
  deleteImageCloudinary,
} from '../utils/cloudinary';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await prisma.user.findMany();
    res.status(201).send({ msg: 'Here are all your users', data: allUsers });
  } catch (error) {
    res.status(400).send({ msg: 'Error', error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, username, role } = req.body;
  if (!name || !email || !username) {
    return res
      .status(400)
      .send(
        'The fields name, lastname, email, password and username are required'
      );
  }
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        name,
        email,
        password,
        role,
      },
    });
    console.log('🚀 ~ createUser ~ newUser:', newUser);

    if (req.files && req.files.img) {
      if (Array.isArray(req.files.img)) {
        return res.status(400).json({
          msg: 'You can only upload one file per user.',
        });
      } else {
        const result = await uploadImageCloudinary(req.files.img.tempFilePath); // Subir el archivo único
        const newUserImg = await prisma.user.update({
          where: { id: newUser.id },
          data: {
            img: result.secure_url,
            public_id_img: result.public_id,
          },
        });

        await fs.unlink(req.files.img.tempFilePath);
        return res.status(201).send({
          msg: 'New user created',
          data: newUserImg,
        });
      }
    }
    return res.status(201).send({
      msg: 'New user created',
      data: newUser,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { name, email, password, username, role } = req.body;
  const { userId } = req.params;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        password,
        username,
        role,
      },
    });

    if (req.files && req.files.img) {
      //Eliminar la imagen para volverla a subir
      //Elimina
      if (updatedUser.public_id_img) {
        await deleteImageCloudinary(updatedUser.public_id_img);
      }
      //Sube mismo método que el create
      if (Array.isArray(req.files.img)) {
        return res.status(400).json({
          msg: 'You can only upload one file per user.',
        });
      } else {
        const result = await uploadImageCloudinary(req.files.img.tempFilePath); // Subir el archivo único
        const newUserImg = await prisma.user.update({
          where: { id: userId },
          data: {
            img: result.secure_url,
            public_id_img: result.public_id,
          },
        });

        await fs.unlink(req.files.img.tempFilePath);
        return res.status(201).send({
          msg: 'New user created',
          data: newUserImg,
        });
      }
    }

    res
      .status(201)
      .send({ msg: 'The user has been updated', data: updatedUser });
  } catch (error) {
    res.status(400).send({ msg: 'ERROR' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const userDeleted = await prisma.user.delete({ where: { id: userId } });

    if (userDeleted.public_id_img) {
      await deleteImageCloudinary(userDeleted.public_id_img);
    }

    res
      .status(201)
      .send({ msg: 'User has been deleted successfully', data: userDeleted });
  } catch (error) {
    res.status(400).send({ msg: 'ERROR' });
  }
};
