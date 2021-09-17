import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import ProfileTemplate from "src/templates/profile";
import ProfilePosts from "src/templates/profile/profilePosts";

export default function ProfilePostsPage() {
	const { query } = useRouter();

	return (
		<>
			<Head>
				<title>
					{query.profileName
						? `${query.profileName}'s profile • Posts`
						: "Username • Posts"}
				</title>
			</Head>
			<ProfileTemplate profileName={query.profileName ?? ""}>
				<ProfilePosts />
			</ProfileTemplate>
		</>
	);
}
