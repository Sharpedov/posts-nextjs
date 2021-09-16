import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import ProfileTemplate from "src/templates/profile";
import ProfilePosts from "src/templates/profile/profilePosts";
import { useAuth } from "src/components/authProvider";

const UserProfilePage = () => {
	const { redirectIfNotLogged } = useAuth();
	const { query } = useRouter();
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
			<ProfileTemplate profileName={query.profileName ?? ""}>
				<ProfilePosts />
			</ProfileTemplate>
		</>
	);
};

export default UserProfilePage;
