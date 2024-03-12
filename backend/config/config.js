const env = process.env.NODE_ENV_PROFILE || "local";

if (env === "production" || env === "test"|| env === "local") {
  const config = require("./config.json");
  const envConfig = config[env];
  console.log("Profile utilisé : " + env);
  console.log(envConfig);

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}
