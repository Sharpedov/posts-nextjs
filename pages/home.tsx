import React, { useEffect } from "react";
import Head from "next/head";
import styled from "styled-components";
import Posts from "src/components/posts";
import { useAuth } from "src/components/authProvider";

export default function HomePage() {
	const { redirectIfNotLogged } = useAuth();

	useEffect(() => {
		redirectIfNotLogged();
	}, [redirectIfNotLogged]);

	return (
		<>
			<Head>
				<title>Home • Posts</title>
			</Head>
			<MainContainer>
				<Wrapper>
					<Posts queryKeyWithLimit="/api/posts?limit=12" />
				</Wrapper>
			</MainContainer>
		</>
	);
}

const MainContainer = styled.main`
	padding: 1rem 0 4rem;

	@media ${({ theme }) => theme.breakpoints.md} {
		padding: 1rem 1rem 4rem;
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
