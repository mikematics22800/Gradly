import axios from 'axios';

const api_key = import.meta.env.VITE_COLLEGE_API_KEY;

const getSchools = async ({name, state, city}) => {
  const query = {};
  if (name) query['school.name'] = name;
  if (state) query['school.state'] = state;
  if (city) query['school.city'] = city;
  if (!name && !state && !city) {
    alert('Please provide a school name or location');
    return;
  }
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




