import axios from "axios";

// Use environment variable - must be set at build time for Vite
// Production API URL: https://posh-jurnal-backend.vercel.app
let API_URL = import.meta.env.VITE_API_URL || "";

// Normalize API URL - remove trailing slash if present
if (API_URL) {
	API_URL = API_URL.replace(/\/+$/, "");
}

// In production, ensure we have a valid API URL
if (import.meta.env.PROD) {
	if (!API_URL || API_URL.includes("localhost") || API_URL.includes("127.0.0.1")) {
		console.error("VITE_API_URL must be set to a production URL. Current value:", API_URL);
		// Default to production API if not set (for Vercel deployment)
		API_URL = "https://posh-jurnal-backend.vercel.app";
	}
}

// Log in development to help debug
if (import.meta.env.DEV) {
	console.log("API_URL:", API_URL || "Using Vite proxy (http://localhost:5000)");
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
