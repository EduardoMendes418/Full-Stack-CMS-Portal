import React from "react";
import { useAuth } from "../../context/AuthContext";
import { LogOut, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../UI/LanguageSwitcher";

const Header: React.FC = () => {
	const { user, logout } = useAuth();
	const { t } = useTranslation();

	return (
		<header className="bg-white shadow-sm border-b">
			<div className="flex justify-between items-center px-6 py-4">
				<div>
					<h2 className="text-xl font-semibold text-gray-800">
						{t("common.welcome")}, {user?.name}
					</h2>
					<p className="text-sm text-gray-600 capitalize">{user?.role}</p>
				</div>

				<div className="flex items-center space-x-6">
					+ <LanguageSwitcher />
					<div className="flex items-center space-x-2">
						<User className="w-5 h-5 text-gray-600" />
						<span className="text-sm text-gray-700">{user?.email}</span>
					</div>
					<button
						onClick={logout}
						className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
					>
						<LogOut className="w-4 h-4" />
						<span>{t("auth.logout")}</span>
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;
