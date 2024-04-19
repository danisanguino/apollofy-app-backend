import express from "express";
import userRoutes from "./routes/user.routes";
import trackRoutes from "./routes/track.routes";
import { urlencoded } from "body-parser";
import fileUpload from "express-fileupload";
import playlistRoutes from "./routes/playlist.routes";
import artistsRoutes from "./routes/artists.routes";

const app = express();

//middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "./upload" }));

//routes
app.use("/user", userRoutes);
app.use("/track", trackRoutes);
app.use("/playlist", playlistRoutes);
app.use("/", artistsRoutes)

export default app;
