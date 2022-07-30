import http from "../http-common";
class PrizesDataService {
    getAll() {
        return http.get("/prizes");
    }
    get(id) {
        return http.get(`/prizes/${id}`);
    }
    create(data) {
        return http.post("/prizes", data);
    }
    update(id, data) {
        return http.put(`/prizes/${id}`, data);
    }
    delete(id) {
        return http.delete(`/prizes/${id}`);
    }
    deleteAll() {
        return http.delete(`/prizes`);
    }
    getByCampaignId(campaign_id) {
        return http.get(`/prizes/campaign/${campaign_id}`);
    }
}
export default new PrizesDataService();