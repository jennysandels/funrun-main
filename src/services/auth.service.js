import http from "../http-common";
import TokenService from "./token.service";

class AuthService {
    login(user) {
        return http
            .post( '/auth/signin', {
                email: user.email,
                password: user.password
            })
            .then(response => {
                if (response.data.accessToken) {
                    TokenService.setUser(response.data);
                }
                return response.data;
            });
    }
    logout() {
        TokenService.removeUser();
    }
    register(user) {
        return http.post('/auth/signup', {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password
        });
    }
}
export default new AuthService();