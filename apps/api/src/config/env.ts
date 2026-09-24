const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET est manquant dans le fichier .env. Le serveur ne peut pas démarrer.');
}

export const JWT_SECRET: string = jwtSecret;
