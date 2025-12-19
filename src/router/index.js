import {createRouter, createWebHistory} from 'vue-router';
import {useAuthStore} from '@/stores/auth';
import Login from '@/views/auth/Login.vue';
import Register from '@/views/auth/Register.vue';
import OAuthCallback from '@/views/auth/OAuthCallback.vue';
import Dashboard from '@/views/admin/Dashboard.vue';
import RoomList from "@/views/admin/RoomList.vue";
import CreateRoom from "@/views/admin/CreateRoom.vue";
import FeaturesPage from "@/views/admin/FeaturesPage.vue";
import HomePage from "@/views/admin/HomePage.vue";
import ChatRoom from "@/views/admin/ChatRoom.vue";
import ProductsPage from "@/views/business/ProductsPage.vue";
import CustomerService from "@/views/admin/CustomerService.vue";
import MyOrders from '@/views/business/orders/MyOrders.vue';
const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {requiresGuest: true},
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {requiresGuest: true},
    },
    {
        path: '/products',
        name: 'products',
        component: ProductsPage,
    },
    {
        path: '/auth/callback/:provider',
        name: 'OAuthCallback',
        component: OAuthCallback,
    },
    {
        path: '/dashboard',
        component: Dashboard,
        meta: {requiresAuth: true, requiresAdmin: true},
        children: [
            {path: 'home', component: HomePage, name: 'HomePage', meta: {requiresAuth: true, requiresAdmin: true}},
            {
                path: 'create',
                component: CreateRoom,
                name: 'CreateRoom',
                meta: {requiresAuth: true, requiresAdmin: true}
            },
            {path: 'rooms', component: RoomList, name: 'RoomList', meta: {requiresAuth: true, requiresAdmin: true}},
            {
                path: 'features',
                component: FeaturesPage,
                name: 'FeaturesPage',
                meta: {requiresAuth: true, requiresAdmin: true}
            },
            {
                path: 'customer',
                component: CustomerService,
                name: 'CustomerService',
                meta: {requiresAuth: true, requiresAdmin: true}
            },
        ]
    },
    {
        path: '/',
        redirect: '/products',
    },
    {
        path: '/chat/:id',
        name: 'ChatRoom',
        component: ChatRoom,
        meta: {
            requiresAuth: true,
            requiresAdmin: true
        }
    },
    {
        path: '/orders',
        name: 'Orders',
        component: MyOrders,
        meta: {
            // requiresAuth: true,
        }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    //  等待 authStore 初始化完成
    if (!authStore.isInitialized) {
        await authStore.init()
    }
    // 客户的话
    if (to.meta.requiresAdmin && authStore.user?.type==='client') {
        // 拒绝访问，踢回首页或显示 403 页面
        return next({path: '/'})
    }

    // 需要登录的页面，但没登录
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return next({
            path: '/login',
            query: {redirect: to.fullPath}
        })
    }
    // 管理员已登录，访问登录页 -> dashboard
    if (authStore.isAuthenticated && authStore.user.type!=='client' && to.path === '/login') {
        return next({path: '/dashboard', replace: true})
    }
    next()
})

export default router;
