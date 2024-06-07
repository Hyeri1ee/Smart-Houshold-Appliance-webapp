// app.js

import express from 'express';
import locationRoutes from '../openWeatherSim/router/router.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/', locationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
