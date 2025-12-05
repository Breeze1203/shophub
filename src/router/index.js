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
        meta: {requiresAuth: true},
        children: [
            {path: 'home', component: HomePage, name: 'HomePage', meta: {requiresAuth: true}},
            {path: 'create', component: CreateRoom, name: 'CreateRoom', meta: {requiresAuth: true}},
            {path: 'rooms', component: RoomList, name: 'RoomList', meta: {requiresAuth: true}},
            {path: 'features', component: FeaturesPage, name: 'FeaturesPage', meta: {requiresAuth: true}},
            {path: 'customer', component: CustomerService, name: 'CustomerService', meta: {requiresAuth: true}},
        ]
    },
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/chat/:id',
        name: 'ChatRoom',
        component: ChatRoom,
        meta: {requiresAuth: true}
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    // 等待 authStore 初始化完成
    if (!authStore.isInitialized) {
        await authStore.init()
    }

    // 需要登录的页面，但没登录 → 去登录（并带上想去哪）
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return next({
            path: '/login',
            query: { redirect: to.fullPath }  // 登录后能回来
        })
    }

    //  管理员已登录，还想访问登录页 → 直接跳后台（用 replace 防止死循环）
    if (authStore.isAuthenticated && authStore.isAdmin && to.path === '/login') {
        return next({ path: '/dashboard', replace: true })
    }

    // 普通已登录用户访问登录页 → 跳首页
    if (authStore.isAuthenticated && to.path === '/login') {
        return next({ path: '/', replace: true })
    }
    // 其他情况全部放行
    next()
})

export default router;
