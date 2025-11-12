import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Posts from "./pages/Posts";
import Layout from "./components/Layout/Layout";
import Categories from "./pages/Categories";
import Media from "./pages/Media";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import "./i18n";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { isAuthenticated } = useAuth();
	return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { isAuthenticated } = useAuth();
	return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
};

const AppRoutes: React.FC = () => {
	return (
		<Routes>
			<Route
				path="/login"
				element={
					<PublicRoute>
						<Login />
					</PublicRoute>
				}
			/>
			<Route
				path="/"
				element={
					<ProtectedRoute>
						<Layout />
					</ProtectedRoute>
				}
			>
				<Route index element={<Navigate to="/dashboard" />} />
				<Route path="dashboard" element={<Dashboard />} />
				<Route path="posts" element={<Posts />} />
				<Route path="categories" element={<Categories />} />
				<Route path="media" element={<Media />} />
				<Route path="users" element={<Users />} />
				<Route path="settings" element={<Settings />} />
			</Route>
		</Routes>
	);
};

const App: React.FC = () => {
	return (
		<AuthProvider>
			<Router>
				<AppRoutes />
			</Router>
		</AuthProvider>
	);
};

export default App;
