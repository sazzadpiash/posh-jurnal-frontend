import axios from "axios";

// Use environment variable - must be set at build time for Vite
// Never use localhost in production to avoid browser security prompts
let API_URL = import.meta.env.VITE_API_URL || "";

// Ensure we never use localhost in production
if (import.meta.env.PROD && (!API_URL || API_URL.includes("localhost") || API_URL.includes("127.0.0.1"))) {
	console.error("VITE_API_URL must be set to a production URL. Current value:", API_URL);
	API_URL = ""; // Use relative URLs as fallback
}

// Log in development to help debug
if (import.meta.env.DEV) {
	console.log("API_URL:", API_URL || "http://localhost:5000 (fallback)");
}

const api = axios.create({
	baseURL: API_URL,
	withCredentials: true, // Important for cookies
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor
api.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor
api.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		// Don't redirect on 401 errors - let AuthContext and router handle authentication state
		// Redirecting here causes infinite loops during initial auth checks
		return Promise.reject(error);
	}
);

export default api;
