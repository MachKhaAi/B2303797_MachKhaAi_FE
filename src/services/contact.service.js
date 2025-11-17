import axios from "axios";

class ContactService {
    constructor(baseURL = "/api/contacts") {
        // Khởi tạo trực tiếp Axios ở đây
        this.api = axios.create({
            baseURL,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
    }

    async getAll() {
        return (await this.api.get("/")).data;
    }

    async create(data) {
        return (await this.api.post("/", data)).data;
    }

    async deleteAll() {
        return (await this.api.delete("/")).data;
    }

    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}

export default new ContactService();