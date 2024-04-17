import express from "express";
import userRoutes from "./routes/user.routes";
import trackRoutes from "./routes/track.routes";

const app = express();

//middlewares
app.use(express.json());

//routes
app.use("/user", userRoutes);
app.use("/track", trackRoutes);

export default app;
