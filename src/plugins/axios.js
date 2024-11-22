import axios from "axios";

export default defineNuxtPlugin(() => {
  const domain = 'http://localhost:3333/'

  let api = axios.create({
    baseURL: domain,
    headers: {
      common: {
        Authorization: `Bearer`
      }
    }
  });

  api.interceptors.response.use(function (response) {
    return response.data;
  }, function (error) {
    return Promise.reject(error);
  });
  api.interceptors.request.use(function (teste) {
    if (process.client) {
      let key = window.localStorage.getItem('token')
      teste.headers.Authorization = `Bearer ${key}`
    }
    return teste
  })

  return {
    provide: {
      api: api
    }
  }
})
