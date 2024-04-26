/** @type {import('next').NextConfig} */

import dotenv from "dotenv";

const { parsed: myEnv } = dotenv.config({
  path: ".env",
});

const nextConfig = {
  output: "standalone",
  env: myEnv,
};

export default nextConfig;
