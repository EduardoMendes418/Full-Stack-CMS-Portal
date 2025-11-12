import React, { useState, useEffect } from "react";
import { Media } from "../types";
import { mediaAPI } from "../services/api";
import { formatFileSize } from "../utils/helpers";
import { Plus, Trash2, Search, Download, Image, File } from "lucide-react";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import MediaUpload from "../components/Forms/MediaUpload";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { useTranslation } from "react-i18next";

const MediaLibrary: React.FC = () => {
	const [media, setMedia] = useState<Media[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
	const [uploadLoading, setUploadLoading] = useState(false);
	const { t } = useTranslation();

	useEffect(() => {
		fetchMedia();
	}, []);

	const fetchMedia = async () => {
		try {
			const response = await mediaAPI.getAll();
			setMedia(response.data);
		} catch (error) {
			console.error("Error fetching media:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleUpload = async (file: File) => {
		setUploadLoading(true);
		try {
			const formData = new FormData();
			formData.append("file", file);

			const response = await mediaAPI.upload(formData);
			setMedia([response.data, ...media]);
			setIsUploadModalOpen(false);
		} catch (error) {
			console.error("Error uploading file:", error);
			alert(t("media.uploadError"));
		} finally {
			setUploadLoading(false);
		}
	};

	const handleDeleteMedia = async (id: number) => {
		if (!confirm(t("common.confirmDelete"))) return;

		try {
			await mediaAPI.delete(id);
			setMedia(media.filter((item) => item.id !== id));
		} catch (error) {
			console.error("Error deleting media:", error);
			alert(t("common.error"));
		}
	};

	const filteredMedia = media.filter((item) =>
		item.filename.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const getFileIcon = (type: string) => {
		if (type.startsWith("image/")) {
			return <Image className="w-8 h-8 text-blue-500" />;
		}
		return <File className="w-8 h-8 text-gray-500" />;
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
						{t("media.title")}
					</h1>
					<p className="text-gray-600">{t("media.subtitle")}</p>
				</div>
				<Button onClick={() => setIsUploadModalOpen(true)}>
					<Plus className="w-4 h-4 mr-2" />
					{t("media.upload")}
				</Button>
			</div>

			<div className="bg-white rounded-lg shadow-sm border p-4">
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
			</div>

			<div className="bg-white rounded-lg shadow-sm border">
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
					{filteredMedia.map((item) => (
						<div
							key={item.id}
							className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
						>
							<div className="aspect-w-16 aspect-h-9 bg-gray-100 flex items-center justify-center">
								{item.type.startsWith("image/") ? (
									<img
										src={item.url}
										alt={item.filename}
										className="object-cover w-full h-32"
									/>
								) : (
									<div className="p-4">{getFileIcon(item.type)}</div>
								)}
							</div>
							<div className="p-3">
								<p
									className="text-sm font-medium text-gray-900 truncate"
									title={item.filename}
								>
									{item.filename}
								</p>
								<p className="text-xs text-gray-500">
									{formatFileSize(item.size)}
								</p>
								<div className="mt-2 flex justify-between items-center">
									<button
										onClick={() => window.open(item.url, "_blank")}
										className="text-blue-600 hover:text-blue-800 transition-colors"
										title={t("media.download")}
									>
										<Download className="w-4 h-4" />
									</button>
									<button
										onClick={() => handleDeleteMedia(item.id)}
										className="text-red-600 hover:text-red-800 transition-colors"
										title={t("common.delete")}
									>
										<Trash2 className="w-4 h-4" />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>

				{filteredMedia.length === 0 && (
					<div className="text-center py-12">
						<div className="mx-auto h-12 w-12 text-gray-400">
							<Search className="w-12 h-12" />
						</div>
						<h3 className="mt-2 text-sm font-medium text-gray-900">
							{searchTerm
								? t("common.noSearchResults")
								: t("common.noItemsFound")}
						</h3>
						<p className="mt-1 text-sm text-gray-500">
							{searchTerm
								? t("common.tryDifferentSearch")
								: t("media.startUploading")}
						</p>
					</div>
				)}
			</div>

			<Modal
				isOpen={isUploadModalOpen}
				onClose={() => setIsUploadModalOpen(false)}
				title={t("media.upload")}
				size="md"
			>
				<MediaUpload
					onUpload={handleUpload}
					onClose={() => setIsUploadModalOpen(false)}
					loading={uploadLoading}
				/>
			</Modal>
		</div>
	);
};

export default MediaLibrary;
