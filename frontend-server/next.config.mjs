/** @type {import('next').NextConfig} */

import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

const config = dotenv.config({
  path: ".env",
});

const { parsed: myEnv } = dotenvExpand.expand(config);

const nextConfig = {
  output: "standalone",
  env: myEnv,
  compiler: {
    removeConsole: false,
  },
};

export default nextConfig;
