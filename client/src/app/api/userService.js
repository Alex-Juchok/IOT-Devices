import axios from 'axios';

const API_URL = 'http://localhost:5731/user/';

export const getUsersDevices = async () => {
  try {
    const storedAccessToken = localStorage.getItem('accessToken');
    const response = await axios.get(API_URL + 'devices', {
        headers: {
            Authorization: `Bearer ${storedAccessToken}`,
        },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении устроиств:', error);
    throw new Error('Ошибка получении устройств');
  }
};

export const createUser = async (username, email, password, role) => {
  try {   
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedAccessToken = localStorage.getItem('accessToken');
    
    const response = await axios.post(API_URL + 'create-user', {
      creator_id: storedUser ? storedUser.id : undefined,
      username,
      email,
      password,
      role
    },
    {headers: {
      Authorization: `Bearer ${storedAccessToken}`, 
      "Content-Type": "application/json",
    }});
    return response.data; 
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    throw new Error('Ошибка создании пользователя');
  }
};

export const updateUser = async (user_id, username, email,  password, role ) => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedAccessToken = localStorage.getItem('accessToken');

    const response = await axios.put(API_URL + 'update-user', { 
        creator_id: storedUser ? storedUser.id : undefined,
        user_id,
        username,
        email, 
        password,
        role },
        {headers: {
      Authorization: `Bearer ${storedAccessToken}`, 
      "Content-Type": "application/json",
    }});
    return response.data; 
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    throw new Error('Ошибка обновления пользователя');
  }
};

export const updateUserData = async (user_id, username, email,  password = '', role ) => {
  try {
    const storedAccessToken = localStorage.getItem('accessToken');

    const response = await axios.put(API_URL + 'update-user-data', { 
        user_id,
        username,
        email, 
        password,
        role 
        },  
         {headers: {
      Authorization: `Bearer ${storedAccessToken}`, 
      "Content-Type": "application/json",
    }});
    return response.data; 
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    throw new Error('Ошибка обновления пользователя');
  }
};

export const deleteUser = async (user_id, username) => {
  try {
    const storedAccessToken = localStorage.getItem('accessToken');

    const response = await axios.delete(API_URL + 'delete-user', {
      data: { user_id, username },
      headers: {
        Authorization: `Bearer ${storedAccessToken}`,
        "Content-Type": "application/json",
      }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    throw new Error('Ошибка удалении пользователя');
  }
};


export const getAllUsers = async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedAccessToken = localStorage.getItem('accessToken');

    const response = await axios.get(API_URL + `get-all-users/${storedUser ? storedUser.id : undefined}`, {
         headers: {
      Authorization: `Bearer ${storedAccessToken}`, 
      "Content-Type": "application/json",
    }});
    return response.data;
  } catch (error) {
  if (axios.isAxiosError(error)) {
    throw error;
  }
  throw new Error('Ошибка получении пользователей');
}
};

export const getUserData = async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedAccessToken = localStorage.getItem('accessToken');

    const response = await axios.get(API_URL + `get-user-data/${storedUser ? storedUser.id : undefined}`, {
         headers: {
      Authorization: `Bearer ${storedAccessToken}`, 
      "Content-Type": "application/json",
    }});
    return response.data;
  } catch (error) {
  if (axios.isAxiosError(error)) {
    throw error;
  }
  throw new Error('Ошибка получении пользователей');
}
};