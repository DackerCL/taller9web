// Servicios de comunicación con la API (Pasos 8, 9 y Desafío 1)
import { obtenerSesion } from "./sesion";
import type { Sesion } from "./sesion";

export interface Publicacion {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// Datos necesarios para publicar (el userId lo determina el token en el servidor)
export interface DatosPublicacion {
  title: string;
  body: string;
}

export interface RespuestaUsuario {
  id: number;
  username: string;
}

export const API_URL = "http://localhost:3000";

// Error personalizado para capturar status codes (ej. 401 para redirección)
export class ErrorApi extends Error {
  status: number;

  constructor(mensaje: string, status: number) {
    super(mensaje);
    this.status = status;
  }
}

// Procesa y deserializa la respuesta HTTP
const procesarRespuesta = async (response: Response) => {
  if (response.status === 204) {
    return null;
  }
  const texto = await response.text();
  let datos;
  try {
    datos = JSON.parse(texto);
  } catch {
    datos = null;
  }
  if (!response.ok) {
    throw new ErrorApi(datos?.error ?? `El servidor respondió con el código ${response.status}`, response.status);
  }
  return datos;
};

// Paso 8: POST /api/login - Envía credenciales y recibe el token con los datos de sesión
export const iniciarSesion = async (username: string, password: string): Promise<Sesion> => {
  const respuesta = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username.trim(), password })
  });
  return procesarRespuesta(respuesta);
};

// Desafío 1: POST /api/usuarios - Registra un nuevo usuario en el sistema
export const registrarUsuario = async (username: string, password: string): Promise<RespuestaUsuario> => {
  const respuesta = await fetch(`${API_URL}/api/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username.trim(), password })
  });
  return procesarRespuesta(respuesta);
};

// Paso 9: Inyecta el header Authorization con el token JWT si existe una sesión activa
export const encabezadosConToken = (): Record<string, string> => {
  const sesionActiva = obtenerSesion();
  if (!sesionActiva?.token) {
    return {};
  }
  return {
    Authorization: `Bearer ${sesionActiva.token}`
  };
};

// GET /api/usuarios/yo (ruta protegida)
export const obtenerPerfil = async (): Promise<RespuestaUsuario> => {
  const response = await fetch(`${API_URL}/api/usuarios/yo`, { headers: encabezadosConToken() });
  return procesarRespuesta(response);
};

// GET /api/posts (ruta pública)
export const obtenerPublicaciones = async (userId?: number): Promise<Publicacion[]> => {
  const url = userId ? `${API_URL}/api/posts?userId=${userId}` : `${API_URL}/api/posts`;
  const response = await fetch(url);
  return procesarRespuesta(response);
};

// POST /api/posts (ruta protegida)
export const crearPublicacion = async (datos: DatosPublicacion): Promise<Publicacion> => {
  const response = await fetch(`${API_URL}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...encabezadosConToken() },
    body: JSON.stringify(datos)
  });
  return procesarRespuesta(response);
};

// PUT /api/posts/:id (ruta protegida)
export const actualizarPublicacion = async (id: number, datos: DatosPublicacion): Promise<Publicacion> => {
  const response = await fetch(`${API_URL}/api/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...encabezadosConToken() },
    body: JSON.stringify(datos)
  });
  return procesarRespuesta(response);
};

// DELETE /api/posts/:id (ruta protegida)
export const eliminarPublicacion = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/posts/${id}`, {
    method: "DELETE",
    headers: encabezadosConToken()
  });
  await procesarRespuesta(response);
};
