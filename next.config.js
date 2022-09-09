/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Sets the output directory to `dist` rather than `build`. `dist` is an
  // established convention for production build folders. No need to deviate.
  distDir: 'dist',
  // Removes unnecessary `X-Powered-By` HTTP header. It's a small nit, but it
  // a) Unnecessarily identifies the backend stack.
  // b) Sends a few more bytes over the wire for no good reason.
  poweredByHeader: false,
};

module.exports = nextConfig;
