import React, { useEffect } from "react";
import Head from "next/head";
import SettingsTemplate from "src/templates/profile/settings";
import ProfileSettings from "src/templates/profile/settings/profileSettings";
import { useAuth } from "src/components/authProvider";

export default function AccountProfilePage() {
	const { redirectIfNotLogged } = useAuth();

	useEffect(() => {
		redirectIfNotLogged();
	}, [redirectIfNotLogged]);

	return (
		<>
			<Head>
				<title>Profile Settings • Posts</title>
				<meta
					name="description"
					content="Here you can update the profile settings"
				/>
			</Head>
			<SettingsTemplate>
				<ProfileSettings />
			</SettingsTemplate>
		</>
	);
}
