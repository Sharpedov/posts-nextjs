import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { removeNotification } from "src/store/slices/notificationsSlice";
import styled from "styled-components";

interface IProps {
	id;
	message: string;
	time?: number;
}

const Notification = ({ id, message, time }: IProps) => {
	const [timeoutID, setTimeoutID] = useState(null);
	const dispatch = useDispatch();

	useMemo(() => {
		const timeout = setTimeout(() => {
			dispatch(removeNotification(id));
		}, time ?? 2000);

		setTimeoutID(timeout);
	}, [dispatch, id, time]);

	useEffect(() => {
		return () => clearTimeout(timeoutID);
	}, [timeoutID]);

	return (
		<NotificationContainer
			layout
			initial={{ opacity: 0, y: 150 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{
				opacity: 0,
				y: 150,
				transition: { duration: 0.2 },
			}}
		>
			{message}
		</NotificationContainer>
	);
};

export default Notification;

const NotificationContainer = styled(motion.div)`
	background-color: #fff;
	border-radius: 3px;
	width: 100%;
	padding: 1.25rem 2rem;
	color: #000;
	margin-top: 12px;
	font-size: 1.6rem;
	font-family: ${({ theme }) => theme.fonts.title};

	@media ${({ theme }) => theme.breakpoints.lg} {
		margin-top: 15px;
	}
`;
