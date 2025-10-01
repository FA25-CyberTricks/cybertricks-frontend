// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
//   // Proxy cho ASP.NET backend
//   app.use(
//     "/api",
//     createProxyMiddleware({
//       target: "https://localhost:7229",
//       changeOrigin: true,
//       secure: false, // cần nếu dùng HTTPS self-signed
//     })
//   );

  // Proxy cho service khác (ví dụ Node backend)
  app.use(
    "/nodeapi",
    createProxyMiddleware({
      target: "http://localhost:5239",
      changeOrigin: true,
    })
  );
};
