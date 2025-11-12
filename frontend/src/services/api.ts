import axios from "axios";
import type { Category, Post, User, Settings, AuthResponse } from "../types";

const API_BASE_URL = "http://localhost:3001";

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("authToken");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem("authToken");
			localStorage.removeItem("user");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	},
);

export const authAPI = {
	login: async (credentials: {
		email: string;
		password: string;
	}): Promise<AuthResponse> => {
		const response = await api.post("/login", credentials);
		return response.data;
	},
};

export const postsAPI = {
	getAll: () => api.get("/posts?_sort=createdAt&_order=desc"),
	getById: (id: number) => api.get(`/posts/${id}`),
	create: (post: Omit<Post, "id">) => api.post("/posts", post),
	update: (id: number, post: Partial<Post>) => api.patch(`/posts/${id}`, post),
	delete: (id: number) => api.delete(`/posts/${id}`),
};

export const categoriesAPI = {
	getAll: () => api.get("/categories"),
	create: (category: Omit<Category, "id">) => api.post("/categories", category),
	update: (id: number, category: Partial<Category>) =>
		api.patch(`/categories/${id}`, category),
	delete: (id: number) => api.delete(`/categories/${id}`),
};

export const mediaAPI = {
	getAll: () => api.get("/media?_sort=uploadedAt&_order=desc"),
	upload: (formData: FormData) =>
		api.post("/upload", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		}),
	delete: (id: number) => api.delete(`/media/${id}`),
};

export const usersAPI = {
	getAll: () => api.get("/users"),
	getById: (id: number) => api.get(`/users/${id}`),
	create: (user: Omit<User, "id">) => api.post("/users", user),
	update: (id: number, user: Partial<User>) => api.patch(`/users/${id}`, user),
	delete: (id: number) => api.delete(`/users/${id}`),
};

export const settingsAPI = {
	get: () => api.get("/settings/1"),
	update: (settings: Partial<Settings>) => api.patch("/settings/1", settings),
};

export default api;
