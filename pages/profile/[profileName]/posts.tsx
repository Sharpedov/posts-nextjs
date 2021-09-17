import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import ProfileTemplate from "src/templates/profile";
import ProfilePosts from "src/templates/profile/profilePosts";
import { useAuth } from "src/components/authProvider";

export default function ProfilePostsPage() {
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
				<ProfilePosts />
			</ProfileTemplate>
		</>
	);
}
