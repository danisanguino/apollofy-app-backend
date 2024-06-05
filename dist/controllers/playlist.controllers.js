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
exports.deletePlaylist = exports.updatePlaylist = exports.createPlaylist = exports.getAllPlaylists = void 0;
const prismaClient_1 = __importDefault(require("../db/prismaClient"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const cloudinary_1 = require("../utils/cloudinary");
const getAllPlaylists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allPlaylist = yield prismaClient_1.default.playlist.findMany({
            include: {
                tracks: true,
            },
        });
        res.status(202).send({ msg: 'Here are all the playlist', allPlaylist });
    }
    catch (error) {
        res.status(404).send('An error occurred to get playlist');
    }
});
exports.getAllPlaylists = getAllPlaylists;
const createPlaylist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, description, tracksId, publicPlaylist } = req.body;
    //No desestructurar
    const thumbnail = (_a = req.files) === null || _a === void 0 ? void 0 : _a.thumbnail;
    const { userId } = req.params;
    if (!name || !description) {
        return res.status(404).send('Name and descriptions are required');
    }
    try {
        const newPlaylist = yield prismaClient_1.default.playlist.create({
            //Crear datos texto
            data: {
                name,
                description,
                publicPlaylist,
                // tracks: { connect: tracksId.map((g: any) => ({ id: g })) },
                userId,
            },
        });
        //Crear la imagen si fuese necesario, opcional
        if (req.files && thumbnail) {
            if (Array.isArray(thumbnail)) {
                return res.status(400).json({
                    msg: 'You can only upload one file per playlist.',
                });
            }
            else {
                const result = yield (0, cloudinary_1.uploadImageCloudinary)(thumbnail.tempFilePath); // Subir el archivo único
                const newPlaylistThumbnail = yield prismaClient_1.default.playlist.update({
                    where: { id: newPlaylist.id },
                    data: {
                        thumbnail: result.secure_url,
                        public_id_thumbnail: result.public_id,
                    },
                });
                yield fs_extra_1.default.unlink(thumbnail.tempFilePath);
                return res.status(201).send({
                    msg: 'New playlist created',
                    data: newPlaylistThumbnail,
                });
            }
        }
        const tracksRelated = tracksId.map((t) => ({
            trackId: t,
            playlistId: newPlaylist.id,
        }));
        yield prismaClient_1.default.playlistTrack.createMany({
            data: tracksRelated,
        });
        return res.status(201).send({
            msg: 'New playlist created',
            data: newPlaylist,
        });
    }
    catch (error) {
        res.status(404).send('An error occurred to create the playlist' + error);
    }
});
exports.createPlaylist = createPlaylist;
const updatePlaylist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { name, likes, description, publicPlaylist, tracksId } = req.body;
    const thumbnail = (_b = req.files) === null || _b === void 0 ? void 0 : _b.thumbnail;
    const { playListId } = req.params;
    try {
        const updatingPlaylist = yield prismaClient_1.default.playlist.update({
            where: { id: playListId },
            data: {
                name,
                description,
                publicPlaylist,
                likes,
            },
        });
        if (req.files && thumbnail) {
            //Eliminar la imagen para volverla a subir
            //Elimina
            if (updatingPlaylist.public_id_thumbnail) {
                yield (0, cloudinary_1.deleteImageCloudinary)(updatingPlaylist.public_id_thumbnail);
            }
            //Sube mismo método que el create
            if (Array.isArray(thumbnail)) {
                return res.status(400).json({
                    msg: 'You can only upload one file per playlist.',
                });
            }
            else {
                const result = yield (0, cloudinary_1.uploadImageCloudinary)(thumbnail.tempFilePath); // Subir el archivo único
                const newPlaylistThumbnail = yield prismaClient_1.default.playlist.update({
                    where: { id: playListId },
                    data: {
                        thumbnail: result.secure_url,
                        public_id_thumbnail: result.public_id,
                    },
                });
                yield fs_extra_1.default.unlink(thumbnail.tempFilePath);
                return res.status(201).send({
                    msg: 'The thumbnail of Playlist has been updated',
                    data: newPlaylistThumbnail,
                });
            }
        }
        if (tracksId && tracksId.length) {
            const tracksRelated = tracksId.map((t) => ({
                trackId: t,
                playListId,
            }));
            yield prismaClient_1.default.playlistTrack.deleteMany({
                where: {
                    playlistId: playListId,
                },
            });
            yield prismaClient_1.default.playlistTrack.createMany({
                data: tracksRelated,
            });
        }
        res
            .status(201)
            .send({ msg: 'The playlist has been updated', data: updatingPlaylist });
    }
    catch (error) {
        res.status(400).send({ msg: 'ERROR' });
    }
});
exports.updatePlaylist = updatePlaylist;
const deletePlaylist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { playListId } = req.params;
    try {
        const playListDeleted = yield prismaClient_1.default.playlist.delete({
            where: { id: playListId },
        });
        if (playListDeleted.public_id_thumbnail) {
            yield (0, cloudinary_1.deleteImageCloudinary)(playListDeleted.public_id_thumbnail);
        }
        res
            .status(201)
            .send({ msg: 'Playlist has been deleted', data: playListDeleted });
    }
    catch (error) {
        res.status(400).send({ msg: 'ERROR', error });
    }
});
exports.deletePlaylist = deletePlaylist;
