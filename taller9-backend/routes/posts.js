// Rutas de publicaciones (/api/posts - Paso 7)
const express = require("express");
const verificarToken = require("../middleware/auth");

const router = express.Router();

let posts = [
  { userId: 1, id: 1, title: "Bienvenidos al Taller 9", body: "En este taller protegeremos nuestra API: solo los usuarios identificados podrán publicar, y solo el autor podrá editar o eliminar sus publicaciones." },
  { userId: 1, id: 2, title: "¿Qué es un backend?", body: "Es la parte de la aplicación que se ejecuta en el servidor y responde a las peticiones de los clientes." },
  { userId: 2, id: 3, title: "Métodos HTTP", body: "GET permite obtener datos, POST crear, PUT actualizar y DELETE eliminar." },
  { userId: 2, id: 4, title: "Formato JSON", body: "Los clientes y el servidor se comunican enviando y recibiendo datos en formato JSON." },
  { userId: 3, id: 5, title: "Postman", body: "Postman es una herramienta que permite enviar peticiones HTTP y revisar las respuestas del servidor." }
];

// Obtener todas las publicaciones (o filtrar por usuario)
router.get("/", (req, res) => {
  const { userId } = req.query;
  if (userId) {
    const filtrados = posts.filter((p) => p.userId === Number(userId));
    return res.json(filtrados);
  }
  res.json(posts);
});

// Obtener una publicación específica por ID
router.get("/:id", (req, res) => {
  const postId = Number(req.params.id);
  const post = posts.find((p) => p.id === postId);

  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: "Publicación no encontrada" });
  }
});

// Paso 7: Crear publicación (asocia automáticamente el userId del token)
router.post("/", verificarToken, (req, res) => {
  const { title, body } = req.body ?? {};

  if (!title || !body) {
    return res.status(400).json({ error: "Debes enviar title y body" });
  }

  const nuevoPost = {
    userId: req.usuario.id,
    id: posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1,
    title,
    body
  };

  posts.push(nuevoPost);
  res.status(201).json(nuevoPost);
});

// Paso 7: Eliminar publicación (solo el autor puede eliminar)
router.delete("/:id", verificarToken, (req, res) => {
  const postId = Number(req.params.id);
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return res.status(404).json({ error: "Publicación no encontrada" });
  }

  if (post.userId !== req.usuario.id) {
    return res.status(403).json({ error: "Solo el autor puede modificar esta publicación" });
  }

  posts = posts.filter((p) => p.id !== postId);
  res.status(204).end();
});

// Paso 7: Editar publicación (solo el autor puede editar)
router.put("/:id", verificarToken, (req, res) => {
  const postId = Number(req.params.id);
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return res.status(404).json({ error: "Publicación no encontrada" });
  }

  if (post.userId !== req.usuario.id) {
    return res.status(403).json({ error: "Solo el autor puede modificar esta publicación" });
  }

  const { title, body } = req.body ?? {};
  if (!title || !body) {
    return res.status(400).json({ error: "Debes enviar title y body" });
  }

  const postActualizado = {
    userId: post.userId,
    id: post.id,
    title,
    body
  };

  posts = posts.map((p) => (p.id === postId ? postActualizado : p));
  res.json(postActualizado);
});

module.exports = router;
