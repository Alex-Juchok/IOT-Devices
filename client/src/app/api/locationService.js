import axios from 'axios';

const API_URL = 'http://localhost:5731/devices/';

export const getDeviceLocation = async () => {
  try {
    const storedAccessToken = localStorage.getItem('accessToken');

    const response = await axios.get(API_URL + 'deviceLocations', {
         headers: {
      Authorization: `Bearer ${storedAccessToken}`, 
      "Content-Type": "application/json",
    }});
    return response.data;
    } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('Ошибка получении локаций устройства');
  }
};

export const createLocation = async (locationName, description, parent_id) => {
  try {   
    const storedAccessToken = localStorage.getItem('accessToken');
    const response = await axios.post(API_URL + 'createLocation', {
      locationName, 
      description, 
      parent_id
    },
    {headers: {
      Authorization: `Bearer ${storedAccessToken}`, 
      "Content-Type": "application/json",
    }});
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('Ошибка создании локаций устройств');
  }
};
