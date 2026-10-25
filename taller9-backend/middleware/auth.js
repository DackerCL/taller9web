// Middleware de autenticación (Paso 5)
const jwt = require("jsonwebtoken");

/**
 * Middleware para validar el token JWT enviado en el header Authorization.
 * Si es válido, inyecta los datos del usuario en req.usuario.
 */
const verificarToken = (req, res, next) => {
  const encabezadoAuth = req.get("Authorization");

  if (!encabezadoAuth || !encabezadoAuth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }

  // Se extrae la cadena del token después de 'Bearer '
  const token = encabezadoAuth.slice(7).trim();
  req.usuario = jwt.verify(token, process.env.JWT_SECRET);
  next();
};

module.exports = verificarToken;
