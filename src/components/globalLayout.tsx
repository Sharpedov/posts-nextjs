import React from "react";
import styled from "styled-components";
import Footer from "./footer";
import Navbar from "./navbar";

interface IProps {
	children: React.ReactNode;
}

const GlobalLayout = ({ children }: IProps) => {
	return (
		<Layout>
			<Navbar />
			{children}
			<Footer />
		</Layout>
	);
};

export default GlobalLayout;

const Layout = styled.div`
	margin-top: 44px;
	min-height: 100vh;

	@media ${({ theme }) => theme.breakpoints.lg} {
		margin-top: 58px;
	}
`;
