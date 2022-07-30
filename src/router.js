import { createWebHistory, createRouter } from "vue-router";
const routes =  [
    {
        path: "/",
        alias: "/createTeam",
        name: "create-team",
        component: () => import("./components/CreateTeam")
    },
    {
        path: "/createUser",
        name: "create-user",
        component: () => import("./components/CreateUser")
    },
    {
        path: "/login",
        name: "login",
        component: () => import("./components/LogIn")
    }
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;