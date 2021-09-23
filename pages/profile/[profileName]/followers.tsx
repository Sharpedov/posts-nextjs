import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import ProfileTemplate from "src/templates/profile";
import { useUser } from "src/components/userProvider";
import Footer from "src/components/footer";
import ProfileFollowers from "src/templates/profile/profileFollowers";

export default function ProfileFollowersPage() {
	const { loggedOut } = useUser();
	const { replace, query } = useRouter();

	useEffect(() => {
		loggedOut && replace("/");
	}, [loggedOut, replace]);
	if (loggedOut) return null;

	return (
		<>
			<Head>
				<title>
					{query.profileName
						? `${query.profileName} followers • Posts`
						: "Followers • Posts"}
				</title>
				<meta name="og:title" content={`${query.profileName}`} />
				<meta name="description" content={`${query.profileName} followers'`} />
			</Head>
			<ProfileTemplate profileName={query.profileName}>
				<ProfileFollowers />
			</ProfileTemplate>
			<Footer />
		</>
	);
}
