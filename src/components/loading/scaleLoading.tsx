import React from "react";
import styled from "styled-components";

interface IProps {
	marginTop?: number;
	marginBottom?: number;
	center?: boolean;
}

const ScaleLoading = ({ marginTop, marginBottom, center }: IProps) => {
	return (
		<Spinner
			style={{
				marginTop,
				marginBottom,
				marginLeft: center ? "auto" : 0,
				marginRight: center ? "auto" : 0,
			}}
		>
			<div className="rect1"></div>
			<div className="rect2"></div>
			<div className="rect3"></div>
			<div className="rect4"></div>
			<div className="rect5"></div>
		</Spinner>
	);
};

export default ScaleLoading;

const Spinner = styled.div`
	width: 70px;
	height: 50px;
	text-align: center;
	font-size: 10px;

	& > div {
		display: inline-block;
		background: ${({ theme }) => theme.colors.loading.secondary};
		height: 100%;
		width: 4px;
		margin-right: 5px;
		-webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
		animation: sk-stretchdelay 1.2s infinite ease-in-out;
	}

	& .rect2 {
		-webkit-animation-delay: -1.1s;
		animation-delay: -1.1s;
	}

	& .rect3 {
		-webkit-animation-delay: -1s;
		animation-delay: -1s;
	}

	& .rect4 {
		-webkit-animation-delay: -0.9s;
		animation-delay: -0.9s;
	}

	& .rect5 {
		-webkit-animation-delay: -0.8s;
		animation-delay: -0.8s;
	}

	@-webkit-keyframes sk-stretchdelay {
		0%,
		40%,
		100% {
			-webkit-transform: scaleY(0.4);
		}
		20% {
			-webkit-transform: scaleY(1);
		}
	}

	@keyframes sk-stretchdelay {
		0%,
		40%,
		100% {
			transform: scaleY(0.4);
			-webkit-transform: scaleY(0.4);
		}
		20% {
			transform: scaleY(1);
			-webkit-transform: scaleY(1);
		}
	}
`;
