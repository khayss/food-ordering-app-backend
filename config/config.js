// Default port if port is not specified in dotenv
const defaultPort = 8080;

// Port to listen on
export const port = process.env.PORT || defaultPort;

// MongoDB URI
export const mongodbUri = process.env.MONGODB_URI;

// JWT secret
export const jwtSecret = process.env.JWT_SECRET;

// JWT expiration
export const jwtExpiration = 24 * 60 * 60;

// API prefixes
export const apiPrefix = "/api/v1/";
export const apiPrefixes = {
  generalApi: apiPrefix + "app",
  adminApi: apiPrefix + "admin",
  userApi: apiPrefix + "user",
  riderApi: apiPrefix + "rider",
};
