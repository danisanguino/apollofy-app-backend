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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
const prismaClient_1 = __importDefault(require("../db/prismaClient"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const cloudinary_1 = require("../utils/cloudinary");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield prismaClient_1.default.user.findMany();
        res.status(201).send({ msg: "Here are all your users", data: allUsers });
    }
    catch (error) {
        res.status(400).send({ msg: "Error", error });
    }
});
exports.getAllUsers = getAllUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, username, role } = req.body;
    console.log({ name, email, password, username, role });
    if (!name || !email || !username) {
        return res
            .status(400)
            .send("The fields name, lastname, email, password and username are required");
    }
    try {
        const newUser = yield prismaClient_1.default.user.create({
            data: {
                username,
                name,
                email,
                password,
                role,
            },
        });
        if (req.files && req.files.img) {
            if (Array.isArray(req.files.img)) {
                return res.status(400).json({
                    msg: "You can only upload one file per user.",
                });
            }
            else {
                const result = yield (0, cloudinary_1.uploadImageCloudinary)(req.files.img.tempFilePath); // Subir el archivo único
                const newUserImg = yield prismaClient_1.default.user.update({
                    where: { id: newUser.id },
                    data: {
                        img: result.secure_url,
                        public_id_img: result.public_id,
                    },
                });
                yield fs_extra_1.default.unlink(req.files.img.tempFilePath);
                return res.status(201).send({
                    msg: "New user created",
                    data: newUserImg,
                });
            }
        }
        return res.status(201).send({
            msg: "New user created",
            data: newUser,
        });
    }
    catch (error) {
        return res.status(400).send(error);
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, username, role, myFavorites } = req.body;
    const { userId } = req.params;
    try {
        const updatedUser = yield prismaClient_1.default.user.update({
            where: { id: userId },
            data: {
                name,
                email,
                password,
                username,
                role,
                myFavorites,
            },
        });
        if (req.files && req.files.img) {
            //Eliminar la imagen para volverla a subir
            //Elimina
            if (updatedUser.public_id_img) {
                yield (0, cloudinary_1.deleteImageCloudinary)(updatedUser.public_id_img);
            }
            //Sube mismo método que el create
            if (Array.isArray(req.files.img)) {
                return res.status(400).json({
                    msg: "You can only upload one file per user.",
                });
            }
            else {
                const result = yield (0, cloudinary_1.uploadImageCloudinary)(req.files.img.tempFilePath); // Subir el archivo único
                const newUserImg = yield prismaClient_1.default.user.update({
                    where: { id: userId },
                    data: {
                        img: result.secure_url,
                        public_id_img: result.public_id,
                    },
                });
                yield fs_extra_1.default.unlink(req.files.img.tempFilePath);
                return res.status(201).send({
                    msg: "New user created",
                    data: newUserImg,
                });
            }
        }
        res
            .status(201)
            .send({ msg: "The user has been updated", data: updatedUser });
    }
    catch (error) {
        res.status(400).send({ msg: "ERROR" });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const userDeleted = yield prismaClient_1.default.user.delete({ where: { id: userId } });
        if (userDeleted.public_id_img) {
            yield (0, cloudinary_1.deleteImageCloudinary)(userDeleted.public_id_img);
        }
        res
            .status(201)
            .send({ msg: "User has been deleted successfully", data: userDeleted });
    }
    catch (error) {
        res.status(400).send({ msg: "ERROR" });
    }
});
exports.deleteUser = deleteUser;
