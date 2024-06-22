//retrieve washingMachineId and programs only once at the beginning of the session
import { createContext } from 'react';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
    const [washingMachineId, setwashingMachineId] = useState('');
    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        if (!washingMachineId) {
            const fetchData = async () => {
                try {
                    const accessToken = window.sessionStorage.getItem('homeconnect_simulator_auth_token');
                    const response = await fetch(`https://simulator.home-connect.com/api/homeappliances`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `${accessToken}`,
                            'Content-Type': 'application/json',
                            'Accept': 'application/vnd.bsh.sdk.v1+json',
                        }
                    });

                    if (response.status === 200) {
                        const data = await response.json();
                        const washer = data.data.homeappliances.find(appliance => appliance.name === "Washer Simulator");

                        if (!programs) {
                            setwashingMachineId(washer.haId);

                            const programsResponse = await fetch(`https://simulator.home-connect.com/api/homeappliances/${washer.haId}/programs/available`, {
                                method: 'GET',
                                headers: {
                                    'Authorization': `${accessToken}`,
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/vnd.bsh.sdk.v1+json',
                                }
                            });

                            if (programsResponse.status === 200) {
                                const programsData = await programsResponse.json();
                                const programKeys = programsData.data.programs.map(program => program.key);

                                const tempPrograms = [];

                                for (let programKey of programKeys) {
                                    const programResponse = await fetch(`https://simulator.home-connect.com/api/homeappliances/${washer.haId}/programs/available/${programKey}`, {
                                        method: 'GET',
                                        headers: {
                                            'Authorization': `${accessToken}`,
                                            'Content-Type': 'application/json',
                                            'Accept': 'application/vnd.bsh.sdk.v1+json',
                                        }
                                    });

                                    if (programResponse.status === 200) {
                                        const programData = await programResponse.json();
                                        const options = programData.data.options.map(option => ({
                                            optionKey: option.key,
                                            allowedValues: option.constraints.allowedvalues
                                        }));

                                        tempPrograms.push({
                                            programKey,
                                            options
                                        });
                                    } else {
                                        console.log(`Error retrieving details for program ${programKey}`);
                                    }
                                }

                                setPrograms(tempPrograms);
                            } else {
                                console.log("Error retrieving program keys");
                            }
                        } else {
                            console.log("Programs already present");
                        }
                    } else {
                        console.log("There was an error retrieving the HA ID");
                    }
                } catch (error) {
                    console.error("Error retrieving data:", error);
                }
            };

            fetchData();
        }
    }, [washingMachineId, programs]);

    return (
        <GlobalStateContext.Provider value={{ washingMachineId, setwashingMachineId, programs, setPrograms }}>
            {children}
        </GlobalStateContext.Provider>
    );
};

GlobalStateProvider.propTypes = {
    children: PropTypes.node.isRequired,
};