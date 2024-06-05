import { auth } from "express-oauth2-jwt-bearer";
import config from "../config/config";

console.log("audience", config.auth0.audience, "issuer", config.auth0.issuer);

export const checkJwtMiddleware = auth({
  audience: config.auth0.audience,
  issuerBaseURL: config.auth0.issuer,
  tokenSigningAlg: "RS256",
});
