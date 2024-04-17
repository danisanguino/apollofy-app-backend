import { Router } from "express";
import {
  createTrack,
  deleteTrack,
  getAllTracks,
  updateTrack,
} from "../controllers/track.controllers";

const trackRoutes = Router();

trackRoutes.get("/", getAllTracks);
trackRoutes.post("/:userId", createTrack);
trackRoutes.patch("/:trackId", updateTrack);
trackRoutes.delete("/:trackId", deleteTrack);

export default trackRoutes;
