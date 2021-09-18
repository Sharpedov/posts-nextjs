import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import ProfileTemplate from "src/templates/profile";
import ProfileOverview from "src/templates/profile/profileOverview";
import { useAuth } from "src/components/authProvider";
import Footer from "src/components/footer";

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
				<meta name="og:title" content={`${query.profileName}`} />
				<meta
					name="description"
					content={`${query.profileName}'s Posts user profile'`}
				/>
			</Head>
			<ProfileTemplate profileName={query.profileName}>
				<ProfileOverview />
			</ProfileTemplate>
			<Footer />
		</>
	);
}
