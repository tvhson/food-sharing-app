import axios from 'axios';

const baseUrl = 'http://34.69.53.221:8072/';

const ApiManager = axios.create({
  baseURL: baseUrl,
  responseType: 'json',
  withCredentials: true,
  validateStatus: () => true,
});

export default ApiManager;
