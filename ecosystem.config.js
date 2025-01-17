module.exports = {
  apps: [
    {
      name: "Connectify",
      script: "./dist/src/server.js",
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
