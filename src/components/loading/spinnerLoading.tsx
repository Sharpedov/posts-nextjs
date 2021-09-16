import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import styled from "styled-components";

interface IProps {
	size: number;
}

const SpinnerLoading = ({ size }: IProps) => {
	return <Spinner size={size} />;
};

export default SpinnerLoading;

const Spinner = styled(CircularProgress)`
	color: ${({ theme }) => theme.colors.loading.primary};
	opacity: 0.8;
`;
