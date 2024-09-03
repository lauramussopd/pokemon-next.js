// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'raw.githubusercontent.com',
          port: '',
          pathname: '/PokeAPI/sprites/master/sprites/pokemon/**',  // Updated to match all paths under pokemon
        },
        {
          protocol: 'https',
          hostname: 'pokeapi.co',
          port: '',
          pathname: '/api/v2/pokemon/**',
        },
      ],
    },
  };
  
  export default nextConfig;
  