# Amy Blandon Admin — Android v1.0

Primera versión de prueba de la app administrativa de Amy Blandon.

## Enfoque

La app no replica el panel en código nativo. Carga directamente `https://www.amyblandon.com/admin` dentro de un WebView Android para conservar el mismo diseño, datos y funciones del panel web.

## Incluido en v1.0

- Panel web responsive dentro de Android.
- Persistencia de cookies y sesión del WebView.
- JavaScript, almacenamiento web y Firebase web habilitados.
- Selector de archivos para subir fotografías/documentos desde Android.
- Descargas HTTP y soporte inicial para descargas `blob:` generadas por la web.
- Navegación Atrás integrada con el historial del panel.
- Enlaces externos abiertos fuera de la app.
- Colores de marca azul marino y dorado.
- Splash nativo básico y la pantalla de carga propia del panel web.

## Nota de autenticación

Para esta primera prueba, el acceso más fiable dentro del WebView es correo + contraseña. El inicio de sesión de Google en WebViews puede estar restringido por Google; se evaluará un flujo nativo/Custom Tab para la versión 2.0 si se requiere.

## Compilar

Desde esta carpeta:

```bash
gradle :app:assembleDebug
```

El APK queda en:

`app/build/outputs/apk/debug/app-debug.apk`
