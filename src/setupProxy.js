const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://z0j52jzpbf.execute-api.ap-south-1.amazonaws.com/sandbox',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '' // Strip '/api' prefix
            },
            onProxyReq: (proxyReq) => {
                // Ensure x-api-key is being set correctly
                proxyReq.setHeader('x-api-key', 'kyVPsZTlNG3jDng67dMZi6wDPuRJmO3y86E4SUaV');
                proxyReq.setHeader('Content-Type', 'application/json'); // Ensure Content-Type is set
            },
            logLevel: 'debug'
        })
    );
};
