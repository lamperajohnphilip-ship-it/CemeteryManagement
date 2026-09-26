/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/cemetery-overview',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
