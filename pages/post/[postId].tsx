import { useRouter } from "next/router";
import React, { useMemo } from "react";
import PostDetails from "src/components/post/postDetails";
import styled from "styled-components";
import Head from "next/head";
import useSWR from "swr";
import { fetcher } from "src/utils/fetcher";
import { CardActionArea } from "@material-ui/core";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PostPage() {
	const {
		query: { postId },
	} = useRouter();
	const { data: postData, error: postError } = useSWR(
		postId && `/api/posts/post/${postId}`,
		fetcher
	);
	const { data: recommendedPosts, error: recommendedError } = useSWR(
		postData?.tags && `/api/posts/tagged?limit=6&tags=${postData.tags}`,
		fetcher
	);
	const { push } = useRouter();

	const filterRecommendedPosts = useMemo(() => {
		if (!recommendedPosts || !postData) return;
		return recommendedPosts.filter((post) => post._id !== postData._id);
	}, [postData, recommendedPosts]);

	if (postError) {
		push("/404");

		return null;
	}

	return (
		<>
			<Head>
				<title>
					{postData
						? `${postData.creator} post • Posts`
						: "Username post • Posts"}
				</title>
			</Head>
			<MainContainer>
				<Wrapper>
					<PostDetails
						postId={postId}
						initialData={{ data: postData, error: postError }}
						isInModal={false}
					/>
					{!recommendedPosts ? null : recommendedError ? (
						<div>{recommendedError.message}</div>
					) : (
						<RecommendedPostsContainer
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
						>
							{filterRecommendedPosts.length === 0 ? (
								<span>There are no recommended posts for these tags</span>
							) : (
								<>
									<span>Recommended posts for this tags</span>
									<RecommendedPostsList>
										{filterRecommendedPosts.map((post) => (
											<Link key={post._id} passHref href={`/post/${post._id}`}>
												<RecommendedPostCard>
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
												</RecommendedPostCard>
											</Link>
										))}
									</RecommendedPostsList>
								</>
							)}
						</RecommendedPostsContainer>
					)}
				</Wrapper>
			</MainContainer>
		</>
	);
}

const MainContainer = styled.main`
	min-height: 80vh;
	padding-top: 1rem;
	padding-bottom: 3rem;

	@media ${({ theme }) => theme.breakpoints.md} {
		padding-top: 4vh;
		padding-left: 1.5rem;
		padding-right: 1.5rem;
	}
`;

const Wrapper = styled.div`
	display: grid;
	align-items: flex-start;
	max-width: 1050px;
	margin: 0 auto;
	width: 100%;

	@media ${({ theme }) => theme.breakpoints.xl} {
		max-width: 1180px;
	}
`;

const RecommendedPostsContainer = styled(motion.div)`
	display: flex;
	flex-direction: column;
	margin-top: 25px;
	padding-top: 25px;
	height: 100%;
	width: 100%;
	border-top: 1px solid rgba(255, 255, 255, 0.13);

	> span {
		font-size: 1.4rem;
		padding: 0 1rem;
		opacity: 0.65;
	}

	@media ${({ theme }) => theme.breakpoints.md} {
		> span {
			padding: 0;
		}
	}
`;
const RecommendedPostsList = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 5px;
	margin-top: 25px;

	@media ${({ theme }) => theme.breakpoints.md} {
		grid-template-columns: repeat(4, 1fr);
	}
`;

const RecommendedPostCard = styled(CardActionArea)`
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

		${RecommendedPostCard}:hover & {
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
