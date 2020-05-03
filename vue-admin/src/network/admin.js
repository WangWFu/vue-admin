import {request} from './request'


export function getadmin(name,password) {
    return request({
        url:'/getadmin',
        prams:{
            name,
            password
        }
    })
}