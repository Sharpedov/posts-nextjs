import React, { useMemo } from "react";
import styled from "styled-components";
import UserAvatar from "src/components/user/userAvatar";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "src/components/userProvider";
import useSWR from "swr";
import { fetcher } from "src/utils/fetcher";
import CustomButton from "src/components/customButton";
import { FollowHelper } from "src/utils/followHelper";

interface IProps {
	children: React.ReactNode;
	profileName;
}

const profileNavData = [
	{ title: "Overview", href: "" },
	{ title: "Following", href: "/following" },
	{ title: "Followers", href: "/followers" },
];

const ProfileTemplate = ({ profileName, children }: IProps) => {
	const { pathname, push } = useRouter();
	const { user, loading, isLogged } = useUser();

	const { data: dataProfile, error: errorProfile } = useSWR(
		!!profileName &&
			profileName !== user?.username &&
			`/api/users/${profileName}`,
		fetcher
	);

	const profileData = useMemo(() => {
		switch (profileName) {
			case user?.username: {
				return {
					...user,
					loading,
				};
			}
			default: {
				return {
					...dataProfile?.user,
					loading: !dataProfile,
				};
			}
		}
	}, [loading, profileName, user, dataProfile]);

	const { isFollowing, handleFollow, followLoading } = FollowHelper({
		followers: profileData.followers,
		username: profileName,
	});

	if (errorProfile) {
		push("/404");

		return null;
	}

	const childrenWithProps = React.Children.map(children, (child) => {
		if (React.isValidElement(child)) {
			return React.cloneElement(child, { profileName, profileData });
		}
		return child;
	});

	return (
		<Container>
			<BannerContainer banner={profileData?.banner}>
				<BannerWrapper>
					<BannerContent>
						<UserAvatar
							src={profileData.avatar}
							username={profileData.username}
							loading={profileData.loading}
							isProfile
						/>

						{profileData.loading ? null : (
							<Username>{profileData.username}</Username>
						)}
						<BannerActions>
							{profileData.loading || !isLogged
								? null
								: user.username! !== profileName && (
										<CustomButton
											size="small"
											color={isFollowing ? "secondary" : "primary"}
											onClick={handleFollow}
											disabled={loading}
											loading={followLoading}
										>
											{isFollowing ? "Unfollow" : "Follow"}
										</CustomButton>
								  )}
						</BannerActions>
					</BannerContent>
				</BannerWrapper>
			</BannerContainer>
			<NavContainer>
				<NavWrapper>
					{profileNavData.map((el) => (
						<Link
							key={`${el.title}-${el.href}`}
							href={`/profile/${profileName}${el.href}`}
							passHref
						>
							<NavLink
								className={
									pathname === `/profile/[profileName]${el.href}` && "active"
								}
							>
								{el.title}
							</NavLink>
						</Link>
					))}
				</NavWrapper>
			</NavContainer>
			<ContentContainer>{childrenWithProps}</ContentContainer>
		</Container>
	);
};

export default ProfileTemplate;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	min-height: 80vh;
`;

const BannerContainer = styled.div`
	position: relative;
	width: 100%;
	background-image: ${({ banner }) => `url(${banner})`};
	background-color: #242538;
	background-position: 50% 35%;
	background-repeat: no-repeat;
	background-size: cover;
	height: clamp(190px, 50vw, 330px);
	z-index: 1;
	margin-top: -44px;

	&::before {
		content: "";
		position: absolute;
		inset: 0;
		background: linear-gradient(
			180deg,
			rgba(6, 13, 34, 0) 40%,
			rgba(6, 13, 34, 0.6)
		);
		height: 100%;
		left: 0;
		position: absolute;
		top: 0;
		width: 100%;
		z-index: -1;
	}

	@media ${({ theme }) => theme.breakpoints.lg} {
		margin-top: -64px;
	}
`;

const BannerWrapper = styled.div`
	display: flex;
	flex-basis: 100%;
	height: 100%;
	background: transparent;
	align-items: flex-end;
	padding: 0 1.5rem;

	@media ${({ theme }) => theme.breakpoints.md} {
		padding: 0 2rem;
	}
`;

const BannerContent = styled.div`
	display: flex;
	align-items: flex-end;
	max-width: 1050px;
	width: 100%;
	margin: 0 auto;

	@media ${({ theme }) => theme.breakpoints.xl} {
		max-width: 1180px;
	}
`;

const BannerActions = styled.div`
	display: flex;
	flex-grow: 1;
	align-items: flex-end;
	justify-content: flex-end;
	padding: 1.2rem 0;

	@media ${({ theme }) => theme.breakpoints.md} {
		padding: 1.5rem 0;
	}
`;

const Username = styled(motion.span)`
	font-weight: 700;
	font-size: 1.75rem;
	text-shadow: 0 0px 3px rgba(0, 0, 0, 0.7);
	padding: 1.2rem 2rem;

	@media ${({ theme }) => theme.breakpoints.md} {
		font-size: 1.9rem;
		padding: 1.5rem 2.5rem;
	}
`;

const NavContainer = styled.div`
	display: flex;
	height: 46px;
	background: ${({ theme }) => theme.colors.background.secondary};
	padding: 0 1.5rem;
	overflow-x: scroll;

	&::-webkit-scrollbar {
		display: none;
	}
`;

const NavWrapper = styled.div`
	display: flex;
	justify-content: center;
	max-width: 1050px;
	width: 100%;
	height: 100%;
	margin: 0 auto;

	@media ${({ theme }) => theme.breakpoints.xl} {
		max-width: 1180px;
	}
`;

const NavLink = styled.div`
	display: grid;
	place-items: center;
	padding: 0 1.5rem;
	margin: 0 1rem;
	transition: all 0.15s ease-out;
	color: ${({ theme }) => theme.colors.color.secondary};
	cursor: pointer;
	font-size: 1.3rem;
	font-weight: 600;
	opacity: 0.9;

	&.active {
		color: ${({ theme }) => theme.colors.button.secondary};
		opacity: 1;
	}
`;

const ContentContainer = styled.div`
	padding: 1rem 0 3rem;
	min-height: 50vh;

	@media ${({ theme }) => theme.breakpoints.md} {
		padding: 3rem 2rem 2rem;
	}
`;
