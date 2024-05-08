import axios from 'axios';

const baseUrl = 'http://192.168.123.94:8080/';

const ApiManager = axios.create({
  baseURL: baseUrl,
  responseType: 'json',
  withCredentials: true,
  validateStatus: () => true,
});

export default ApiManager;
