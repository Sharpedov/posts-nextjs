import React, { useMemo } from "react";
import styled from "styled-components";
import Link from "next/link";
import { IconButton } from "@material-ui/core";

interface IProps {
	ariaLabel: string;
	Icon;
	href?: string;
	targetBlank?: boolean;
	onClick?: () => void;
	size?: "verySmall" | "small" | "medium" | "large";
	color?: "white" | "black";
	style?;
	changeColorOnHover?: boolean;
	active?: boolean;
	disabled?: boolean;
	disableFocus?: boolean;
}

const CustomIconButton = ({
	ariaLabel,
	Icon,
	href,
	targetBlank,
	onClick,
	size,
	style,
	changeColorOnHover,
	active,
	disabled,
	disableFocus,
	color,
}: IProps) => {
	const StyledIconButtonElement = useMemo(
		() => (
			<StyledIconButton
				tabIndex={disableFocus && -1}
				aria-label={ariaLabel}
				onClick={onClick}
				size={size}
				style={style}
				changecoloronhover={changeColorOnHover}
				active={active ? 1 : 0}
				disabled={disabled}
				color={color}
			>
				<Icon className="customIconButton__icon" />
			</StyledIconButton>
		),
		[
			Icon,
			ariaLabel,
			style,
			size,
			onClick,
			changeColorOnHover,
			active,
			disabled,
			disableFocus,
			color,
		]
	);

	return href ? (
		<Link passHref href={href}>
			{targetBlank ? (
				<a target="_blank" href={href} rel="noopener noreferrer">
					{StyledIconButtonElement}
				</a>
			) : (
				StyledIconButtonElement
			)}
		</Link>
	) : (
		StyledIconButtonElement
	);
};

export default CustomIconButton;

const StyledIconButton = styled(IconButton)`
	display: grid;
	place-items: center;
	position: relative;
	outline: none;
	border: none;
	background-color: transparent;
	color: ${({ theme, active, color }) =>
		active
			? theme.colors.button.primary
			: color === "black"
			? "rgba(0,0,0,0.85)"
			: theme.colors.color.primary};
	padding: ${({ size }) =>
		size === "verySmall"
			? "4px"
			: size === "small"
			? "5px"
			: size === "medium"
			? "6px"
			: "7px"};
	transition: all 0.2s cubic-bezier(0.61, 1, 0.88, 1);

	.customIconButton__icon {
		color: ${({ theme, active, color }) =>
			active
				? theme.colors.button.primary
				: color === "black"
				? "rgba(0,0,0,0.85)"
				: theme.colors.color.primary};
		font-size: ${({ size }) =>
			size === "verySmall"
				? "2.1rem"
				: size === "small"
				? "2.4rem"
				: size === "medium"
				? "2.8rem"
				: "3rem"};
		transition: all 0.15s ease;
	}

	&:hover {
		background: rgba(255, 255, 255, 0.1);
		color: ${({ changecoloronhover, theme }) =>
			changecoloronhover && theme.colors.button.primary};
		.customIconButton__icon {
			color: ${({ changecoloronhover, theme }) =>
				changecoloronhover && theme.colors.button.primary};
		}

		&::after {
			transform: scale(1.2);
			opacity: 0.8;
		}
	}
	&:active {
		&::after {
			opacity: 0.7;
		}
	}
`;
