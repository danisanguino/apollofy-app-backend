import dotenv from "dotenv";

type TConfig = {
  [key: string]: EnviromentConfig;
};

type EnviromentConfig = {
  app: AppConfig;
  db: DBConfig;
};

type AppConfig = {
  PORT: string | number;
};

type DBConfig = {
  URI: string;
};

const ENV = process.env.NODE_ENV ?? "development";

const CONFIG: TConfig = {
  development: {
    app: {
      PORT: process.env.PORT || 4001,
    },
    db: {
      URI: process.env.MONGODB_URI || "mongodb://localhost:27017/apollofydb/",
    },
  },
  production: {
    app: {
      PORT: process.env.PORT || 8081,
    },
    db: {
      URI: process.env.MONGODB_URI || "mongodb://localhost:27017/apollofydb/",
    },
  },
};

export default CONFIG[ENV];
