import React, { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { useAuth } from "../authProvider";
import { userDropdownData } from "src/data/navbarData";
import Link from "next/link";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { logout } from "src/store/slices/authSlice";
import { useDispatch } from "react-redux";

interface IProps {
	isOpen: boolean;
	onClose: () => void;
}

const dropdownMenuVariants = {
	hidden: {
		opacity: 0,
		y: "20px",
	},
	visible: {
		opacity: 1,
		y: "0px",
	},
	exit: {
		opacity: 0,
		y: "12px",
		transition: { duration: 0.15 },
	},
};

const UserDropdownMenu = ({ isOpen, onClose }: IProps) => {
	const dropdownMenuRef = useRef<HTMLElement>(null);
	const { user, isLogged } = useAuth();
	const dispatch = useDispatch();

	const escapeListener = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		},
		[onClose]
	);

	useEffect(() => {
		const pageClickEvent = (e) => {
			if (
				dropdownMenuRef.current !== null &&
				!dropdownMenuRef.current.contains(e.target)
			) {
				onClose();
			}
		};

		if (isOpen) {
			window.addEventListener("click", pageClickEvent);
			document.addEventListener("keydown", escapeListener);
		}

		return () => {
			window.removeEventListener("click", pageClickEvent);
			document.addEventListener("keydown", escapeListener);
		};
	}, [isOpen, dropdownMenuRef, escapeListener, onClose]);

	return (
		<AnimatePresence>
			{isOpen && isLogged && (
				<DropdownMenu
					ref={dropdownMenuRef}
					variants={dropdownMenuVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
				>
					<LinksList>
						{userDropdownData.map((item, i) =>
							item.href ? (
								<Link
									key={`${i}-${item.title}`}
									passHref
									href={
										item.href === "/profile"
											? `${item.href}/${user.username}`
											: item.href
									}
								>
									<LinkItem component="li" onClick={onClose}>
										<item.icon className="userDropdownMenuLinkItem__icon" />
										{item.title}
									</LinkItem>
								</Link>
							) : (
								<LinkItem
									key={`${i}-${item.title}`}
									component="li"
									onClick={onClose}
								>
									<item.icon className="userDropdownMenuLinkItem__icon" />
									{item.title}
								</LinkItem>
							)
						)}
					</LinksList>
					<Bottom>
						<BottomGrid>
							<BottomButton onClick={() => dispatch(logout())}>
								<ExitToAppIcon className="userDropdownMenuBottomLink__icon" />
								Logout
							</BottomButton>
						</BottomGrid>
					</Bottom>
				</DropdownMenu>
			)}
		</AnimatePresence>
	);
};

export default UserDropdownMenu;

const DropdownMenu = styled(motion.div)`
	position: absolute;
	top: 100%;
	right: 0;
	transform: translateY(7px);
	background: ${({ theme }) => theme.colors.background.secondary};
	box-shadow: ${({ theme }) => theme.boxShadow.primary};
	border-radius: 3px;
	width: 200px;
	overflow: hidden;
`;

const LinksList = styled.ul`
	display: flex;
	flex-direction: column;
	background: ${({ theme }) => `${theme.colors.background.secondary + "b1"}`};
	padding: 2rem 2.7rem;
	gap: 18px 0;
`;

const LinkItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	color: ${({ theme }) => theme.colors.color.secondary};
	opacity: 0.9;
	text-transform: none;
	font-size: 1.35rem;
	font-weight: 600;
	border-radius: 0;
	width: 100%;
	cursor: pointer;
	transition: all 0.1s ease;

	.userDropdownMenuLinkItem__icon {
		font-size: 1.9rem;
		fill: ${({ theme }) => theme.colors.color.secondary};
		margin-right: 10px;
	}

	&:hover {
		opacity: 0.9;
		filter: brightness(1.175);
	}
`;

const Bottom = styled.div`
	display: flex;
	align-items: center;
	background: ${({ theme }) => theme.colors.background.primary};
	color: ${({ theme }) => theme.colors.color.secondary};
	padding: 1.6rem 2.7rem;
`;

const BottomGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	width: 100%;
	grid-gap: 10px;
`;

const BottomButton = styled.div`
	display: flex;
	align-items: center;
	font-size: 1.25rem;
	font-weight: 600;
	cursor: pointer;
	opacity: 0.85;
	transition: all 0.1s ease;

	.userDropdownMenuBottomLink__icon {
		font-size: 1.5rem;
		margin-right: 5px;
	}

	&:hover {
		opacity: 0.9;
		filter: brightness(1.175);
	}
`;
