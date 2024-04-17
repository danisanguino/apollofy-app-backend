import { Request, Response } from "express";
import prisma from "../db/prismaClient";

export const getAllTracks = async (req: Request, res: Response) => {
  try {
    const allTracks = await prisma.track.findMany();
    res.status(201).send({ msg: "Here are all your tracks", data: allTracks });
  } catch (error) {
    res.status(400).send({ msg: "Error", error });
  }
};

export const createTrack = async (req: Request, res: Response) => {
  const { title, url, thumbnail, albumId, artistId } = req.body;
  const { userId } = req.params;
  if (!title || !url || !thumbnail) {
    return res
      .status(400)
      .send("The fields title, url, thumbnail are required");
  }
  try {
    const newTrack = await prisma.track.create({
      data: {
        title,
        url,
        thumbnail,
        albumId,
        artistId,
        userId,
      },
    });
    return res.status(201).send({
      msg: "New track has been created successfully",
      data: newTrack,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};

export const updateTrack = async (req: Request, res: Response) => {
  const { title, url, thumbnail, albumId, artistId } = req.body;
  const { userId } = req.params;
  try {
    const updatedTrack = await prisma.track.update({
      where: { id: userId },
      data: {
        title,
        url,
        thumbnail,
        albumId,
        artistId,
        userId,
      },
    });
    res
      .status(201)
      .send({ msg: "The track has been updated", data: updatedTrack });
  } catch (error) {
    res.status(400).send({ msg: "ERROR" });
  }
};

export const deleteTrack = async (req: Request, res: Response) => {
  const { trackId } = req.params;

  try {
    const trackDeleted = await prisma.track.delete({ where: { id: trackId } });
    res
      .status(201)
      .send({ msg: "Track has been deleted successfully", data: trackDeleted });
  } catch (error) {
    res.status(400).send({ msg: "ERROR" });
  }
};
