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
});

const AuthProvider = ({ children }: IProps) => {
	const { authUser, authLoading } = useSelector(mapState);
	const [user, setUser] = useState(authUser);
	const [loading, setLoading] = useState<boolean>(true);
	const [isLogged, setIsLogged] = useState<boolean>(false);
	const dispatch = useDispatch();
	const router = useRouter();

	useEffect(() => {
		setIsLogged(authUser ? true : false);
		setUser(authUser ?? null);
		setLoading(authLoading);
	}, [authUser, authLoading]);

	useEffect(() => {
		dispatch(getLoggedUser());
	}, [dispatch]);

	const redirectIfLogged = useCallback(
		(href?: string) => isLogged && !loading && router.push(href ?? "/home"),
		[isLogged, loading, router]
	);

	const redirectIfNotLogged = useCallback(
		(href?: string) => !isLogged && !loading && router.push(href ?? "/"),
		[isLogged, loading, router]
	);

	const memoredValue = useMemo(
		() => ({
			user,
			loading,
			isLogged,
			redirectIfLogged,
			redirectIfNotLogged,
		}),
		[user, loading, isLogged, redirectIfLogged, redirectIfNotLogged]
	);

	return (
		<AuthContext.Provider value={memoredValue}>{children}</AuthContext.Provider>
	);
};

export default AuthProvider;
