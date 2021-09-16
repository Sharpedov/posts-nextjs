import React from "react";
import styled from "styled-components";
import { LinearProgress } from "@material-ui/core";

interface IProps {
	progress?: number;
}

const LinearLoading = ({ progress }: IProps) => {
	return progress ? (
		<Linear variant="determinate" value={progress} />
	) : (
		<Linear />
	);
};

export default LinearLoading;

const Linear = styled(LinearProgress)`
	position: absolute;
	top: 0px;
	left: 0;
	right: 0;
	background: ${({ theme }) => `${theme.colors.background.secondary}`};
	border-radius: 3px 3px 0 0;

	> div {
		background: ${({ theme }) => theme.colors.button.primary};
	}
`;
