import http from "../http-common";
class DonationDataService {
    getAll() {
        return http.get("/donations");
    }
    get(id) {
        return http.get(`/donations/${id}`);
    }
    create(data) {
        return http.post("/donations", data);
    }
    getTotalByCampaign(campaign_id) {
        return http.get(`/donations/totals/${campaign_id}`);
    }
    getCountByCampaign(campaign_id) {
        return http.get(`/donations/count/${campaign_id}`);
    }
    getTotalByTeam(team_id) {
        return http.get(`/donations/teamtotals/${team_id}`);
    }
}
export default new DonationDataService();