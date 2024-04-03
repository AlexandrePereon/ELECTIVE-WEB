export default async function isMarketingMiddleware(req, res, next) {
  const { role } = req.body.userData;

  if (role === 'marketing') {
    next();
  } else {
    res.status(403).send("Vous n'avez pas le rôle nécessaire pour accéder à cette ressource.");
  }
}
