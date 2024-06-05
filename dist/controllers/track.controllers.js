"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTrack = exports.updateTrack = exports.createTrack = exports.getAllTracks = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const prismaClient_1 = __importDefault(require("../db/prismaClient"));
const cloudinary_1 = require("../utils/cloudinary");
const getAllTracks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allTracks = yield prismaClient_1.default.track.findMany({
            include: {
                artist: true,
                genres: true,
                album: true,
                playlists: true,
            },
        });
        res.status(201).send({ msg: 'Here are all your tracks', data: allTracks });
    }
    catch (error) {
        res.status(400).send({ msg: 'Error', error });
    }
});
exports.getAllTracks = getAllTracks;
const createTrack = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { title, albumId, artistId, genresId } = req.body;
    const thumbnail = (_a = req.files) === null || _a === void 0 ? void 0 : _a.thumbnail;
    const url = (_b = req.files) === null || _b === void 0 ? void 0 : _b.url;
    const { userId } = req.params;
    if (!title || !thumbnail || !url) {
        return res
            .status(400)
            .send('The fields title, url, thumbnail are required');
    }
    try {
        if (Array.isArray(thumbnail) || Array.isArray(url)) {
            return res.status(400).json({
                msg: 'You can only upload one file per track.',
            });
        }
        else {
            const resultThumbnail = yield (0, cloudinary_1.uploadImageCloudinary)(thumbnail.tempFilePath); // Subir el archivo único
            const resultUrl = yield (0, cloudinary_1.uploadAudioCloudinary)(url.tempFilePath); // Subir el archivo único
            const newTrack = yield prismaClient_1.default.track.create({
                data: {
                    title,
                    url: resultUrl.secure_url,
                    public_id_url: resultUrl.public_id,
                    duration: resultUrl.duration,
                    user: { connect: { id: userId } },
                    thumbnail: resultThumbnail.secure_url,
                    public_id_thumbnail: resultThumbnail.public_id,
                },
            });
            yield fs_extra_1.default.unlink(thumbnail.tempFilePath);
            yield fs_extra_1.default.unlink(url.tempFilePath);
            const genresRelated = genresId.map((g) => ({
                trackId: newTrack.id,
                genreId: g,
            }));
            yield prismaClient_1.default.trackGenre.createMany({
                data: genresRelated,
            });
            yield prismaClient_1.default.trackArtist.create({
                data: {
                    trackId: newTrack.id,
                    artistId,
                },
            });
            if (albumId) {
                yield prismaClient_1.default.trackAlbum.create({
                    data: {
                        trackId: newTrack.id,
                        albumId,
                    },
                });
                return res.status(201).send({
                    msg: 'New track with album has been created successfully',
                    data: newTrack,
                });
            }
            return res.status(201).send({
                msg: 'New track without album has been created successfully',
                data: newTrack,
            });
        }
    }
    catch (error) {
        return res.status(400).send(error);
    }
});
exports.createTrack = createTrack;
const updateTrack = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { title, likes, genresId } = req.body;
    const thumbnail = (_c = req.files) === null || _c === void 0 ? void 0 : _c.thumbnail;
    const { trackId } = req.params;
    try {
        const updatedTrack = yield prismaClient_1.default.track.update({
            where: { id: trackId },
            data: {
                title,
                likes,
            },
        });
        if (req.files && thumbnail) {
            //Eliminar la imagen para volverla a subir
            //Elimina
            if (updatedTrack.public_id_thumbnail) {
                yield (0, cloudinary_1.deleteImageCloudinary)(updatedTrack.public_id_thumbnail);
            }
            //Sube mismo método que el create
            if (Array.isArray(thumbnail)) {
                return res.status(400).json({
                    msg: 'You can only upload one file per user.',
                });
            }
            else {
                const result = yield (0, cloudinary_1.uploadImageCloudinary)(thumbnail.tempFilePath); // Subir el archivo único
                const newTrackThumbnail = yield prismaClient_1.default.track.update({
                    where: { id: trackId },
                    data: {
                        thumbnail: result.secure_url,
                        public_id_thumbnail: result.public_id,
                    },
                });
                yield fs_extra_1.default.unlink(thumbnail.tempFilePath);
                return res
                    .status(201)
                    .send({ msg: 'The track has been updated', data: newTrackThumbnail });
            }
        }
        if (genresId && genresId.length) {
            const genres = genresId.map((g) => ({
                trackId,
                genreId: g,
            }));
            yield prismaClient_1.default.trackGenre.deleteMany({
                where: {
                    trackId: trackId,
                },
            });
            yield prismaClient_1.default.trackGenre.createMany({
                data: genres,
            });
        }
        return res
            .status(201)
            .send({ msg: 'The track has been updated', data: updatedTrack });
    }
    catch (error) {
        res.status(400).send({ msg: 'ERROR' });
    }
});
exports.updateTrack = updateTrack;
const deleteTrack = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { trackId } = req.params;
    try {
        const trackDeleted = yield prismaClient_1.default.track.delete({ where: { id: trackId } });
        yield (0, cloudinary_1.deleteImageCloudinary)(trackDeleted.public_id_thumbnail);
        yield (0, cloudinary_1.deleteAudioCloudinary)(trackDeleted.public_id_url);
        res
            .status(201)
            .send({ msg: 'Track has been deleted successfully', data: trackDeleted });
    }
    catch (error) {
        res.status(400).send({ msg: 'ERROR' });
    }
});
exports.deleteTrack = deleteTrack;
