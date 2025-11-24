import {createRouter, createWebHistory} from 'vue-router';
import {useAuthStore} from '@/stores/auth';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import OAuthCallback from '@/views/OAuthCallback.vue';
import Dashboard from '@/views/Dashboard.vue';
import RoomList from "@/views/RoomList.vue";
import CreateRoom from "@/views/CreateRoom.vue";
import EditorRoom from "@/views/EditorRoom.vue";
import FeaturesPage from "@/views/FeaturesPage.vue";
import HomePage from "@/views/HomePage.vue";
import ChatRoom from "@/views/ChatRoom.vue";
import BoardRoom from "@/views/BoardRoom.vue";

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
        ]
    },
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/editor/:id',
        name: 'EditorRoom',
        component: EditorRoom,
        meta: {requiresAuth: true}
    },
    {
        path: '/chat/:id',
        name: 'ChatRoom',
        component: ChatRoom,
        meta: {requiresAuth: true}
    },
    {
        path: '/whiteboard/:id',
        name: 'BoardRoom',
        component: BoardRoom,
        meta: {requiresAuth: true}
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login');
    } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
        next('/dashboard');
    } else {
        next();
    }
});

export default router;
