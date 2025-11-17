import axios from "axios";

const commonConfig = {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
};

// KHÔNG DÙNG dấu ngoặc nhọn { }
export default (baseURL) => axios.create({
    baseURL,
    ...commonConfig,
});