import { createWebHistory, createRouter } from "vue-router";
const routes =  [
    {
        path: "/",
        name: "home",
        component: () => import("./components/MainPage")
    },
    {
        path: "/createTeam",
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
    },
    {
        path: "/profile",
        name: "profile",
        component: () => import("./components/Profile")
    },
    {
        path: "/team/:team_id",
        name: "team",
        component: () => import("./components/TeamPage"),
        params: true
    },
    {
        path: "/donation/team=:team_id",
        name: "teamdonation",
        component: () => import("./components/TeamDonation"),
        params: true
    },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;