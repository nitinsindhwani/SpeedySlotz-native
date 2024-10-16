import { makeRedirectUri } from "expo-auth-session";

export const clientId = "speedyslotsapp";
export const apiKey = "AIzaSyA0lolNAdaUEWUslsIPxKajib9p0kToU1U";

// export const baseApiUrl = "http://192.168.254.52:8080";
// export const baseKeyCloakUrl = "http://192.168.254.52:8280";
// export const baseKeyCloakCompleteUrl =
//   "http://192.168.254.52:8280/realms/speedyslotz-dev/protocol/openid-connect/auth";
// export const keycloakTokenCompleteUrl =
//   "http://192.168.254.52:8280/realms/speedyslotz-dev/protocol/openid-connect/token";

export const baseApiUrl = "https://api.speedyslotz.com"; // Replace this with your actual login API URL
export const baseKeyCloakUrl = "https://keycloak.speedyslotz.com";
export const baseKeyCloakCompleteUrl =
  "https://keycloak.speedyslotz.com/realms/speedyslotz-dev/protocol/openid-connect/auth";
export const keycloakTokenCompleteUrl =
  "https://keycloak.speedyslotz.com/realms/speedyslotz-dev/protocol/openid-connect/token";
