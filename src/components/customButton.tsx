import { Button } from "@material-ui/core";
import React, { useMemo } from "react";
import styled from "styled-components";
import Link from "next/link";
import SpinnerLoading from "./loading/spinnerLoading";

interface IProps {
	variant?: "default" | "contained";
	children: React.ReactNode;
	href?: string;
	color?: "primary" | "secondary" | "white" | "red";
	onClick?: () => void;
	type?: string;
	fullWidth?: boolean;
	disabled?: boolean;
	loading?: boolean;
	size?: "small" | "medium" | "large";
	style?;
	onKeyPress?;
	targetBlank?: boolean;
}

const CustomButton = ({
	children,
	href,
	color,
	onClick,
	type,
	fullWidth,
	disabled,
	loading,
	size,
	style,
	onKeyPress,
	variant,
	targetBlank,
}: IProps) => {
	const ButtonElement = useMemo(() => {
		switch (variant) {
			case "default": {
				return (
					<StyledDefaultButton
						disabled={disabled || loading}
						variant="default"
						onClick={onClick}
						color={color}
						type={type}
						fullWidth={fullWidth}
						size={size}
						style={style}
						onKeyPress={onKeyPress}
					>
						{loading ? (
							<SpinnerLoading
								size={size === "small" ? 24 : size === "medium" ? 28 : 32}
							/>
						) : (
							children
						)}
					</StyledDefaultButton>
				);
			}
			case "contained": {
				<StyledContainedButton
					disabled={disabled || loading}
					variant="contained"
					onClick={onClick}
					color={color}
					type={type}
					fullWidth={fullWidth}
					size={size}
					style={style}
					onKeyPress={onKeyPress}
				>
					{loading ? (
						<SpinnerLoading
							size={size === "small" ? 24 : size === "medium" ? 28 : 32}
						/>
					) : (
						children
					)}
				</StyledContainedButton>;
			}
			default:
				return (
					<StyledContainedButton
						disabled={disabled || loading}
						variant="contained"
						onClick={onClick}
						color={color}
						type={type}
						fullWidth={fullWidth}
						size={size}
						style={style}
						onKeyPress={onKeyPress}
					>
						{loading ? (
							<SpinnerLoading
								size={size === "small" ? 24 : size === "medium" ? 28 : 32}
							/>
						) : (
							children
						)}
					</StyledContainedButton>
				);
		}
	}, [
		color,
		disabled,
		type,
		fullWidth,
		size,
		style,
		onClick,
		loading,
		children,
		onKeyPress,
		variant,
	]);

	return href ? (
		<Link passHref href={href}>
			{targetBlank ? (
				<a target="_blank" href={href} rel="noopener noreferrer">
					{ButtonElement}
				</a>
			) : (
				ButtonElement
			)}
		</Link>
	) : (
		ButtonElement
	);
};

export default CustomButton;

const StyledButton = styled(Button)`
	height: ${({ size }) =>
		size === "small" ? "32px" : size === "medium" ? "38px" : "44px"};
	font-size: ${({ size }) =>
		size === "small" ? "1.5rem" : size === "medium" ? "1.5rem" : "1.6rem"};
	text-transform: none;
	padding: 0 1.5rem;
	border-radius: 3px;
	color: ${({ theme }) => theme.colors.color.primary};
	transition: all 0.2s ease;
	font-weight: 400;

	&:disabled {
		background-color: rgba(0, 0, 0, 0.3);
		border-color: rgba(0, 0, 0, 0.3);
		color: rgba(255, 255, 255, 0.65);

		&:after {
			background-color: rgba(0, 0, 0, 0.3);
		}
	}
`;

const StyledDefaultButton = styled(StyledButton)`
	position: relative;
	color: ${({ theme, color }) =>
		color === "secondary"
			? theme.colors.button.secondary
			: color === "white"
			? theme.colors.button.white
			: color === "red"
			? theme.colors.button.red
			: theme.colors.button.primary};
	overflow: hidden;

	&::after {
		content: "";
		position: absolute;
		inset: 0;
		opacity: 0;
		pointer-events: none;
		background: ${({ theme, color }) =>
			color === "secondary"
				? theme.colors.button.secondary
				: color === "white"
				? theme.colors.button.white
				: color === "red"
				? theme.colors.button.red
				: theme.colors.button.primary};
		transition: opacity 0.2s ease;
	}

	&:hover {
		&::after {
			opacity: 0.1;
		}
	}
`;

const StyledContainedButton = styled(StyledButton)`
	background: ${({ theme, color }) =>
		color === "secondary"
			? theme.colors.button.secondary
			: color === "white"
			? theme.colors.button.white
			: color === "red"
			? theme.colors.button.red
			: theme.colors.button.primary};

	&:hover {
		background: ${({ theme, color }) =>
			color === "secondary"
				? theme.colors.button.secondary
				: color === "white"
				? theme.colors.button.white
				: color === "red"
				? theme.colors.button.red
				: theme.colors.button.primary};
		filter: brightness(1.09);
	}
`;
