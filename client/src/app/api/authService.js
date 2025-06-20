import axios from 'axios';

const API_URL = 'http://localhost:5731/auth/';

export const signup = async (username, email, password) => {
  try {   
    const response = await axios.post(API_URL + 'register', {
      username,
      email,
      password
    });
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('Ошибка регистрации пользователя');
  }
};


export const signin = async (email, password) => {
  try {   
    const response = await axios.post(API_URL + 'login', {
      email,
      password
    });
    return response.data; 
  }catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('Ошибка авторизации пользователя');
  }
};


export const logout = async () => {
  try {
    const storedAccessToken = localStorage.getItem('accessToken');
    const response = await axios.post(API_URL + 'logout', null, {
        headers: {
            Authorization: `Bearer ${storedAccessToken}`,
        },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при выходе из аккаунта:', error);
    throw new Error('Ошибка выхода аккаунта');
  }
};

