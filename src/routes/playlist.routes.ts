import { Router } from "express";
import { createPlaylist, deletePlaylist, getAllPlaylists, updatePlaylist,
} from "../controllers/playlist.controllers";

const playlistRoutes = Router();

playlistRoutes.get("/", getAllPlaylists);
playlistRoutes.post("/:userId", createPlaylist);
playlistRoutes.patch("/:playListId", updatePlaylist);
playlistRoutes.delete("/:playListId", deletePlaylist);

export default playlistRoutes;