import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "http://13.210.0.69:8080"
    : process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: baseURL.replace(/\/$/, ""),
  withCredentials: false,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (res) => {
    if (typeof res.data === "string" && /^\s*</.test(res.data)) {
      const err = new Error("Server returned HTML instead of JSON.");
      err.__raw = res.data;
      throw err;
    }
    return res;
  },
  (err) => Promise.reject(err)
);

export default api;
