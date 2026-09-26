// ============================================================
// SERVICIO DE AUTENTICACIÓN
// ============================================================
// Habla con el plugin Simple JWT Login de WordPress.
// El plugin expone /wp-json/simple-jwt-login/v1/auth para login.
// Devuelve un JWT que el frontend guarda y usa en peticiones.

const AUTH_API_URL = 'https://macketi.com/wp-json/simple-jwt-login/v1';
const WP_API_URL = 'https://macketi.com/wp-json/wp/v2';


// ============================================================
// TIPOS
// ============================================================

// Respuesta del endpoint /auth
interface LoginResponse {
  success: boolean;
  data: {
    jwt?: string;
    message?: string;
    errorCode?: number;
  };
}

// Datos del usuario autenticado
export interface AuthUser {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  roles?: string[];
}

// Resultado de la función login
export interface LoginResult {
  success: boolean;
  token?: string;
  user?: AuthUser;
  error?: string;
}


// ============================================================
// FUNCIONES
// ============================================================

/**
 * Decodifica el payload de un JWT sin verificar la firma.
 * Útil para extraer datos como el email sin llamar al servidor.
 *
 * IMPORTANTE: esto NO valida el token. Solo lee su contenido.
 * La validación real la hace WordPress cuando recibe el token.
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // El payload está en base64url. Lo decodificamos.
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Hace login contra el plugin JWT de WordPress.
 *
 * @param email Email del usuario.
 * @param password Contraseña del usuario.
 * @returns Objeto con success, token, user y/o error.
 */
export async function login(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    // ----------------------------------------------------------
    // 1. Pedir el token al plugin JWT
    // ----------------------------------------------------------
    const response = await fetch(`${AUTH_API_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = (await response.json()) as LoginResponse;

    // Si el plugin devuelve error, lo traducimos a un mensaje claro.
    if (!data.success || !data.data.jwt) {
      return {
        success: false,
        error: traducirError(data.data.errorCode, data.data.message),
      };
    }

    const token = data.data.jwt;

    // ----------------------------------------------------------
    // 2. Extraer datos básicos del token
    // ----------------------------------------------------------
    const payload = decodeJwtPayload(token);
    const userEmail = (payload?.email as string) || email;

    // ----------------------------------------------------------
    // 3. Obtener el perfil completo desde WordPress
    // ----------------------------------------------------------
    // El endpoint /wp/v2/users/me requiere el token JWT en el
    // header Authorization. WordPress valida el token y devuelve
    // el perfil del usuario.
    const user: AuthUser = {
      id: 0,
      email: userEmail,
      name: userEmail.split('@')[0], // fallback: parte antes de @
    };

    try {
      const profileResponse = await fetch(`${WP_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        user.id = profile.id;
        user.name = profile.name || user.name;
        user.avatar = profile.avatar_urls?.['96'];
        user.roles = profile.roles;
      }
    } catch {
      // Si falla, seguimos con los datos básicos del token.
    }

    return { success: true, token, user };
  } catch (error) {
    console.error('Error en login:', error);
    return {
      success: false,
      error: 'No se pudo conectar con el servidor. Inténtalo de nuevo.',
    };
  }
}


// ============================================================
// TRADUCCIÓN DE ERRORES
// ============================================================
// Simple JWT Login devuelve códigos de error. Los traducimos
// a mensajes legibles para el usuario.

function traducirError(code?: number, message?: string): string {
  switch (code) {
    case 45:
      return 'La autenticación está desactivada en el servidor.';
    case 46:
      return 'El email o la contraseña son incorrectos.';
    case 47:
      return 'El usuario no existe.';
    case 48:
      return 'El email o la contraseña son incorrectos.';
    case 49:
      return 'El usuario no tiene permisos para iniciar sesión.';
    default:
      return message || 'Error al iniciar sesión. Inténtalo de nuevo.';
  }
}