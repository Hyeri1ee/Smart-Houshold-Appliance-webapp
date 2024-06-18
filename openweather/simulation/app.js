import express from 'express';
import cors from 'cors';
import {locationRoutes, locationsRoutes} from "./router/LocationRoute.js";

const app = express();
const port = 6969;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));
app.use(express.json());

app.use('/energy/1.0/locations', locationsRoutes);
app.use('/energy/1.0/location', locationRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
