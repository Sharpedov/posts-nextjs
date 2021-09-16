import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import ScaleLoading from "src/components/loading/scaleLoading";
import InfoIcon from "@material-ui/icons/Info";
import { useInfiniteQuery } from "src/hooks/useInfiniteQuery";
import { addMutatePosts } from "src/store/slices/postsSlice";
import { useDispatch } from "react-redux";
import { CardActionArea } from "@material-ui/core";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import Link from "next/link";

const ProfileOverview = (props) => {
	const { profileName, profileData } = props;
	const {
		fetchNextPage,
		fetchedData,
		error,
		isLoadingInitialData,
		isLoadingMore,
		isEmpty,
		hasNextPage,
		mutate,
	} = useInfiniteQuery({ queryKey: `/api/posts/${profileName}?limit=20` });

	const dispatch = useDispatch();
	const observer = useRef(null!);

	useEffect(() => {
		mutate && dispatch(addMutatePosts(mutate));
	}, [mutate, dispatch]);

	const lastItemRef = useCallback(
		(node) => {
			if (isLoadingMore || hasNextPage) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && !hasNextPage) {
					fetchNextPage();
				}
			});
			if (node) observer.current.observe(node);
		},
		[isLoadingMore, hasNextPage, fetchNextPage]
	);

	return (
		<ContentWrapper>
			<Column1>
				<ProfilePanel>
					<ProfilePanelRow>
						<ProfilePanelRowColumn1>
							<InfoIcon className="accountProfileRowHeadner__icon" />
						</ProfilePanelRowColumn1>
						<ProfilePanelRowColumn2>
							<span>Description</span>
							<ProfileRowContent>
								{profileData.description ? profileData.description : "---"}
							</ProfileRowContent>
						</ProfilePanelRowColumn2>
					</ProfilePanelRow>
				</ProfilePanel>
			</Column1>

			<Column2>
				{error ? (
					<div>{error.message}</div>
				) : isLoadingInitialData ? (
					<ScaleLoading center marginTop={15} />
				) : (
					<PostsContainer>
						{fetchedData.map((post) => (
							<Link key={post._id} passHref href={`/post/${post._id}`}>
								<PostCard ref={lastItemRef}>
									<PostCardImage
										src={post.image}
										alt={`${post.creator}'s post`}
										draggable="false"
										loading="lazy"
									/>
									<PostCardOverlay>
										<PostLikesCount>
											<ThumbUpIcon className="profileOverviewPostCardOverlay__icon" />
											<span>{post.likes.length}</span>
										</PostLikesCount>
									</PostCardOverlay>
								</PostCard>
							</Link>
						))}
					</PostsContainer>
				)}
				{!isLoadingInitialData && isLoadingMore && (
					<ScaleLoading center marginTop={30} />
				)}
				{isEmpty ? (
					<div style={{ margin: "30px auto 0" }}>No posts yet</div>
				) : (
					hasNextPage && (
						<div style={{ margin: "30px auto 0" }}>No more posts</div>
					)
				)}
			</Column2>
		</ContentWrapper>
	);
};

export default ProfileOverview;

const ContentWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	grid-gap: 10px;
	max-width: 1050px;
	width: 100%;
	margin: 0 auto;

	@media ${({ theme }) => theme.breakpoints.md} {
		grid-template-columns: calc(40% - 30px) 60%;
		grid-gap: 30px;
	}
	@media ${({ theme }) => theme.breakpoints.xl} {
		max-width: 1180px;
	}
`;

const Column1 = styled.div`
	display: flex;
	flex-direction: column;
	flex-basis: 100%;
`;
const Column2 = styled.div`
	display: flex;
	flex-direction: column;
	flex-basis: 100%;
`;

const ProfilePanel = styled.div`
	display: flex;
	flex-direction: column;
	gap: 30px 0;
	border-radius: 3px;
	background: ${({ theme }) => theme.colors.background.secondary};
	padding: 1.7rem;
`;

const ProfilePanelRow = styled.div`
	display: flex;
	gap: 7px 0;
`;

const ProfilePanelRowColumn1 = styled.div`
	display: flex;
	color: ${({ theme }) => theme.colors.color.secondary};
	margin-right: 7px;

	.accountProfileRowHeadner__icon {
		font-size: 1.6rem;
	}
`;
const ProfilePanelRowColumn2 = styled.div`
	display: flex;
	flex-direction: column;
	gap: 7px 0;
	font-size: 1.4rem;
	line-height: 1;
	color: ${({ theme }) => theme.colors.color.secondary};
	font-weight: 500;
`;

const ProfileRowContent = styled.div`
	color: ${({ theme }) => theme.colors.color.secondary};
	font-size: 1.5rem;
`;

const PostsContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 5px;
`;

const PostCard = styled(CardActionArea)`
	position: relative;
	padding: 0 0 100%;

	&:hover {
		> span {
			background: transparent;
		}
	}
`;

const PostCardImage = styled.img`
	position: absolute;
	inset: 0;
	display: block;
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

const PostCardOverlay = styled.div`
	display: none;

	@media ${({ theme }) => theme.breakpoints.md} {
		display: grid;
		place-items: center;
		position: absolute;
		inset: 0;
		opacity: 0;
		pointer-events: none;
		z-index: 1;
		transition: opacity 0.15s ease;

		&::after {
			content: "";
			position: absolute;
			inset: 0;
			background: rgba(0, 0, 0, 0.3);
			z-index: -1;
		}

		${PostCard}:hover & {
			opacity: 1;
		}

		.profileOverviewPostCardOverlay__icon {
			font-size: 2.2rem;
		}
	}
`;

const PostLikesCount = styled.div`
	display: flex;
	align-items: center;
	gap: 0 7px;

	> span {
		display: inline-block;
		font-size: 1.9rem;
	}
`;
