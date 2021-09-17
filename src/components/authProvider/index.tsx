import { useRouter } from "next/router";
import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedUser } from "src/store/slices/authSlice";
import Cookies from "js-cookie";

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

	useEffect(() => {
		if (
			router.pathname === "/" ||
			router.pathname === "/login" ||
			router.pathname === "/createAccount"
		)
			return;

		!JSON.parse(Cookies.get("isLogged")) && router.push("/");
	}, [isLogged, loading, router]);

	const memoredValue = useMemo(
		() => ({
			user,
			loading,
			isLogged,
		}),
		[user, loading, isLogged]
	);

	return (
		<AuthContext.Provider value={memoredValue}>{children}</AuthContext.Provider>
	);
};

export default AuthProvider;
