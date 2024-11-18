import axios from 'axios';

const key = import.meta.env.VITE_RAPIDAPI_KEY;

const options = {
  method: 'GET',
  url: 'https://colleges-and-universities.p.rapidapi.com/getAllSchools',
  headers: {
    'x-rapidapi-key': key,
    'x-rapidapi-host': 'colleges-and-universities.p.rapidapi.com'
  }
};

const getAllSchools = async () => {
  try {
    const response = await axios.request(options)
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const searchSchools = async (query) => {
  try {
    const response = await axios.request({
      method: 'GET',
      url: 'https://colleges-and-universities.p.rapidapi.com/searchAllSchools',
      params: {query: query},
      headers: { 
        'x-rapidapi-key': key,
        'x-rapidapi-host': 'colleges-and-universities.p.rapidapi.com'
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export { getAllSchools, searchSchools };




