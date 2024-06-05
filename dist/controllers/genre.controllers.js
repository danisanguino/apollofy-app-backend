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
exports.deleteGenre = exports.updateGenre = exports.createGenre = exports.getAllGenres = void 0;
const prismaClient_1 = __importDefault(require("../db/prismaClient"));
const getAllGenres = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allGenres = yield prismaClient_1.default.genre.findMany();
        return res.status(200).send({
            msg: "All genres",
            data: allGenres,
        });
    }
    catch (error) {
        return res.status(400).send(error);
    }
});
exports.getAllGenres = getAllGenres;
const createGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    if (!name) {
        return res.status(400).send("Name is required");
    }
    try {
        const newGenre = yield prismaClient_1.default.genre.create({
            data: {
                name,
            },
        });
        return res.status(201).send({
            msg: "New genre created",
            data: newGenre,
        });
    }
    catch (error) {
        return res.status(400).send(error);
    }
});
exports.createGenre = createGenre;
const updateGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const { genreId } = req.params;
    try {
        const genreUpdated = yield prismaClient_1.default.genre.update({
            where: {
                id: genreId,
            },
            data: {
                name,
            },
        });
        return res.status(200).send({
            msg: "Genre updated",
            data: genreUpdated,
        });
    }
    catch (error) {
        return res.status(400).send(error);
    }
});
exports.updateGenre = updateGenre;
const deleteGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { genreId } = req.params;
    try {
        const genreDeleted = yield prismaClient_1.default.genre.delete({
            where: { id: genreId },
        });
        return res.status(200).send({
            msg: "Genre deleted successfully",
            data: genreDeleted,
        });
    }
    catch (error) {
        return res.status(400).send(error);
    }
});
exports.deleteGenre = deleteGenre;
module.exports = {
    getAllGenres: exports.getAllGenres,
    createGenre: exports.createGenre,
    updateGenre: exports.updateGenre,
    deleteGenre: exports.deleteGenre,
};
