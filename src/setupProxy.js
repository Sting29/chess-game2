// const { createProxyMiddleware } = require("http-proxy-middleware");

// module.exports = function (app) {
//   // Проксируем все запросы к API серверу
//   app.use(
//     "/api-proxy",
//     createProxyMiddleware({
//       target: process.env.REACT_APP_API_BASE_URL,
//       // target: "http://167.99.40.216:3000",
//       changeOrigin: true,
//       pathRewrite: {
//         "^/api-proxy": "", // убираем /api-proxy при перенаправлении
//       },
//       logLevel: "debug",
//     })
//   );
// };
