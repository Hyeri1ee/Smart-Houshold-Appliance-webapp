import fs from 'fs';

const readJson = (path, cb) => {
    fs.readFile(path, (err, data) => {
        if (err)
            cb(err);
        else
            cb(null, JSON.parse(data));
    });
};

let createLocationReq, createLocationRes, getAllLocationsRes, getLocationRes, getLocationDataRes, getIntervalDataRes, createPanelReq, createPanelRes, getAllPanelsRes, getPanelRes;

// Read JSON files
readJson('./jsonRes/create_location.json', (err, data) => {
    if (err) {
        console.error('Error reading create_location.json:', err);
    } else {
        createLocationReq = data;
    }
});
readJson('./jsonRes/create_location_response.json', (err, data) => {
    if (err) {
        console.error('Error reading create_location_response.json:', err);
    } else {
        createLocationRes = data;
    }
});

readJson('./jsonRes/get_all_locations_response.json', (err, data) => {
    if (err) {
        console.error('Error reading get_all_locations_response.json:', err);
    } else {
        getAllLocationsRes = data;
    }
});

readJson('./jsonRes/get_location_response.json', (err, data) => {
    if (err) {
        console.error('Error reading get_location_response.json:', err);
    } else {
        getLocationRes = data;
    }
});

readJson('./jsonRes/get_location_data_response.json', (err, data) => {
    if (err) {
        console.error('Error reading get_location_data_response.json:', err);
    } else {
        getLocationDataRes = data;
    }
});

readJson('./jsonRes/get_interval_data_response.json', (err, data) => {
    if (err) {
        console.error('Error reading get_interval_data_response.json:', err);
    } else {
        getIntervalDataRes = data;
    }
});

readJson('./jsonRes/create_panel.json', (err, data) => {
    if (err) {
        console.error('Error reading create_panel.json:', err);
    } else {
        createPanelReq = data;
    }
});

readJson('./jsonRes/create_panel_response.json', (err, data) => {
    if (err) {
        console.error('Error reading create_panel_response.json:', err);
    } else {
        createPanelRes = data;
    }
});

readJson('./jsonRes/get_all_panels_response.json', (err, data) => {
    if (err) {
        console.error('Error reading get_all_panels_response.json:', err);
    } else {
        getAllPanelsRes = data;
    }
});

readJson('./jsonRes/get_panel_response.json', (err, data) => {
    if (err) {
        console.error('Error reading get_panel_response.json:', err);
    } else {
        getPanelRes = data;
    }
});



export const getLocationById = (req, res) => {

    res.status(200).json(getLocationRes);
};

export const getAllLocations = (req, res) => {
    // Send the pre-assembled JSON response
    res.status(200).json(getAllLocationsRes);
};

export const deleteLocationById = (req, res) => {

    res.status(204).send();
};



export const getPanelById = (req, res) => {

    res.status(200).json(getPanelRes);
};

export const getPanelsByLocation = (req, res) => {

    res.status(200).json(getAllPanelsRes);
};

export const deletePanelById = (req, res) => {

    res.status(204).send();
};

const simulateData = (locationId, date, tz) => {
    return getLocationDataRes;
};

export const getData = (req, res) => {


    res.status(200).json(   getLocationDataRes);
};

export const getIntervalData = (req, res) => {

    res.status(200).json(getIntervalDataRes);
};



