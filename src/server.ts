import express from "express";
import userRoutes from "./routes/user.routes";
import trackRoutes from "./routes/track.routes";
import { urlencoded } from "body-parser";
import fileUpload from "express-fileupload";
import genreRoutes from "./routes/genre.routes";
import playlistRoutes from "./routes/playlist.routes";
import artistsRoutes from "./routes/artists.routes";
import albumsRoutes from "./routes/album.routes";
import { checkJwtMiddleware } from "./middlewares/checkjwt.middlewares";
import cors from "cors";

const app = express();

//middlewares
app.use(express.json());
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "./upload" }));

//routes
app.use("/user", checkJwtMiddleware, userRoutes);
app.use("/track", checkJwtMiddleware, trackRoutes);
app.use("/genre", checkJwtMiddleware, genreRoutes);
app.use("/playlist", checkJwtMiddleware, playlistRoutes);
app.use("/artist", checkJwtMiddleware, artistsRoutes);
app.use("/album", checkJwtMiddleware, albumsRoutes);

export default app;
