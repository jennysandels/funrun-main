import http from "../http-common";
class PaymentDataService {
    async create(data) {
        return http.post("/payment", data);
    }
}
export default new PaymentDataService();