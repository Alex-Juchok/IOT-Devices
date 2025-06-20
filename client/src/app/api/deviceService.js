import axios from 'axios';

const API_URL = 'http://localhost:5731/devices/';

export const deleteDevice = async (device_id) => {
  try {
    const storedAccessToken = localStorage.getItem('accessToken');

    const response = await axios.delete(API_URL + 'delete-device', {
      data: { device_id },
        headers: {
          Authorization: `Bearer ${storedAccessToken}`, 
          "Content-Type": "application/json",
    }});
    return response.data;
    } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('Ошибка при удалении устройства');
  }
};

export const toggleDevice = async (device_id) => {
  try {   
    const storedAccessToken = localStorage.getItem('accessToken');
    const response = await axios.put(API_URL + 'toggle-device', {
      device_id
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
    throw new Error('Ошибка изменении статуса устройства');
  }
};

export const createDevice = async ( device_name, device_type, location_id) => {
  try {   
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedAccessToken = localStorage.getItem('accessToken');
    
    const response = await axios.post(API_URL + 'create-device', {
       user_id: storedUser ? storedUser.id : undefined,
       device_name, 
       device_type, 
       location_id
    },
    {headers: {
      Authorization: `Bearer ${storedAccessToken}`, 
      "Content-Type": "application/json",
    }});
    return response.data; 
  } catch (error) {
    console.error('Ошибка при создании устройства:', error);
    throw new Error('Ошибка создания устроиства');
  }
};

export const updateDevice = async (device_id, device_name, device_type, location_id, status, user_permissions = []) => {
  try {   
    const storedAccessToken = localStorage.getItem('accessToken');
    const response = await axios.put(API_URL + 'update-device', {
        device_id, 
        device_name, 
        device_type, 
        location_id, 
        status, 
        user_permissions
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
    throw new Error('Ошибка при обновлении данных устройства');
  }
};

export const getDeviceTypes = async () => {
  try {
    const storedAccessToken = localStorage.getItem('accessToken');

    const response = await axios.get(API_URL + 'deviceTypes', {
         headers: {
      Authorization: `Bearer ${storedAccessToken}`, 
      "Content-Type": "application/json",
    }});
    return response.data;
    } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('Ошибка получении типов устройства');
  }
};