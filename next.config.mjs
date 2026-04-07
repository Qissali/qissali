/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permet d’utiliser STRIPE_PUBLISHABLE_KEY si NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY n’est pas défini (même valeur pk_…).
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY || "",
  },
};

export default nextConfig;
