import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { setLoggedUser } from "src/store/slices/authSlice";
import { authFetcher } from "src/utils/authAxiosMethods";
import useSWR from "swr";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

interface IProps {
	children: React.ReactNode;
}

const UserProvider = ({ children }: IProps) => {
	const { data, mutate, error } = useSWR(
		"/api/auth/getLoggedUser",
		authFetcher
	);
	const dispatch = useDispatch();

	useEffect(() => {
		data && !error && dispatch(setLoggedUser(data));
	}, [dispatch, data, error]);

	const memoredValue = useMemo(
		() => ({
			user: data,
			loading: !data && !error,
			mutate,
			isLogged: Boolean(data && !error),
			loggedOut: Boolean(error),
		}),
		[data, error, mutate]
	);

	return (
		<UserContext.Provider value={memoredValue}>{children}</UserContext.Provider>
	);
};

export default UserProvider;
