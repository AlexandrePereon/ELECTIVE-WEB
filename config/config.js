import config from './config.json' assert { type: 'json' };

const env = process.env.NODE_ENV_PROFILE || "local";

if (env === "production" || env === "test"|| env === "local") {
  const envConfig = config[env];

  console.log("-----  Configuration  -----");
  console.log("Profil utilisé : " + env);
  console.log("Port : " + envConfig.PORT);
  console.log("BaseURL : " + envConfig.BASE_URI);
  console.log("BaseENDPOINT : " + envConfig.BASE_ENDPOINT);
  console.log("---------------------------");

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}
