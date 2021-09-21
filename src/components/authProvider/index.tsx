import { useRouter } from "next/router";
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedUser } from "src/store/slices/authSlice";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

interface IProps {
	children: React.ReactNode;
}

const mapState = (state) => ({
	authUser: state.auth.user,
	authLoading: state.auth.loading,
	authError: state.auth.error,
});

const AuthProvider = ({ children }: IProps) => {
	const { authUser, authLoading, authError } = useSelector(mapState);
	const [user, setUser] = useState(authUser);
	const [loading, setLoading] = useState<boolean>(true);
	const [isLogged, setIsLogged] = useState<boolean>(false);
	const dispatch = useDispatch();
	const router = useRouter();

	useEffect(() => {
		setIsLogged(authUser && !authLoading && !authError ? true : false);
		setUser(authUser ?? null);
		setLoading(authLoading);
	}, [authUser, authLoading, authError]);

	useEffect(() => {
		!authUser && dispatch(getLoggedUser());
	}, [dispatch, authUser]);

	const redirectIfNotLogged = useCallback(
		(redirectTo) => {
			!user && authError && !loading && router.push(redirectTo ?? "/");
		},
		[router, user, loading, authError]
	);

	const memoredValue = useMemo(
		() => ({
			user,
			loading,
			isLogged,
			redirectIfNotLogged,
		}),
		[user, loading, isLogged, redirectIfNotLogged]
	);

	return (
		<AuthContext.Provider value={memoredValue}>{children}</AuthContext.Provider>
	);
};

export default AuthProvider;
