import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import ProfileTemplate from "src/templates/profile";
import ProfileOverview from "src/templates/profile/profileOverview";
import { useAuth } from "src/components/authProvider";

export default function ProfilePage() {
	const { query } = useRouter();
	const { redirectIfNotLogged } = useAuth();

	useEffect(() => {
		redirectIfNotLogged();
	}, [redirectIfNotLogged]);

	return (
		<>
			<Head>
				<title>
					{query.profileName
						? `${query.profileName}'s profile • Posts`
						: "Username • Posts"}
				</title>
			</Head>
			<ProfileTemplate profileName={query.profileName}>
				<ProfileOverview />
			</ProfileTemplate>
		</>
	);
}
