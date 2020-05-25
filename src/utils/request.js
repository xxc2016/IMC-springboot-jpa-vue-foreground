import axios from 'axios';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    baseURL: 'http://212.64.94.186:8080',
    timeout: 5000
});

const serviceJson = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    baseURL: 'http://212.64.94.186:8080',
    headers:{
        'Content-type':'application/json'
    },
    timeout: 5000
});

const serviceFormData = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    baseURL: 'http://212.64.94.186:8080',
    headers:{
        'Content-type':'multipart/form-data'
    },
    timeout: 5000
});



service.defaults.withCredentials=true;      //允许携带session和cookies信息

service.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);




export default service;
