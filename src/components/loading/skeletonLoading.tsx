import React from "react";
import styled from "styled-components";
import { Skeleton } from "@material-ui/lab";

interface IProps {
	variant?: "text" | "rect" | "circle";
	height?;
	width?;
	style?;
}

const SkeletonLoading = ({ variant, height, width, style }: IProps) => {
	return (
		<StyledSkeleton
			variant={variant ? variant : "rect"}
			animation="wave"
			height={height}
			width={width}
			style={style}
		/>
	);
};

export default SkeletonLoading;

const StyledSkeleton = styled(Skeleton)`
	background: ${({ theme }) => theme.colors.skeleton.primary};
	height: inherit;
	width: inherit;
`;
