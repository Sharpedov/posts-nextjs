import { authMiddleware } from "mongodb/middlewares/authMiddleware";
import { clearAuthTokens } from "mongodb/utils/authTokenUtils";

export default authMiddleware(async function handler(req, res) {
	clearAuthTokens(res);
	res.end();
});
