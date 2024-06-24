import _axios from 'axios';

const baseURL =
  typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_BASE_URL : process.env.BASE_URL;


const axios = _axios.create({
  baseURL
});

axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (err) {
    return Promise.reject(err);
  }
);

export default axios;
