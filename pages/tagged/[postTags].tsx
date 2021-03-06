import React, { useEffect } from "react";
import Head from "next/head";
import styled from "styled-components";
import { useRouter } from "next/router";
import Posts from "src/components/posts";
import { useUser } from "src/components/userProvider";
import Footer from "src/components/footer";

export default function TaggedPage() {
	const { loggedOut } = useUser();
	const {
		query: { postTags },
		replace,
	} = useRouter();

	useEffect(() => {
		loggedOut && replace("/");
	}, [loggedOut, replace]);
	if (loggedOut) return null;

	return (
		<>
			<Head>
				<title>Tagged posts • Posts</title>
				<meta name="description" content={`Posts tagged with ${postTags} `} />
			</Head>
			<MainContainer>
				<Wrapper>
					<Posts
						queryKeyWithLimit={`/api/posts/tagged?limit=12&tags=${postTags}`}
					/>
				</Wrapper>
			</MainContainer>
			<Footer />
		</>
	);
}

const MainContainer = styled.main`
	padding: 1rem 0;

	@media ${({ theme }) => theme.breakpoints.md} {
		padding: 1rem;
	}
`;

const Wrapper = styled.div`
	max-width: 1050px;
	margin: 0 auto;
	width: 100%;

	@media ${({ theme }) => theme.breakpoints.xl} {
		max-width: 1180px;
	}
`;
