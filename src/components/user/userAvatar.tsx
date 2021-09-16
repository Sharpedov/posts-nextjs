import { Avatar } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import SkeletonLoading from "../loading/skeletonLoading";

interface IProps {
	src;
	username;
	size?: number;
	onClick?: () => void;
	loading?: boolean;
	isProfile?: boolean;
}

const UserAvatar = ({
	src,
	username,
	size,
	onClick,
	loading,
	isProfile,
}: IProps) => {
	return loading ? (
		<SkeletonWrapper className={isProfile && "isProfile"}>
			<SkeletonLoading
				style={{ borderRadius: "3px" }}
				width={isProfile ? "100%" : size ? size : 38}
				height={isProfile ? "100%" : size ? size : 38}
			/>
		</SkeletonWrapper>
	) : src ? (
		<StyledAvatar
			alt={`${username} avatar`}
			src={src}
			size={size}
			onClick={onClick}
			className={isProfile && "isProfile"}
		/>
	) : (
		<StyledAvatar
			alt={`${username} avatar`}
			size={size}
			onClick={onClick}
			className={isProfile && "isProfile"}
		>
			{username?.[0]}
		</StyledAvatar>
	);
};

export default UserAvatar;

const SkeletonWrapper = styled.div`
	&.isProfile {
		height: 110px;
		width: 110px;
	}

	@media ${({ theme }) => theme.breakpoints.sm} {
		&.isProfile {
			height: 120px;
			width: 120px;
		}
	}
	@media ${({ theme }) => theme.breakpoints.md} {
		&.isProfile {
			height: 135px;
			width: 135px;
		}
	}
	@media ${({ theme }) => theme.breakpoints.lg} {
		&.isProfile {
			height: 145px;
			width: 145px;
		}
		font-size: 5.5rem;
	}
	@media ${({ theme }) => theme.breakpoints.xl} {
		&.isProfile {
			height: 160px;
			width: 160px;
		}
		font-size: 6rem;
	}
`;

const StyledAvatar = styled(Avatar)`
	border-radius: 3px;
	height: ${({ size }) => (size ? `${size}px` : "38px")};
	width: ${({ size }) => (size ? `${size}px` : "38px")};
	font-size: 2rem;
	cursor: pointer;

	&.isProfile {
		height: 110px;
		width: 110px;
	}

	@media ${({ theme }) => theme.breakpoints.sm} {
		&.isProfile {
			height: 120px;
			width: 120px;
		}
	}
	@media ${({ theme }) => theme.breakpoints.md} {
		&.isProfile {
			height: 135px;
			width: 135px;
		}
	}
	@media ${({ theme }) => theme.breakpoints.lg} {
		&.isProfile {
			height: 145px;
			width: 145px;
			font-size: 5.5rem;
		}
	}
	@media ${({ theme }) => theme.breakpoints.xl} {
		&.isProfile {
			height: 160px;
			width: 160px;
			font-size: 6rem;
		}
	}
`;
