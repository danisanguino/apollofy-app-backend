import express from 'express';

const app = express();

//middlewares
app.use(express.json());

//routes

export default app;
