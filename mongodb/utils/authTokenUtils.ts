import jwt from "jsonwebtoken";
import cookie from "cookie";

interface IAccessTokenPayload {
	userId: string;
}

interface IRefreshTokenPayload {
	userId: string;
	version: number;
}

enum TokenExpiration {
	Access = 30 * 60,
	Refresh = 30 * 24 * 60 * 60,
}

const defaultCookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV !== "development",
	sameSite: "strict",
	path: "/",
};

function signAccessToken(payload: IAccessTokenPayload) {
	return jwt.sign(payload, process.env.AUTH_ACCESS_TOKEN_SECRET, {
		expiresIn: TokenExpiration.Access,
	});
}

function signRefreshToken(payload: IRefreshTokenPayload) {
	return jwt.sign(payload, process.env.AUTH_REFRESH_TOKEN_SECRET, {
		expiresIn: TokenExpiration.Refresh,
	});
}

export function buildAuthTokens(user) {
	const accessPayload: IAccessTokenPayload = { userId: user._id };
	const refreshPayload: IRefreshTokenPayload = {
		userId: user._id,
		version: user.tokenVersion,
	};

	const accessToken = signAccessToken(accessPayload);
	const refreshToken = signRefreshToken(refreshPayload);

	return { accessToken, refreshToken };
}

export function setAuthTokens(res, access: string, refresh?: string) {
	res.setHeader("Set-Cookie", [
		cookie.serialize("auth_access", access, {
			...defaultCookieOptions,
			maxAge: TokenExpiration.Access,
		}),
		refresh &&
			cookie.serialize("auth_refresh", refresh, {
				...defaultCookieOptions,
				maxAge: TokenExpiration.Refresh,
			}),
	]);
}

export function verifyAccessToken(token: string) {
	return jwt.verify(token, process.env.AUTH_ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(token: string) {
	return jwt.verify(token, process.env.AUTH_REFRESH_TOKEN_SECRET);
}

export function refreshTokens(currentToken, tokenVersion: number) {
	if (tokenVersion !== currentToken.version) throw "Token revoked";

	const accessToken = signAccessToken({ userId: currentToken.userId });

	let refreshPayload: IRefreshTokenPayload | undefined;
	const expiration = new Date(currentToken.exp);
	const secondsUntilExpiration =
		expiration.getTime() - new Date().getTime() / 1000;

	if (TokenExpiration.Refresh > secondsUntilExpiration) {
		refreshPayload = { userId: currentToken.userId, version: tokenVersion };
	}
	const refreshToken = refreshPayload && signRefreshToken(refreshPayload);

	return { accessToken, refreshToken };
}

export function clearAuthTokens(res) {
	res.setHeader("Set-Cookie", [
		cookie.serialize("auth_access", "", {
			...defaultCookieOptions,
			maxAge: 0,
		}),
		cookie.serialize("auth_refresh", "", {
			...defaultCookieOptions,
			maxAge: 0,
		}),
	]);
}
