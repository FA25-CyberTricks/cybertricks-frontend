const env = {
  FE_ORIGIN: process.env.REACT_APP_FE_ORIGIN || window.location.origin,
  BE_ORIGIN: process.env.REACT_APP_BE_ORIGIN || "https://localhost:7229",
};
export default env;
