import React, { useEffect } from "react";
import Head from "next/head";
import SettingsTemplate from "src/templates/profile/settings";
import ProfileSettings from "src/templates/profile/settings/profileSettings";
import { useUser } from "src/components/userProvider";
import Footer from "src/components/footer";
import { useRouter } from "next/router";

export default function AccountProfilePage() {
	const { loggedOut } = useUser();
	const { replace } = useRouter();

	useEffect(() => {
		loggedOut && replace("/");
	}, [loggedOut, replace]);
	if (loggedOut) return null;

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
			<Footer />
		</>
	);
}
