import React, { useEffect } from "react";
import Head from "next/head";
import styled from "styled-components";
import { useRouter } from "next/router";
import Posts from "src/components/posts";
import { useAuth } from "src/components/authProvider";

const TaggedPage = () => {
	const { redirectIfNotLogged } = useAuth();
	useEffect(() => {
		redirectIfNotLogged();
	}, [redirectIfNotLogged]);

	const {
		query: { postTags },
	} = useRouter();

	return (
		<>
			<Head>
				<title>Tagged posts • Posts</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<MainContainer>
				<Wrapper>
					<Posts
						queryKeyWithLimit={`/api/posts/tagged?limit=12&tags=${postTags}`}
					/>
				</Wrapper>
			</MainContainer>
		</>
	);
};

export default TaggedPage;

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
