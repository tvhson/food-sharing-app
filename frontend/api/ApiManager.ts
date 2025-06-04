import axios from 'axios';

// const baseUrl = 'http://10.0.2.2:8072/'; // Use '10.0.2.2 for Android emulator
const baseUrl = 'http://34.84.68.47:8072/';

const ApiManager = axios.create({
  baseURL: baseUrl,
  responseType: 'json',
  withCredentials: true,
  validateStatus: () => true,
});

export default ApiManager;
export {baseUrl};
