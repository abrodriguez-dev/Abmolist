import { verifyFirebaseToken } from "../config/firebaseAdmin.js";

export async function authenticate(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response.status(401).json({
      message: "Falta el token de autenticacion."
    });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    request.user = await verifyFirebaseToken(token);
    return next();
  } catch {
    return response.status(401).json({
      message: "El token de Firebase no es valido."
    });
  }
}

