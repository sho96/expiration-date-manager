/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/manage/dashboard",
        permanent: true,
      },
    ];
  }
};

export default nextConfig;
