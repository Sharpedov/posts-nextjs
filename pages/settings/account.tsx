import React, { useEffect } from "react";
import Head from "next/head";
import SettingsTemplate from "src/templates/profile/settings";
import AccountSettings from "src/templates/profile/settings/accountSettings";
import { useUser } from "src/components/userProvider";
import Footer from "src/components/footer";
import { useRouter } from "next/router";

export default function AccountSettingsPage() {
	const { loggedOut } = useUser();
	const { replace } = useRouter();

	useEffect(() => {
		loggedOut && replace("/");
	}, [loggedOut, replace]);
	if (loggedOut) return null;

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
