import React, { useState, useEffect } from "react";
import { Post, Category } from "../types";
import { postsAPI, categoriesAPI } from "../services/api";
import { formatDate } from "../utils/helpers";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import PostForm from "../components/Forms/PostForm";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { useTranslation } from "react-i18next";

const Posts: React.FC = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingPost, setEditingPost] = useState<Post | null>(null);
	const [formLoading, setFormLoading] = useState(false);
	const { t } = useTranslation();

	useEffect(() => {
		fetchPosts();
		fetchCategories();
	}, []);

	const fetchPosts = async () => {
		try {
			const response = await postsAPI.getAll();
			setPosts(response.data);
		} catch (error) {
			console.error("Error fetching posts:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchCategories = async () => {
		try {
			const response = await categoriesAPI.getAll();
			setCategories(response.data);
		} catch (error) {
			console.error("Error fetching categories:", error);
		}
	};

	const handleCreatePost = () => {
		setEditingPost(null);
		setIsModalOpen(true);
	};

	const handleEditPost = (post: Post) => {
		setEditingPost(post);
		setIsModalOpen(true);
	};

	const handleDeletePost = async (id: number) => {
		if (!confirm(t("common.confirmDelete"))) return;

		try {
			await postsAPI.delete(id);
			setPosts(posts.filter((post) => post.id !== id));
		} catch (error) {
			console.error("Error deleting post:", error);
			alert(t("common.error"));
		}
	};

	const handleSubmitPost = async (postData: any) => {
		setFormLoading(true);
		try {
			if (editingPost) {
				await postsAPI.update(editingPost.id, postData);
				setPosts(
					posts.map((post) =>
						post.id === editingPost.id ? { ...editingPost, ...postData } : post,
					),
				);
			} else {
				const response = await postsAPI.create(postData);
				setPosts([response.data, ...posts]);
			}
			setIsModalOpen(false);
		} catch (error) {
			console.error("Error saving post:", error);
			alert(t("common.error"));
		} finally {
			setFormLoading(false);
		}
	};

	const filteredPosts = posts.filter((post) => {
		const matchesSearch =
			post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus =
			statusFilter === "all" || post.status === statusFilter;
		const matchesCategory =
			categoryFilter === "all" || post.category === categoryFilter;

		return matchesSearch && matchesStatus && matchesCategory;
	});

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			published: {
				color: "bg-green-100 text-green-800",
				label: t("posts.published"),
			},
			draft: {
				color: "bg-yellow-100 text-yellow-800",
				label: t("posts.draft"),
			},
			archived: {
				color: "bg-gray-100 text-gray-800",
				label: t("posts.archived"),
			},
		};

		const config =
			statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

		return (
			<span
				className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
			>
				{config.label}
			</span>
		);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						{t("posts.title")}
					</h1>
					<p className="text-gray-600">{t("posts.subtitle")}</p>
				</div>
				<Button onClick={handleCreatePost}>
					<Plus className="w-4 h-4 mr-2" />
					{t("posts.newPost")}
				</Button>
			</div>

			<div className="bg-white rounded-lg shadow-sm border p-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
						<input
							type="text"
							placeholder={t("common.search")}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						/>
					</div>

					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					>
						<option value="all">{t("posts.allStatuses")}</option>
						<option value="published">{t("posts.published")}</option>
						<option value="draft">{t("posts.draft")}</option>
						<option value="archived">{t("posts.archived")}</option>
					</select>

					<select
						value={categoryFilter}
						onChange={(e) => setCategoryFilter(e.target.value)}
						className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					>
						<option value="all">{t("posts.allCategories")}</option>
						{categories.map((category) => (
							<option key={category.id} value={category.slug}>
								{category.name}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow-sm border overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t("posts.titleField")}
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t("posts.status")}
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t("posts.category")}
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t("posts.date")}
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									{t("common.actions")}
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filteredPosts.map((post) => (
								<tr key={post.id} className="hover:bg-gray-50">
									<td className="px-6 py-4">
										<div>
											<div className="text-sm font-medium text-gray-900">
												{post.title}
											</div>
											<div className="text-sm text-gray-500">
												{post.excerpt}
											</div>
										</div>
									</td>
									<td className="px-6 py-4">{getStatusBadge(post.status)}</td>
									<td className="px-6 py-4 text-sm text-gray-900 capitalize">
										{post.category}
									</td>
									<td className="px-6 py-4 text-sm text-gray-500">
										{formatDate(post.updatedAt)}
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center space-x-2">
											<button
												onClick={() => handleEditPost(post)}
												className="text-blue-600 hover:text-blue-800 transition-colors"
												title={t("common.edit")}
											>
												<Edit className="w-4 h-4" />
											</button>
											<button
												onClick={() => handleDeletePost(post.id)}
												className="text-red-600 hover:text-red-800 transition-colors"
												title={t("common.delete")}
											>
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{filteredPosts.length === 0 && (
					<div className="text-center py-12">
						<div className="mx-auto h-12 w-12 text-gray-400">
							<Search className="w-12 h-12" />
						</div>
						<h3 className="mt-2 text-sm font-medium text-gray-900">
							{t("common.noSearchResults")}
						</h3>
						<p className="mt-1 text-sm text-gray-500">
							{searchTerm || statusFilter !== "all" || categoryFilter !== "all"
								? t("common.tryDifferentSearch")
								: t("posts.startCreating")}
						</p>
					</div>
				)}
			</div>

			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={editingPost ? t("posts.editPost") : t("posts.newPost")}
				size="xl"
			>
				<PostForm
					post={editingPost || undefined}
					onSubmit={handleSubmitPost}
					onCancel={() => setIsModalOpen(false)}
					loading={formLoading}
				/>
			</Modal>
		</div>
	);
};

export default Posts;
