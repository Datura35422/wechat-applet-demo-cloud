import Login from '@/views/login/index'
import Home from '@/views/home/index'

const main = [
    {
        path: '/login',
        name: '登录',
        component: Login
    },
    {
        path: '/',
        exact: true,
        name: '首页',
        component: Home
    }
]

// 菜单相关路由
const menus = []

export const routerConfig = {
    main,
    menus
}
