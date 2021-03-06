import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "src/components/userProvider";
import { dislikePost, likePost } from "src/store/slices/postsSlice";

interface IPostLikeHandler {
	likes: [];
}
interface ILikeHandler {
	postId;
	onComplete?: () => void;
}

const mapState = (state) => ({
	likePostLoading: state.posts.like.loading,
	dislikePostLoading: state.posts.dislike.loading,
});

export const PostHelper = ({ likes }: IPostLikeHandler) => {
	const { likePostLoading, dislikePostLoading } = useSelector(mapState);
	const { user, isLogged } = useUser();
	const dispatch = useDispatch();

	const isLikedFilter = useMemo(() => {
		if (likes.length > 0 && isLogged) {
			return likes.find((like) => like === user._id) ? true : false;
		}
		return;
	}, [likes, user, isLogged]);

	const handleLikePost = useCallback(
		({ postId, onComplete }: ILikeHandler) => {
			if (isLogged) {
				return isLikedFilter
					? dispatch(dislikePost({ id: postId, onComplete }))
					: dispatch(likePost({ id: postId, onComplete }));
			}
		},
		[dispatch, isLogged, isLikedFilter]
	);

	return {
		isLiked: isLikedFilter,
		handleLikePost,
		loading: likePostLoading || dislikePostLoading,
	};
};
