import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "src/components/userProvider";
import { followUser, unfollowUser } from "src/store/slices/userSlice";

interface IProps {
	following?: [string];
	followers: [string];
	username: string;
}

const mapState = (state) => ({
	followLoading: state.user.follow.loading,
	unfollowLoading: state.user.unfollow.loading,
});

export const FollowHelper = ({ following, followers, username }: IProps) => {
	const { user, isLogged } = useUser();
	const { followLoading, unfollowLoading } = useSelector(mapState);
	const dispatch = useDispatch();

	const isFollowing = useMemo(() => {
		if (isLogged && followers) {
			return followers.find((follow) => follow === user._id);
		}
	}, [followers, user, isLogged]);

	const handleFollow = useCallback(() => {
		if (!isLogged) return;
		isFollowing
			? dispatch(unfollowUser({ username }))
			: dispatch(followUser({ username }));
	}, [dispatch, username, isFollowing, isLogged]);

	return {
		isFollowing,
		handleFollow,
		followLoading: followLoading || unfollowLoading,
	};
};
