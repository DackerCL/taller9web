// Ruta de inicio de sesión (/api/login - Paso 4)
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usuarios = require("../datos/usuarios");

const router = express.Router();

// Autentica credenciales y emite el token JWT
router.post("/", async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ error: "Debes enviar username y password" });
  }

  const usuarioEncontrado = usuarios.find((u) => u.username === username);
  const passwordValida = usuarioEncontrado ? await bcrypt.compare(password, usuarioEncontrado.passwordHash) : false;

  if (!passwordValida) {
    return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
  }

  const token = jwt.sign(
    { id: usuarioEncontrado.id, username: usuarioEncontrado.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRA || "1h" }
  );

  res.json({ token, id: usuarioEncontrado.id, username: usuarioEncontrado.username });
});

module.exports = router;
