import axios from 'axios';

const searchSchools = async (query) => {
  try {
    const response = await axios.request({
      method: 'GET',
      url: 'https://colleges-and-universities.p.rapidapi.com/searchAllSchools',
      params: {query: query},
      headers: { 
        'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
        'x-rapidapi-host': 'colleges-and-universities.p.rapidapi.com'
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export default searchSchools;
