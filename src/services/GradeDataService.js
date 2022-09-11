import http from "../http-common";
class GradeDataService {
    getAll() {
        return http.get("/grades");
    }
    get(id) {
        return http.get(`/grades/${id}`);
    }
}
export default new GradeDataService();