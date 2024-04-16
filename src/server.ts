import express from 'express';
import userRoutes from './routes/users.routes';

const app = express();

//middlewares
app.use(express.json());

//routes
app.use("/user", userRoutes);

export default app;
