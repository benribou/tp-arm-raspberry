import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(
        "serialport",
        "@serialport/bindings-cpp",
        "@serialport/parser-readline"
      );
    }
    return config;
  },
  /* autres options de config ici */
};

export default nextConfig;