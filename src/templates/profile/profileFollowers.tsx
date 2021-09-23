import { CardActionArea } from "@material-ui/core";
import React from "react";
import { authFetcher } from "src/utils/authAxiosMethods";
import styled from "styled-components";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import ScaleLoading from "src/components/loading/scaleLoading";
import { motion } from "framer-motion";

const ProfileFollowers = (props) => {
	const { profileData } = props;
	const { data, error } = useSWR(
		profileData.followers &&
			`/api/users/followers?followers=${profileData?.followers ?? []}`,
		authFetcher
	);

	return (
		<ContentWrapper>
			{error ? (
				<div>{error.message}</div>
			) : !data ? (
				<ScaleLoading center />
			) : data.length === 0 ? (
				<div style={{ margin: "10px auto" }}>0 followers</div>
			) : (
				<FollowersList
					initial={{ opacity: 0 }}
					animate={{ opacity: 1, transition: { duration: 0.15 } }}
				>
					{data.map((follow) => (
						<Link
							passHref
							href={`/profile/${follow.username}`}
							key={`followers-${follow.username}`}
						>
							<FollowersItem key={`followers-${follow.username}`}>
								<Image
									layout="fill"
									src={follow.avatar}
									alt={follow.username}
									draggable="false"
									objectFit="cover"
								/>
								<FollowersItemOverlay>{follow.username}</FollowersItemOverlay>
							</FollowersItem>
						</Link>
					))}
				</FollowersList>
			)}
		</ContentWrapper>
	);
};

export default ProfileFollowers;

const ContentWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	grid-gap: 10px;
	max-width: 1050px;
	width: 100%;
	margin: 0 auto;
	padding: 0 1rem;

	@media ${({ theme }) => theme.breakpoints.md} {
		padding: 0;
	}

	@media ${({ theme }) => theme.breakpoints.xl} {
		max-width: 1180px;
	}
`;

const FollowersList = styled(motion.div)`
	display: grid;
	grid-template-columns: repeat(auto-fill, 90px);
	width: 100%;
	grid-gap: 10px;
`;

const FollowersItem = styled(CardActionArea)`
	position: relative;
	padding: 0;
	padding-bottom: 100%;
	border-radius: 3px;
	overflow: hidden;

	> span {
		background: transparent;
	}
`;

const FollowersItemOverlay = styled.div`
	position: absolute;
	inset: 0;
	display: flex;
	justify-content: center;
	align-items: flex-end;
	padding: 1rem 0.5rem;
	font-size: 1.4rem;
	pointer-events: none;
	opacity: 1;
	background: rgba(0, 0, 0, 0.3);
	font-weight: 600;
	transition: opacity 0.2s ease;
	word-break: break-word;

	${FollowersItem}:hover & {
		opacity: 1;
	}

	@media ${({ theme }) => theme.breakpoints.md} {
		background: rgba(0, 0, 0, 0.4);
		opacity: 0;
	}
`;
