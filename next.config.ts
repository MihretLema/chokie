import type { NextConfig } from "next";
const config: NextConfig = {
  serverExternalPackages:['@node-rs/argon2','pg','@prisma/adapter-pg'],
  async headers(){const development=process.env.NODE_ENV==='development';return [{source:'/:path*',headers:[{key:'X-Content-Type-Options',value:'nosniff'},{key:'X-Frame-Options',value:'DENY'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},{key:'Content-Security-Policy',value:`default-src 'self'; script-src 'self' 'unsafe-inline'${development?" 'unsafe-eval'":''}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'${development?' ws://127.0.0.1:* ws://localhost:*':''}; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`},...(!development?[{key:'Strict-Transport-Security',value:'max-age=31536000'}]:[])]}]},
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};
export default config;
