import { useRouter } from "next/router";
import React, { useEffect } from "react";
import PostDetails from "src/components/post/postDetails";
import styled from "styled-components";
import Head from "next/head";
import useSWR from "swr";
import { fetcher } from "src/utils/fetcher";
import ScaleLoading from "src/components/loading/scaleLoading";
import { useAuth } from "src/components/authProvider";

const PostPage = () => {
	const { redirectIfNotLogged } = useAuth();
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

	useEffect(() => {
		redirectIfNotLogged();
	}, [redirectIfNotLogged]);

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
					{true ? (
						<ScaleLoading center marginTop={40} />
					) : recommendedError ? (
						<div>{recommendedError.message}</div>
					) : (
						<RecommendedPostsContainer>
							{recommendedPosts
								.filter((post) => post._id !== postData._id)
								.map((post) => (
									<div key={post._id}>{post.message}</div>
								))}
						</RecommendedPostsContainer>
					)}
				</Wrapper>
			</MainContainer>
		</>
	);
};

export default PostPage;

const MainContainer = styled.main`
	min-height: 80vh;

	@media ${({ theme }) => theme.breakpoints.md} {
		padding-top: 4vh;
	}
`;

const Wrapper = styled.div`
	display: grid;
	grid-template-rows: minmax(600px, auto) auto;
	align-items: flex-start;
	max-width: 1050px;
	margin: 0 auto;
	width: 100%;

	@media ${({ theme }) => theme.breakpoints.xl} {
		max-width: 1180px;
	}
`;

const RecommendedPostsContainer = styled.div`
	margin-top: 25px;
`;
