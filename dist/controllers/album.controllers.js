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
exports.deleteAlbum = exports.updateAlbum = exports.createAlbum = exports.getAllAlbums = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const prismaClient_1 = __importDefault(require("../db/prismaClient"));
const cloudinary_1 = require("../utils/cloudinary");
const getAllAlbums = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allAlbums = yield prismaClient_1.default.album.findMany({
            include: {
                artist: true,
            },
        });
        res.status(201).send({ msg: 'Here are all your albums', data: allAlbums });
    }
    catch (error) {
        res.status(400).send({ msg: 'Error', error });
    }
});
exports.getAllAlbums = getAllAlbums;
const createAlbum = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, artistId } = req.body;
    const thumbnail = (_a = req.files) === null || _a === void 0 ? void 0 : _a.thumbnail;
    if (!name || !thumbnail) {
        return res
            .status(400)
            .send('The fields name, thumbnail and tracks are required');
    }
    try {
        if (Array.isArray(thumbnail)) {
            return res.status(400).send({
                msg: 'You can only upload one file per track.',
            });
        }
        else {
            const resultThumbnail = yield (0, cloudinary_1.uploadImageCloudinary)(thumbnail.tempFilePath); // Subir el archivo único
            const newAlbum = yield prismaClient_1.default.album.create({
                data: {
                    name,
                    thumbnail: resultThumbnail.secure_url,
                    public_id_thumbnail: resultThumbnail.public_id,
                },
            });
            yield fs_extra_1.default.unlink(thumbnail.tempFilePath);
            yield prismaClient_1.default.artistAlbum.create({
                data: {
                    albumId: newAlbum.id,
                    artistId,
                },
            });
            return res.status(201).send({
                msg: 'New album has been created successfully',
                data: newAlbum,
            });
        }
    }
    catch (error) {
        return res.status(400).send(error);
    }
});
exports.createAlbum = createAlbum;
const updateAlbum = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { name, likes } = req.body;
    const thumbnail = (_b = req.files) === null || _b === void 0 ? void 0 : _b.thumbnail;
    const { albumId } = req.params;
    try {
        const updatedAlbum = yield prismaClient_1.default.album.update({
            where: { id: albumId },
            data: {
                name,
                likes,
            },
        });
        if (req.files && thumbnail) {
            //Eliminar la imagen para volverla a subir
            //Elimina
            if (updatedAlbum.public_id_thumbnail) {
                yield (0, cloudinary_1.deleteImageCloudinary)(updatedAlbum.public_id_thumbnail);
            }
            //Sube mismo método que el create
            if (Array.isArray(thumbnail)) {
                return res.status(400).send({
                    msg: 'You can only upload one file per user.',
                });
            }
            else {
                const result = yield (0, cloudinary_1.uploadImageCloudinary)(thumbnail.tempFilePath); // Subir el archivo único
                const newAlbumThumbnail = yield prismaClient_1.default.album.update({
                    where: { id: albumId },
                    data: {
                        thumbnail: result.secure_url,
                        public_id_thumbnail: result.public_id,
                    },
                });
                yield fs_extra_1.default.unlink(thumbnail.tempFilePath);
                return res
                    .status(201)
                    .send({ msg: 'The album has been updated', data: newAlbumThumbnail });
            }
        }
        return res
            .status(201)
            .send({ msg: 'The album has been updated', data: updatedAlbum });
    }
    catch (error) {
        res.status(400).send({ msg: 'ERROR' });
    }
});
exports.updateAlbum = updateAlbum;
const deleteAlbum = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { albumId } = req.params;
    try {
        const albumDeleted = yield prismaClient_1.default.album.delete({ where: { id: albumId } });
        yield (0, cloudinary_1.deleteImageCloudinary)(albumDeleted.public_id_thumbnail);
        res
            .status(201)
            .send({ msg: 'Album has been deleted successfully', data: albumDeleted });
    }
    catch (error) {
        res.status(400).send({ msg: 'ERROR' });
    }
});
exports.deleteAlbum = deleteAlbum;
