// Rutas de usuarios (/api/usuarios - Pasos 3, 5 y Desafío 2)
const express = require("express");
const bcrypt = require("bcryptjs");
const usuarios = require("../datos/usuarios");
const verificarToken = require("../middleware/auth");

const router = express.Router();

// Paso 3: Registro de un nuevo usuario
router.post("/", async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ error: "Debes enviar username y password" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });
  }

  const nombreOcupado = usuarios.some((u) => u.username === username);
  if (nombreOcupado) {
    return res.status(409).json({ error: "El nombre de usuario ya existe" });
  }

  const nuevoUsuario = {
    id: usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1,
    username,
    passwordHash: await bcrypt.hash(password, 10)
  };

  usuarios.push(nuevoUsuario);
  res.status(201).json({ id: nuevoUsuario.id, username: nuevoUsuario.username });
});

// Paso 5: Obtener perfil del usuario autenticado
router.get("/yo", verificarToken, (req, res) => {
  const usuarioActual = usuarios.find((u) => u.id === req.usuario.id);

  if (!usuarioActual) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  res.json({ id: usuarioActual.id, username: usuarioActual.username });
});

// Desafío 2: Actualizar contraseña del usuario autenticado
router.put("/yo/password", verificarToken, async (req, res) => {
  const { passwordActual, passwordNueva } = req.body ?? {};

  if (!passwordActual || !passwordNueva) {
    return res.status(400).json({ error: "Debes enviar passwordActual y passwordNueva" });
  }

  if (passwordNueva.length < 8) {
    return res.status(400).json({ error: "La nueva contraseña debe tener al menos 8 caracteres" });
  }

  const usuario = usuarios.find((u) => u.id === req.usuario.id);
  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const coincide = await bcrypt.compare(passwordActual, usuario.passwordHash);
  if (!coincide) {
    return res.status(401).json({ error: "Contraseña actual incorrecta" });
  }

  usuario.passwordHash = await bcrypt.hash(passwordNueva, 10);
  res.json({ mensaje: "Contraseña actualizada correctamente" });
});

module.exports = router;
