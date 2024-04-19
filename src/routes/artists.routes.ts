import { Router } from 'express';
import {
  createArtist,
  deleteArtist,
  getAllArtists,
  updateArtist,
} from '../controllers/artists.controllers';

const artistsRoutes = Router();

artistsRoutes.get('/', getAllArtists);
artistsRoutes.post('/', createArtist);
artistsRoutes.patch('/:artistId', updateArtist);
artistsRoutes.delete('/:artistId', deleteArtist);

export default artistsRoutes;
