import dotenv from "dotenv";

dotenv.config();

type TConfig = {
  [key: string]: EnviromentConfig;
};

type EnviromentConfig = {
  app: AppConfig;
  db: DBConfig;
  cloudinary: CloudinaryConfig;
};

type AppConfig = {
  PORT: string | number;
};

type DBConfig = {
  URI: string;
};

type CloudinaryConfig = {
  cloudinary_name: string;
  api_key: string;
  api_secret: string;
};

const ENV = process.env.NODE_ENV ?? "development";

const CONFIG: TConfig = {
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
  },
};

export default CONFIG[ENV];
