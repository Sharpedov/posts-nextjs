import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import ProfileTemplate from "src/templates/profile";
import { useUser } from "src/components/userProvider";
import Footer from "src/components/footer";
import ProfileFollowing from "src/templates/profile/profileFollowing";

export default function ProfileFollowingPage() {
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
						? `${query.profileName} following • Posts`
						: "Following • Posts"}
				</title>
				<meta name="og:title" content={`${query.profileName}`} />
				<meta name="description" content={`${query.profileName} following'`} />
			</Head>
			<ProfileTemplate profileName={query.profileName}>
				<ProfileFollowing />
			</ProfileTemplate>
			<Footer />
		</>
	);
}
