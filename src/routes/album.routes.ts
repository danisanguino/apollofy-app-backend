import { Router } from 'express';
import {
  createAlbum,
  deleteAlbum,
  getAllAlbums,
  updateAlbum,
} from '../controllers/album.controllers';

const albumsRoutes = Router();

albumsRoutes.get('/', getAllAlbums);
albumsRoutes.post('/', createAlbum);
albumsRoutes.patch('/:userId', updateAlbum);
albumsRoutes.delete('/:userId', deleteAlbum);

export default albumsRoutes;
