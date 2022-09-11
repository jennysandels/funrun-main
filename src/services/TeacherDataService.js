import http from "../http-common";
class TeacherDataService {
    getAll() {
        return http.get("/teachers");
    }
    get(id) {
        return http.get(`/teachers/${id}`);
    }
    getByCampaignId(campaign_id) {
        return http.get(`/teachers/campaign/${campaign_id}`);
    }
}
export default new TeacherDataService();