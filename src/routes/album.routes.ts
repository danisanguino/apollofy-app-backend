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
albumsRoutes.patch('/:albumId', updateAlbum);
albumsRoutes.delete('/:albumId', deleteAlbum);

export default albumsRoutes;
