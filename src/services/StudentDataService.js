import http from "../http-common";
class StudentDataService {
    getAll() {
        return http.get("/students");
    }
    get(id) {
        return http.get(`/students/${id}`);
    }
    getStudentsByGrade(grade_id) {
        return http.get(`/students/bygrade/${grade_id}`);
    }
    update(id, data) {
        return http.put(`/students/${id}`, data);
    }
    getByCampaign(campaign_id) {
        return http.get(`/students/campaign/${campaign_id}`);
    }
    getStudentsByTeam(team_id) {
        return http.get(`/students/team/${team_id}`);
    }
}
export default new StudentDataService();