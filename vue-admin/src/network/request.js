import axios from 'axios'

export function request(config){
    const url3 = "http://localhost:3000"
    // const url3 = 'http://timemeetyou.com:8889/api/private/v1/'
    // const url3 = 'https://www.liulongbin.top:8888/api/private/v1/'
    let configs = {
        baseURL: url3
    };
    const instance=axios.create(configs)

        //拦截器
        //1、请求拦截
        instance.interceptors.request.use(config =>{
            // console.log(config);
            config.headers.Authorization = window.sessionStorage.getItem('token')
            return config
        },err=>{
            console.log(err)    
        })
        // //发送真正的网络请求
        return instance(config)
       

    
}