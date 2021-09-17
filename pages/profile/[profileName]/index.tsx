import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import ProfileTemplate from "src/templates/profile";
import ProfileOverview from "src/templates/profile/profileOverview";
import cookie from "cookie";

export default function ProfilePage() {
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
				<ProfileOverview />
			</ProfileTemplate>
		</>
	);
}

export async function getServerSideProps(context) {
	const { req, res } = context;
	const cookies = cookie.parse(req.headers.cookie || "");

	if (!cookies.auth) {
		res.writeHead(302, { Location: "/" });
		res.end();
	}

	return { props: {} };
}
