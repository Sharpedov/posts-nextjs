import React from "react";
import styled from "styled-components";
import Link from "next/link";
import CustomButton from "../customButton";
import { useRouter } from "next/router";

interface IProps {}

const NotLoggedNavbar = ({}: IProps) => {
	const { pathname } = useRouter();

	return (
		<NavContainer>
			<Wrapper>
				<Link passHref href="/">
					<Logo />
				</Link>
				<Buttons>
					{pathname === "/login" ? (
						<CustomButton color="secondary" size="small" href="/createAccount">
							Create Account
						</CustomButton>
					) : pathname === "/createAccount" ? (
						<CustomButton size="small" href="/login">
							Sign in
						</CustomButton>
					) : (
						<>
							<CustomButton size="small" href="/login">
								Sign in
							</CustomButton>
							<CustomButton
								color="secondary"
								size="small"
								href="/createAccount"
							>
								Create Account
							</CustomButton>
						</>
					)}
				</Buttons>
			</Wrapper>
		</NavContainer>
	);
};

export default NotLoggedNavbar;

const NavContainer = styled.nav`
	position: sticky;
	top: 0;
	left: 0;
	right: 0;
	display: flex;
	background: ${({ theme }) => theme.colors.navbar.secondary};
	height: 44px;
	margin-top: -44px;
	z-index: 100;
	padding: 0 1rem;

	@media ${({ theme }) => theme.breakpoints.sm} {
		background: transparent;
	}
	@media ${({ theme }) => theme.breakpoints.lg} {
		height: 58px;
		margin-top: -58px;
	}

	@media ${({ theme }) => theme.breakpoints.xl} {
		padding: 0 2.2rem;
	}
`;

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	/* max-width: 1050px; */
	width: 100%;
	margin: 0 auto;
	height: inherit;

	@media ${({ theme }) => theme.breakpoints.xl} {
		/* max-width: 1180px; */
	}
`;

const Logo = styled.div`
	letter-spacing: 1px;
	font-size: 3.3rem;
	color: ${({ theme }) => theme.colors.color.primary};
	font-weight: 700;
	font-family: ${({ theme }) => theme.fonts.title};
	padding-right: 1rem;
	cursor: pointer;

	&::after {
		content: "P";
	}

	@media ${({ theme }) => theme.breakpoints.sm} {
		font-size: 2.8rem;

		&::after {
			content: "Posts";
		}
	}
	@media ${({ theme }) => theme.breakpoints.md} {
		font-size: 3rem;
	}

	@keyframes rainbow_animation {
		0%,
		100% {
			background-position: 0 0;
		}

		50% {
			background-position: 100% 0;
		}
	}
`;

const Buttons = styled.div`
	display: flex;
	align-items: center;
	gap: 0 15px;
`;
