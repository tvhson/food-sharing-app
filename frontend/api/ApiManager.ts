import axios from 'axios';

const baseUrl = 'http://10.0.2.2:8072/';

const ApiManager = axios.create({
  baseURL: baseUrl,
  responseType: 'json',
  withCredentials: true,
  validateStatus: () => true,
});

export default ApiManager;
export {baseUrl};
