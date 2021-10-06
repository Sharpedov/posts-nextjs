import moment from "moment";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "src/components/customButton";
import UserAvatar from "src/components/user/userAvatar";
import {
	addCommentPost,
	dislikeCommentPost,
	likeCommentPost,
} from "src/store/slices/postsSlice";
import styled from "styled-components";
import Link from "next/link";
import { useInfiniteQuery } from "src/hooks/useInfiniteQuery";
import ScaleLoading from "src/components/loading/scaleLoading";
import CheckIcon from "@material-ui/icons/Check";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import ThumbUpIcon from "@material-ui/icons/ThumbUpAlt";
import CustomIconButton from "src/components/customIconButton";
import { useUser } from "src/components/userProvider";

interface IProps {
	postId: string;
	commentsCount: number;
	creatorUsername: string;
}

const mapState = (state) => ({
	addCommentLoading: state.posts.addComment.loading,
	likeCommentLoading: state.posts.likeComment.loading,
});

const PostComments = ({ postId, commentsCount, creatorUsername }: IProps) => {
	const { user, isLogged } = useUser();
	const { addCommentLoading, likeCommentLoading } = useSelector(mapState);
	const [showMoreComments, setShowMoreComments] = useState<boolean>(false);
	const {
		fetchNextPage,
		fetchedData,
		error,
		isLoadingInitialData,
		isLoadingMore,
		hasNextPage,
		isEmpty,
		mutate,
	} = useInfiniteQuery({
		queryKey: `/api/posts/${postId}/comments?limit=${showMoreComments ? 9 : 3}`,
		authMethod: true,
	});
	const [commentValue, setCommentValue] = useState<string>("");
	const dispatch = useDispatch();
	const observer = useRef(null!);

	const lastItemRef = useCallback(
		(node) => {
			if (isLoadingMore || hasNextPage || !showMoreComments) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && !hasNextPage) {
					fetchNextPage();
				}
			});
			if (node) observer.current.observe(node);
		},
		[isLoadingMore, hasNextPage, fetchNextPage, showMoreComments]
	);

	const handleAddCommentSubmit = useCallback(
		(e) => {
			e.preventDefault();
			if (!postId && !isLogged) return;
			dispatch(
				addCommentPost({
					id: postId,
					message: commentValue.trim(),
					onComplete: () => {
						mutate();
					},
				})
			);
			setCommentValue("");
		},
		[dispatch, postId, commentValue, mutate, isLogged]
	);

	const handleIsCommentLiked = useCallback(
		(likes: String[]) => {
			if (!isLogged) return;
			return likes.find((like) => like === user._id);
		},
		[user, isLogged]
	);

	const handleLikeComment = useCallback(
		(commentId, likes: String[]) => {
			if (!postId && !isLogged) return;
			const isLiked = handleIsCommentLiked(likes);

			if (isLiked)
				return dispatch(
					dislikeCommentPost({
						postId,
						commentId,
						onComplete: () => {
							mutate();
						},
					})
				);

			dispatch(
				likeCommentPost({
					postId,
					commentId,
					onComplete: () => {
						mutate();
					},
				})
			);
		},
		[dispatch, postId, mutate, isLogged, handleIsCommentLiked]
	);

	return (
		<>
			<CommentsRow>
				{error ? (
					<div>{error.message}</div>
				) : isLoadingInitialData ? (
					<ScaleLoading center size="small" />
				) : (
					fetchedData.map(({ user, message, _id, createdAt, likes }) => (
						<Comment key={_id} ref={lastItemRef}>
							<CommentColumn1>
								<Link passHref href={`/profile/${user.username}`}>
									<a href={`/profile/${user.username}`} tabIndex={-1}>
										<UserAvatar
											src={user.avatar}
											username={user.username}
											size={31}
										/>
									</a>
								</Link>
							</CommentColumn1>
							<CommentColumn2>
								<Link passHref href={`/profile/${user.username}`}>
									<h3>
										<a href={`/profile/${user.username}`}>{user.username}</a>
										{creatorUsername === user.username && (
											<CheckIcon className="postCommentsCommentOwner__icon" />
										)}
									</h3>
								</Link>

								<span>{message}</span>
								<CommentInfo>
									<span>{moment(createdAt).fromNow()}</span>
									{likes.length !== 0 && (
										<span>{`${likes.length} ${
											likes.length > 1 ? "likes" : "like"
										}`}</span>
									)}
								</CommentInfo>
							</CommentColumn2>
							<LikeCommentButton>
								<CustomIconButton
									size="verySmall"
									ariaLabel={
										handleIsCommentLiked(likes)
											? "Dislike comment"
											: "Like comment"
									}
									Icon={
										handleIsCommentLiked(likes)
											? ThumbUpIcon
											: ThumbUpAltOutlinedIcon
									}
									onClick={() => handleLikeComment(_id, likes)}
									disabled={likeCommentLoading}
								/>
							</LikeCommentButton>
						</Comment>
					))
				)}
				{!showMoreComments && !isLoadingInitialData && commentsCount > 3 && (
					<ShowMoreCommentsRow>
						<span onClick={() => setShowMoreComments(true)}>
							See all comments: {commentsCount - 3}
						</span>
					</ShowMoreCommentsRow>
				)}
				{isLoadingMore && !isLoadingInitialData && (
					<div
						style={{
							height: "27px",
							margin: "0 auto",
						}}
					>
						<ScaleLoading center size="small" marginBottom={30} />
					</div>
				)}
				{isEmpty ? (
					<div
						style={{
							margin: "0 auto",
						}}
					>
						<TextSpan>This post doesn&apos;t have any comments</TextSpan>
					</div>
				) : (
					hasNextPage && (
						<TextSpan style={{ margin: "10px auto" }}>
							No more comments
						</TextSpan>
					)
				)}
			</CommentsRow>
			<AddCommentForm onSubmit={handleAddCommentSubmit}>
				<CommentTextarea
					aria-label="Add a comment..."
					placeholder="Add a comment..."
					autocomplete="off"
					autocorrect="off"
					value={commentValue}
					onChange={(e) => setCommentValue(e.target.value)}
					maxLength={150}
				/>
				<CustomButton
					size="small"
					variant="default"
					type="submit"
					disabled={!commentValue.trim()}
					loading={addCommentLoading}
				>
					Publish
				</CustomButton>
			</AddCommentForm>
		</>
	);
};

