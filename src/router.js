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
        component: () => import("./components/CreateTeam"),
        props: { campaign_id: 2 }
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
        path: "/forgot",
        name: "forgot",
        component: () => import("./components/Forgot")
    },
    {
        path: "/reset/:token",
        name: "reset",
        component: () => import("./components/Reset")
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
    {
        path: "/teacher/:id",
        name: "teacher",
        component: () => import("./components/ClassPage"),
        params: true
    },
    {
        path: "/donation/classroom=:teacher_id",
        name: "classdonation",
        component: () => import("./components/ClassDonation"),
        params: true
    },
    {
        path: "/student/:id",
        name: "student",
        component: () => import("./components/StudentPage"),
        params: true
    },
    {
        path: "/donation/student=:student_id",
        name: "studentdonation",
        component: () => import("./components/StudentDonation"),
        params: true
    },
    {
        path: "/editteam/:team_id",
        name: "editteam",
        component: () => import("./components/EditTeam"),
        params: true
    },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const restrictedPages = ['/createTeam', '/profile'];
    const authRequired = restrictedPages.includes(to.path);

    if (authRequired && !localStorage.getItem('user')) {
        router.push({ name: "create-user", query: { redirect:  to.path} });
    }
});
export default router;
