"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ENV = (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : "development";
const CONFIG = {
    development: {
        app: {
            PORT: process.env.PORT || 4001,
        },
        db: {
            URI: process.env.DATABASE_URL || "mongodb://localhost:27017/apollofydb/",
        },
        cloudinary: {
            cloudinary_name: process.env.CLOUDINARY_NAME || "error",
            api_key: process.env.CLOUDINARY_API_KEY || "error",
            api_secret: process.env.CLOUDINARY_API_SECRET || "error",
        },
        auth0: {
            client_origin: process.env.APP_ORIGIN || "error",
            audience: process.env.AUTH0_AUDIENCE || "error",
            issuer: process.env.AUTH0_ISSUER || "error"
        }
    },
    production: {
        app: {
            PORT: process.env.PORT || 8081,
        },
        db: {
            URI: process.env.DATABASE_URL || "mongodb://localhost:27017/apollofydb/",
        },
        cloudinary: {
            cloudinary_name: process.env.CLOUDINARY_NAME || "error",
            api_key: process.env.CLOUDINARY_API_KEY || "error",
            api_secret: process.env.CLOUDINARY_API_SECRET || "error",
        },
        auth0: {
            client_origin: process.env.APP_ORIGIN || "error",
            audience: process.env.AUTH0_AUDIENCE || "error",
            issuer: process.env.AUTH0_ISSUER || "error"
        }
    },
};
exports.default = CONFIG[ENV];
