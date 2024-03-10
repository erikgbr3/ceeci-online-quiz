const secret = process.env.NEXTAUTH_SECRET;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otras configuraciones de Next.js aquí, si las tienes

  // Configuración de NextAuth.js
  env: {
    NEXTAUTH_SECRET: secret
  }
};


export default nextConfig;
