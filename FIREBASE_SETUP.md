# Configuración Firebase — Amy Blandon

Proyecto utilizado: `amyblandon`.

## 1. Authentication
1. En Firebase Console abre el proyecto `amyblandon`.
2. Ve a **Authentication > Get started**.
3. En **Sign-in method**, habilita **Email/Password**.
4. Habilita **Google** y define un correo público de soporte del proyecto.
5. En **Settings > Authorized domains**, agrega los dominios donde se probará la web, por ejemplo `localhost`, el dominio de GitHub Pages y cualquier dominio personalizado.

## 2. Usuario administrador
1. Ve a **Authentication > Users**.
2. Crea o confirma el usuario administrativo temporal `norvingarcia220@gmail.com` sin documentar contraseñas en el repositorio.
3. Copia su **UID** desde la tabla de usuarios.
4. En Firestore verifica que exista `users/{uid}` con:
   - `email: "norvingarcia220@gmail.com"`
   - `role: "admin"`
   - `active: true`
5. Si encuentras un documento `users/norvingarcia220@gmail.com`, migra sus campos a `users/{uid}` y conserva el documento anterior hasta verificar el acceso.

## 3. Firestore
1. La base Firestore ya existe para este proyecto.
2. Publica manualmente el archivo `firestore.rules` desde **Firestore Database > Rules** o con Firebase CLI.
3. Las reglas incluyen un bootstrap temporal por correo para permitir crear/confirmar `users/{uid}`.
4. Retira el bootstrap por correo cuando el documento `users/{uid}` esté confirmado y el acceso administrativo dependa solo de Firestore.

## 4. Storage
1. Activa **Storage** en Firebase Console si todavía no está habilitado.
2. Publica manualmente `storage.rules` desde **Storage > Rules** o con Firebase CLI.
3. Las imágenes públicas de propiedades y contenido del sitio permiten lectura; documentos privados, clientes y avalúos quedan restringidos a administradores.
4. Si Storage no está habilitado, el panel debe mostrarlo como no habilitado sin romper la aplicación.

## 5. Pruebas
1. Compila con `npm run build` y `npm run build:pages`.
2. Prueba `/admin/login` localmente y `#/admin/login` en GitHub Pages.
3. Inicia sesión con correo/contraseña o Google usando el usuario creado en Authentication.
4. En **Configuración > Estado de Firebase**, pulsa **Probar conexión** y confirma proyecto `amyblandon`, UID y rol.
5. Si aparece “Error de permisos”, publica `firestore.rules` y `storage.rules`; no significa que la configuración web sea privada o inválida.

No se deben guardar contraseñas, tokens, claves privadas, `serviceAccount`, `private_key` ni `client_secret` en el repositorio.
