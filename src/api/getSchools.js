import axios from 'axios';

const api_key = import.meta.env.VITE_COLLEGE_API_KEY;

const getSchools = async ({state, city}) => {
  const query = city ? { 'school.state': state, 'school.city': city } : { 'school.state': state };
  try {
    const response = await axios.request({
      method: 'GET',
      url: 'https://api.data.gov/ed/collegescorecard/v1/schools',
      params: {
        api_key,
        per_page: 100,
        ...query
      }
    })
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export default getSchools;




