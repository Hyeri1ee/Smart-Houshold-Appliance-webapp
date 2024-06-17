import express from 'express';
import {locationRoutes, locationsRoutes} from "./router/LocationRoute.js";

const app = express();
const port = 6969;

app.use(express.json());

app.use('/energy/1.0/locations', locationsRoutes);
app.use('/energy/1.0/location', locationRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
