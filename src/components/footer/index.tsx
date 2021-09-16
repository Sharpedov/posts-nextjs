import React from "react";
import styled from "styled-components";

interface IProps {}

const Footer = ({}: IProps) => {
	return (
		<FooterContainer>
			<Wrapper></Wrapper>
		</FooterContainer>
	);
};

export default Footer;

const FooterContainer = styled.footer`
	background: ${({ theme }) => theme.colors.footer.primary};
	padding: 5rem 3rem;
`;

const Wrapper = styled.div`
	display: flex;
	max-width: 1050px;
	width: 100%;
	margin: 0 auto;

	@media ${({ theme }) => theme.breakpoints.xl} {
		max-width: 1180px;
	}
`;
