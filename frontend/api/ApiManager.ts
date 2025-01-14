import axios from 'axios';

const baseUrl = 'http://34.72.170.101:8072/';

const ApiManager = axios.create({
  baseURL: baseUrl,
  responseType: 'json',
  withCredentials: true,
  validateStatus: () => true,
});

export default ApiManager;
export {baseUrl};
