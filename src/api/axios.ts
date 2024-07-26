import _axios from 'axios';

const baseURL =
  typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_BASE_URL : process.env.BASE_URL;

const axios = _axios.create({
  baseURL,
  headers: {
    'x-custom-lang': 'en'
  }
});

axios.interceptors.request.use(
  function (config) {
    const locale = typeof window !== 'undefined' ? window.localStorage.getItem('locale') : 'fr';
    config.headers['x-custom-lang'] = locale;
    return config;
  },
  function (err) {
    return Promise.reject(err);
  }
);

export default axios;
