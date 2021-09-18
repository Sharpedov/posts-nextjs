import React, { useEffect } from "react";
import Head from "next/head";
import SettingsTemplate from "src/templates/profile/settings";
import AccountSettings from "src/templates/profile/settings/accountSettings";
import { useAuth } from "src/components/authProvider";
import Footer from "src/components/footer";

export default function AccountSettingsPage() {
	const { redirectIfNotLogged } = useAuth();

	useEffect(() => {
		redirectIfNotLogged();
	}, [redirectIfNotLogged]);

	return (
		<>
			<Head>
				<title>Account Settings • Posts</title>
				<meta
					name="description"
					content="Here you can update the account settings"
				/>
			</Head>
			<SettingsTemplate>
				<AccountSettings />
			</SettingsTemplate>
			<Footer />
		</>
	);
}
