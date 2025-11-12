import React, { useState, useEffect } from "react";
import { Settings as SettingsType } from "../types";
import { settingsAPI } from "../services/api";
import { Save } from "lucide-react";
import Button from "../components/UI/Button";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { useTranslation } from "react-i18next";

const Settings: React.FC = () => {
	const [settings, setSettings] = useState<SettingsType | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [formData, setFormData] = useState({
		siteName: "",
		siteDescription: "",
		siteUrl: "",
		adminEmail: "",
		postsPerPage: 10,
		timezone: "UTC-3",
		dateFormat: "DD/MM/YYYY",
		language: "es",
		maintenanceMode: false,
	});
	const { t } = useTranslation();

	useEffect(() => {
		fetchSettings();
	}, []);

	const fetchSettings = async () => {
		try {
			const response = await settingsAPI.get();
			const settingsData = response.data;
			setSettings(settingsData);
			setFormData(settingsData);
		} catch (error) {
			console.error("Error fetching settings:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);

		try {
			await settingsAPI.update(formData);
			setSettings({ ...settings, ...formData } as SettingsType);
			alert(t("settings.saveSuccess"));
		} catch (error) {
			console.error("Error saving settings:", error);
			alert(t("common.error"));
		} finally {
			setSaving(false);
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value, type } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]:
				type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
		}));
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
			<div>
				<h1 className="text-2xl font-bold text-gray-900">
					{t("settings.title")}
				</h1>
				<p className="text-gray-600">{t("settings.subtitle")}</p>
			</div>

			<form onSubmit={handleSubmit}>
				<div className="space-y-6">
					{/* General Settings */}
					<div className="bg-white rounded-lg shadow-sm border">
						<div className="px-6 py-4 border-b">
							<h2 className="text-lg font-semibold text-gray-900">
								{t("settings.general.title")}
							</h2>
						</div>
						<div className="p-6 space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label
										htmlFor="siteName"
										className="block text-sm font-medium text-gray-700"
									>
										{t("settings.general.siteName")} *
									</label>
									<input
										type="text"
										id="siteName"
										name="siteName"
										required
										value={formData.siteName}
										onChange={handleInputChange}
										className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
									/>
								</div>

								<div>
									<label
										htmlFor="siteUrl"
										className="block text-sm font-medium text-gray-700"
									>
										{t("settings.general.siteUrl")} *
									</label>
									<input
										type="url"
										id="siteUrl"
										name="siteUrl"
										required
										value={formData.siteUrl}
										onChange={handleInputChange}
										className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="siteDescription"
									className="block text-sm font-medium text-gray-700"
								>
									{t("settings.general.siteDescription")}
								</label>
								<textarea
									id="siteDescription"
									name="siteDescription"
									rows={3}
									value={formData.siteDescription}
									onChange={handleInputChange}
									className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
								/>
							</div>

							<div>
								<label
									htmlFor="adminEmail"
									className="block text-sm font-medium text-gray-700"
								>
									{t("settings.general.adminEmail")} *
								</label>
								<input
									type="email"
									id="adminEmail"
									name="adminEmail"
									required
									value={formData.adminEmail}
									onChange={handleInputChange}
									className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
								/>
							</div>
						</div>
					</div>

					{/* Posts Settings */}
					<div className="bg-white rounded-lg shadow-sm border">
						<div className="px-6 py-4 border-b">
							<h2 className="text-lg font-semibold text-gray-900">
								{t("settings.posts.title")}
							</h2>
						</div>
						<div className="p-6 space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label
										htmlFor="postsPerPage"
										className="block text-sm font-medium text-gray-700"
									>
										{t("settings.posts.postsPerPage")}
									</label>
									<input
										type="number"
										id="postsPerPage"
										name="postsPerPage"
										min="1"
										max="100"
										value={formData.postsPerPage}
										onChange={handleInputChange}
										className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
									/>
								</div>

								<div>
									<label
										htmlFor="dateFormat"
										className="block text-sm font-medium text-gray-700"
									>
										{t("settings.posts.dateFormat")}
									</label>
									<select
										id="dateFormat"
										name="dateFormat"
										value={formData.dateFormat}
										onChange={handleInputChange}
										className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
									>
										<option value="DD/MM/YYYY">DD/MM/YYYY</option>
										<option value="MM/DD/YYYY">MM/DD/YYYY</option>
										<option value="YYYY-MM-DD">YYYY-MM-DD</option>
									</select>
								</div>
							</div>
						</div>
					</div>

					{/* Regional Settings */}
					<div className="bg-white rounded-lg shadow-sm border">
						<div className="px-6 py-4 border-b">
							<h2 className="text-lg font-semibold text-gray-900">
								{t("settings.regional.title")}
							</h2>
						</div>
						<div className="p-6 space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label
										htmlFor="timezone"
										className="block text-sm font-medium text-gray-700"
									>
										{t("settings.regional.timezone")}
									</label>
									<select
										id="timezone"
										name="timezone"
										value={formData.timezone}
										onChange={handleInputChange}
										className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
									>
										<option value="UTC-3">
											UTC-3 ({t("settings.regional.argentina")})
										</option>
										<option value="UTC-5">
											UTC-5 ({t("settings.regional.colombiaPeru")})
										</option>
										<option value="UTC-6">
											UTC-6 ({t("settings.regional.mexico")})
										</option>
										<option value="UTC-8">
											UTC-8 ({t("settings.regional.california")})
										</option>
										<option value="UTC+0">
											UTC+0 ({t("settings.regional.london")})
										</option>
										<option value="UTC+1">
											UTC+1 ({t("settings.regional.spain")})
										</option>
									</select>
								</div>

								<div>
									<label
										htmlFor="language"
										className="block text-sm font-medium text-gray-700"
									>
										{t("settings.regional.language")}
									</label>
									<select
										id="language"
										name="language"
										value={formData.language}
										onChange={handleInputChange}
										className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
									>
										<option value="es">{t("settings.regional.spanish")}</option>
										<option value="en">{t("settings.regional.english")}</option>
										<option value="pt">
											{t("settings.regional.portuguese")}
										</option>
									</select>
								</div>
							</div>
						</div>
					</div>

					{/* Maintenance Settings */}
					<div className="bg-white rounded-lg shadow-sm border">
						<div className="px-6 py-4 border-b">
							<h2 className="text-lg font-semibold text-gray-900">
								{t("settings.maintenance.title")}
							</h2>
						</div>
						<div className="p-6">
							<div className="flex items-center">
								<input
									type="checkbox"
									id="maintenanceMode"
									name="maintenanceMode"
									checked={formData.maintenanceMode}
									onChange={handleInputChange}
									className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
								/>
								<label
									htmlFor="maintenanceMode"
									className="ml-2 block text-sm text-gray-900"
								>
									{t("settings.maintenance.enable")}
								</label>
							</div>
							<p className="mt-1 text-sm text-gray-500">
								{t("settings.maintenance.description")}
							</p>
						</div>
					</div>

					<div className="flex justify-end">
						<Button type="submit" loading={saving}>
							<Save className="w-4 h-4 mr-2" />
							{t("settings.saveChanges")}
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default Settings;
