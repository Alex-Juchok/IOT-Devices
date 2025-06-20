import axios from 'axios';

const API_URL = 'http://localhost:5731/events/';

export const getEventHistory = async (startDate, endDate) => {
  try {   
    const storedAccessToken = localStorage.getItem('accessToken');

      const response = await axios.get(API_URL+'archiveEvents', {
        params: {
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
        },
        headers: {
            Authorization: `Bearer ${storedAccessToken}`,
        },
      });
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('Ошибка получении архивных данных');
  }
};

      