export default PostComments;

const CommentsRow = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	padding: 1rem 1.5rem 0;
	margin: 1rem 0;
	overflow-y: scroll;
	max-height: 325px;
	scrollbar-width: none;
	border-top: 1px solid rgba(255, 255, 255, 0.1);

	&::-webkit-scrollbar {
		display: none;
	}
`;

const Comment = styled.div`
	display: flex;
	align-items: flex-start;
	width: 100%;
	margin-bottom: 16px;

	&:last-of-type {
		margin-bottom: 0px;
	}
`;

const CommentColumn1 = styled.div`
	display: flex;
	margin-right: 12px;
`;

const CommentColumn2 = styled.div`
	display: inline-block;
	flex-shrink: 1;
	flex-grow: 1;
	min-width: 0;

	> h3,
	> span {
		line-height: 1.3;
		font-size: 1.4rem;
		color: ${({ theme }) => theme.colors.color.primary};
	}

	> h3 {
		display: inline-flex;
		margin-right: 7px;
		font-weight: 500;
		cursor: pointer;
		background: ${({ owner }) => owner && ""};

		.postCommentsCommentOwner__icon {
			font-size: 1.4rem;
			margin-left: 3px;
			opacity: 0.65;
		}

		&:hover {
			text-decoration: underline;

			.postCommentsCommentOwner__icon {
				opacity: 1;
			}
		}
	}

	> span {
		font-weight: 300;
		vertical-align: baseline;
		word-wrap: break-word;
	}
`;

const LikeCommentButton = styled.div`
	margin: 5px 0 0 5px;
`;

const AddCommentForm = styled.form`
	display: flex;
	align-items: center;
	flex-grow: 1;
	padding: 1rem 1.5rem 0;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
	color: ${({ theme }) => theme.colors.color.primary};
	gap: 0 5px;
`;

const CommentTextarea = styled.textarea`
	color: inherit;
	background: transparent;
	display: flex;
	flex-grow: 1;
	min-height: 18px;
	max-height: 80px;
	resize: none;
	line-height: 18px;
	font-size: 1.4rem;
`;

const CommentInfo = styled.div`
	display: flex;
	gap: 0 12px;
	color: ${({ theme }) => theme.colors.color.primary};
	margin: 1.1rem 0 0.3rem 0;

	> span {
		font-size: 1.2rem;
		font-weight: 400;
		line-height: 1.4rem;
		opacity: 0.65;
	}
`;

const ShowMoreCommentsRow = styled.div`
	> span {
		color: ${({ theme }) => theme.colors.color.primary};
		font-size: 1.35rem;
		font-weight: 400;
		line-height: 1.4rem;
		opacity: 0.65;
		cursor: pointer;

		&:hover {
			text-decoration: underline;
		}
	}
`;

const TextSpan = styled.span`
	font-size: 1.4rem;
	opacity: 0.65;
`;
