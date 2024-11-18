import axios from 'axios';

const api_key = import.meta.env.VITE_COLLEGE_API_KEY;

const getSchools = async ({state, city}) => {
  try {
    const response = await axios.request({
      method: 'GET',
      url: 'https://api.data.gov/ed/collegescorecard/v1/schools',
      params: {
        api_key,
        per_page: 100,
        'school.state': state,
        'school.city': city,
      }
    })
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export default getSchools;




