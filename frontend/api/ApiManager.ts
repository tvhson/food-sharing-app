import axios from 'axios';

const baseUrl = 'http://192.168.1.101:8072/'; // Use '10.0.2.2 for Android emulator
// const baseUrl = 'http://34.9.124.10:8072/';

const ApiManager = axios.create({
  baseURL: baseUrl,
  responseType: 'json',
  withCredentials: true,
  validateStatus: () => true,
});

export default ApiManager;
export {baseUrl};
