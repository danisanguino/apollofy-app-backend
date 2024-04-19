import express from 'express';
import userRoutes from './routes/user.routes';
import trackRoutes from './routes/track.routes';
import { urlencoded } from 'body-parser';
import fileUpload from 'express-fileupload';
import playlistRoutes from './routes/playlist.routes';
import artistsRoutes from './routes/artists.routes';
import albumsRoutes from './routes/album.routes';

const app = express();

//middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: './upload' }));

//routes
app.use('/user', userRoutes);
app.use('/track', trackRoutes);
app.use('/playlist', playlistRoutes);
app.use('/artist', artistsRoutes);
app.use('/album', albumsRoutes);

export default app;
