import Vue from 'vue'
import Router from 'vue-router'
import VueRouter from 'vue-router'

// const articlelist = () => import('@/view/articleList/articleList')
// const articlecreate = () => import('@/view/articleList/articleCreate')
const login = () => import('@/view/login/login')
const home = () => import('@/view/home/home')
const user =()=>import('@/view/user/user')
const rights =()=>import('@/view/Rights/right')
const roles =()=>import('@/view/Rights/Roles')
Vue.use(Router)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: home,
    children: [
      {
        path: '/users',
        component: user,
    
      },
      {
        path: '/rights',
        component: rights
      },
      {
        path: '/roles',
        component: roles
      }
    ]
  },

]
const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to ,from, next)=>{
    //to 代表要去的路径
    //from 代表从哪个路径跳转来的
    //next()  放行  next('/login') 强制跳转到
    if(to.path === '/login') return next();
    //获取token
    const token = window.sessionStorage.getItem('token');
    if(!token){
      return next('/login')
    } else{
      next()
    }
})
export default router