
import axios from 'axios';


// axios 配置
axios.defaults.timeout = 10000;
// axios.defaults.baseURL = `${process.env.API_HOST}`;
// history.go(0);
// http request 拦截器);
axios.interceptors.request.use(
    (config) => {
      const newConfig = config;
      newConfig.headers['Content-Type'] = 'application/json';
      newConfig.headers.Accept = 'application/json';      
      return newConfig;
    },
    (err) => {
      const error = err;
      return Promise.reject(error);
    });
// http response 拦截器
axios.interceptors.response.use(
  (response) => {
    if (response.status === 204) {
      return Promise.resolve(response);
    }
    // continue sending response to the then() method
    return Promise.resolve(response.data);
  },
  (error) => {
    const response = error.response;
    if (response) {
      const status = response.status;
      switch (status) {
        // check if unauthorized error returned
        // case 401: {
        //   HAP.removeAccessToken();
        //   window.location = `${HAP.AUTH_URL}`;
        //   break;
        // }
        // case 403: {
        //   const errorData = response.data;
        //   const content = errorData.error_description || errorData.error || HAP.getMessage('未知错误', 'unknown error');
        //   HAP.prompt('error', content);
        //   break;
        // }
        // case 404: {
        //   HAP.prompt('error', 'Not Found');
        //   break;
        // }
        // case 500: {
        //   HAP.prompt('error', HAP.getMessage('服务器内部错误', 'Server Internal Error'));
        //   break;
        // }
        // default:
        //   break;
      }
    }
    // request is rejected and will direct logic to the catch() method
    return Promise.reject(error);
  });
export default axios;
