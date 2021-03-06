import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import ProfileTemplate from "src/templates/profile";
import ProfileOverview from "src/templates/profile/profileOverview";
import { useUser } from "src/components/userProvider";
import Footer from "src/components/footer";

export default function ProfilePage() {
	const { loggedOut } = useUser();
	const { query, replace } = useRouter();

	useEffect(() => {
		loggedOut && replace("/");
	}, [loggedOut, replace]);
	if (loggedOut) return null;

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
