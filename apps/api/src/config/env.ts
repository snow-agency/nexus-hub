export const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET est manquant dans le fichier .env. Le serveur ne peut pas démarrer.');
}
