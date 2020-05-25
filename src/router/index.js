import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'      //这个位置的索引指向第一个打开的页面，这个标志的索引一定要有，否则会白屏！！！
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {   //首页
                    path: '/index',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/index.vue'),
                    meta: { title: '首页' }
                },
                {   //员工管理
                    path: '/manager_employee',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/manager_employee.vue'),
                    meta: { title: '员工管理' }
                },
                {   //设备管理
                    path: '/manager_equipment',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/manager_equipment.vue'),
                    meta: { title: '设备管理' }
                },
                {
                    // 调度管理
                    path: '/manager_dispatch',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/manager_dispatch'),
                    meta: { title: '调度管理' }
                },
                {
                    // 产品管理
                    path: '/manager_product',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/manager_product.vue'),
                    meta: { title: '产品管理' }
                },
                {
                    // 订单管理
                    path: '/manager_order',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/manager_order.vue'),
                    meta: { title: '订单管理' }
                },
                {
                    // 计划管理
                    path: '/manager_plan',
                    component: () => import(/* webpackChunkName: "drag" */ '../components/page/manager_plan.vue'),
                    meta: { title: '计划管理' }
                },
                {
                    // 管理跟踪
                    path: '/manager_track',
                    component: () => import(/* webpackChunkName: "drag" */ '../components/page/manager_track.vue'),
                    meta: { title: '追踪管理' }
                },
                {
                    // 报工
                    path: '/report',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/working.vue'),
                    meta: { title: '报工' }
                },
                {
                    // 关于我们
                    path: '/about_us',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/about_us.vue'),
                    meta: { title: '关于我们' }
                },
                {
                    path: '/notification',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/notification.vue'),
                    meta: { title: '通知' }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/404.vue'),
                    meta: { title: '404error' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '/register',
            component: () => import(/* webpackChunkName: "register" */ '../components/page/register.vue'),
            meta: { title: '注册' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
