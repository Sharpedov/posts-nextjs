import React, { useEffect } from "react";
import Head from "next/head";
import styled from "styled-components";
import CustomButton from "src/components/customButton";
import { useAuth } from "src/components/authProvider";

export default function HomePage() {
	const { redirectIfNotLogged } = useAuth();

	useEffect(() => {
		redirectIfNotLogged();
	}, [redirectIfNotLogged]);
	return (
		<>
			<Head>
				<title>Contact • Posts</title>
			</Head>
			<MainContainer>
				<Wrapper>
					<Content>
						<Row>
							<h2>Github</h2>
							<ButtonsRow>
								<CustomButton
									variant="default"
									size="medium"
									href="https://github.com/Sharpedov/posts-nextjs"
									targetBlank={true}
								>
									Code for this page
								</CustomButton>

								<CustomButton
									variant="default"
									size="medium"
									href="https://github.com/Sharpedov?tab=repositories"
									targetBlank={true}
								>
									Other projects
								</CustomButton>
							</ButtonsRow>
						</Row>
						<Row>
							<h2>Portfolio</h2>
							<ButtonsRow>
								<CustomButton
									variant="default"
									size="medium"
									href="https://portfolio-adrian-piatek.vercel.app/"
									targetBlank={true}
								>
									Visit website
								</CustomButton>
							</ButtonsRow>
						</Row>
					</Content>
				</Wrapper>
			</MainContainer>
		</>
	);
}

const MainContainer = styled.main`
	padding: 1rem 1.5rem;
	min-height: 100vh;

	@media ${({ theme }) => theme.breakpoints.md} {
		padding: 1rem;
	}
`;

const Wrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	max-width: 1050px;
	margin: 50px auto 0;
	width: 100%;

	@media ${({ theme }) => theme.breakpoints.xl} {
		max-width: 1180px;
	}
`;

const Content = styled.div`
	display: flex;
	flex-direction: column;
	gap: 40px 0;

	> h2 {
		font-size: clamp(2.4rem, 2.5vw, 5rem);
	}
`;

const Row = styled.div`
	display: flex;
	flex-direction: column;
`;

const ButtonsRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 15px;
	margin-top: 15px;
`;
