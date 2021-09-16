import React from "react";
import styled from "styled-components";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import Notification from "./notification";

interface IProps {
	children: React.ReactNode;
}

const mapState = (state) => ({
	notifications: state.notifications.notifications,
});

const NotificationsProvider = ({ children }: IProps) => {
	const { notifications } = useSelector(mapState);

	return (
		typeof window !== "undefined" &&
		createPortal(
			<>
				<>
					<Container>
						<AnimatePresence initial={false}>
							{notifications.map((notification) => (
								<Notification
									key={notification.id}
									id={notification.id}
									message={notification.message}
									time={notification.time}
								/>
							))}
						</AnimatePresence>
					</Container>
				</>
				{children}
			</>,
			document.getElementById("notifications")
		)
	);
};

export default NotificationsProvider;

const Container = styled(motion.div)`
	position: fixed;
	bottom: 20px;
	right: 25px;
	left: 25px;
	z-index: 910;

	@media ${({ theme }) => theme.breakpoints.sm} {
		left: auto;
		width: 325px;
	}
	@media ${({ theme }) => theme.breakpoints.md} {
		bottom: 30px;
		right: 30px;
	}

	@media ${({ theme }) => theme.breakpoints.lg} {
		bottom: 35px;
		right: 35px;
	}
`;
