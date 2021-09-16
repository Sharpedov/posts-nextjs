import React from "react";
import styled from "styled-components";

const ProfilePosts = (props) => {
	const { profileName } = props;

	return <ContentWrapper>{profileName}</ContentWrapper>;
};

export default ProfilePosts;

const ContentWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	grid-gap: 10px;
	max-width: 1050px;
	width: 100%;
	margin: 0 auto;

	@media ${({ theme }) => theme.breakpoints.md} {
	}
	@media ${({ theme }) => theme.breakpoints.xl} {
		max-width: 1180px;
	}
`;
