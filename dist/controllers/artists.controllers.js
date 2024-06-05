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
exports.deleteArtist = exports.updateArtist = exports.createArtist = exports.getAllArtists = void 0;
const prismaClient_1 = __importDefault(require("../db/prismaClient"));
const cloudinary_1 = require("../utils/cloudinary");
const fs_extra_1 = __importDefault(require("fs-extra"));
const getAllArtists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allArtists = yield prismaClient_1.default.artist.findMany({
            include: {
                tracks: true,
                albums: true,
            },
        });
        res
            .status(201)
            .send({ msg: 'Here are all your artists', data: allArtists });
    }
    catch (error) {
        res.status(400).send({ msg: 'Error', error });
    }
});
exports.getAllArtists = getAllArtists;
const createArtist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name } = req.body;
    const img = (_a = req.files) === null || _a === void 0 ? void 0 : _a.img;
    if (!name || !img) {
        return res.status(400).send('The fields name and img are required');
    }
    try {
        if (Array.isArray(img)) {
            return res.status(400).json({
                msg: 'You can only upload one file per artist.',
            });
        }
        else {
            const result = yield (0, cloudinary_1.uploadImageCloudinary)(img.tempFilePath); // Subir el archivo único
            const newArtist = yield prismaClient_1.default.artist.create({
                data: {
                    name,
                    img: result.secure_url,
                    public_id_img: result.public_id,
                },
            });
            yield fs_extra_1.default.unlink(img.tempFilePath);
            return res.status(201).send({
                msg: 'New artist created',
                data: newArtist,
            });
        }
    }
    catch (error) {
        return res.status(400).send(error);
    }
});
exports.createArtist = createArtist;
const updateArtist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { name, followers } = req.body;
    const img = (_b = req.files) === null || _b === void 0 ? void 0 : _b.img;
    const { artistId } = req.params;
    try {
        const updatedArtist = yield prismaClient_1.default.artist.update({
            where: { id: artistId },
            data: {
                name,
                followers,
            },
        });
        if (req.files && img) {
            //Eliminar la imagen para volverla a subir
            //Elimina
            if (updatedArtist.public_id_img) {
                yield (0, cloudinary_1.deleteImageCloudinary)(updatedArtist.public_id_img);
            }
            //Sube mismo método que el create
            if (Array.isArray(img)) {
                return res.status(400).json({
                    msg: 'You can only upload one file per artist.',
                });
            }
            else {
                const result = yield (0, cloudinary_1.uploadImageCloudinary)(img.tempFilePath); // Subir el archivo único
                const newArtistImg = yield prismaClient_1.default.artist.update({
                    where: { id: artistId },
                    data: {
                        img: result.secure_url,
                        public_id_img: result.public_id,
                    },
                });
                yield fs_extra_1.default.unlink(img.tempFilePath);
                return res.status(201).send({
                    msg: 'New artist created',
                    data: newArtistImg,
                });
            }
        }
        res
            .status(201)
            .send({ msg: 'The artist has been updated', data: updatedArtist });
    }
    catch (error) {
        res.status(400).send({ msg: 'ERROR' });
    }
});
exports.updateArtist = updateArtist;
const deleteArtist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { artistId } = req.params;
    try {
        const artistDeleted = yield prismaClient_1.default.artist.delete({
            where: { id: artistId },
        });
        if (artistDeleted.public_id_img) {
            yield (0, cloudinary_1.deleteImageCloudinary)(artistDeleted.public_id_img);
        }
        res.status(201).send({
            msg: 'Artist has been deleted successfully',
            data: artistDeleted,
        });
    }
    catch (error) {
        res.status(400).send({ msg: 'ERROR' });
    }
});
exports.deleteArtist = deleteArtist;
