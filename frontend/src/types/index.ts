export interface User {
	id: number;
	name: string;
	email: string;
	password?: string;
	role: "admin" | "editor" | "author";
	createdAt: string;
	updatedAt: string;
	lastLogin?: string;
}

export interface Post {
	id: number;
	title: string;
	slug: string;
	content: string;
	excerpt: string;
	status: "draft" | "published" | "archived";
	authorId: number;
	author?: User;
	category: string;
	tags: string[];
	featuredImage?: string;
	createdAt: string;
	updatedAt: string;
	publishedAt?: string;
}

export interface Category {
	id: number;
	name: string;
	slug: string;
	description: string;
	color?: string;
	postCount?: number;
}

export interface Media {
	id: number;
	filename: string;
	url: string;
	type: string;
	size: number;
	uploadedBy: number;
	uploadedByUser?: User;
	uploadedAt: string;
}

export interface Settings {
	id: number;
	siteName: string;
	siteDescription: string;
	siteUrl: string;
	adminEmail: string;
	postsPerPage: number;
	timezone: string;
	dateFormat: string;
	language: string;
	maintenanceMode: boolean;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface AuthResponse {
	user: User;
	token: string;
}

export interface AuthContextType {
	user: User | null;
	login: (credentials: LoginCredentials) => Promise<boolean>;
	logout: () => void;
	isAuthenticated: boolean;
	isLoading: boolean;
}

export interface ApiResponse<T> {
	data: T;
	status: number;
}

export interface PaginationMeta {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
