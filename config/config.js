// Default port if port is not specified in dotenv
const defaultPort = 8080;

// Port to listen on
export const port = process.env.PORT || defaultPort;

// MongoDB URI
export const mongodbUri = process.env.MONGODB_URI;

// API prefixes
export const apiPrefixes = {
  adminApi: "/api/v1",
  userApi: "/api/v2",
  riderApi: "/api/v3",
};
