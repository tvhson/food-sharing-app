import axios from 'axios';

const baseUrl = 'http://34.123.41.183:8072/';

const ApiManager = axios.create({
  baseURL: baseUrl,
  responseType: 'json',
  withCredentials: true,
  validateStatus: () => true,
});

export default ApiManager;
export {baseUrl};
