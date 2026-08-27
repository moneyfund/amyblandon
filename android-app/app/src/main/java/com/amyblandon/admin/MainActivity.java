package com.amyblandon.admin;

import android.app.Activity;
import android.app.DownloadManager;
import android.content.ActivityNotFoundException;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.MimeTypeMap;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.Toast;

import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.Locale;

public class MainActivity extends Activity {

    private static final String ADMIN_URL = "https://www.amyblandon.com/admin";
    private static final int FILE_CHOOSER_REQUEST_CODE = 9101;

    private WebView webView;
    private ProgressBar progressBar;
    private ValueCallback<Uri[]> filePathCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().setStatusBarColor(Color.parseColor("#001929"));
        getWindow().setNavigationBarColor(Color.parseColor("#001929"));

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.parseColor("#001929"));

        webView = new WebView(this);
        webView.setBackgroundColor(Color.parseColor("#F5F7FA"));
        root.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progressBar.setMax(100);
        progressBar.setProgress(0);
        FrameLayout.LayoutParams progressParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                6
        );
        progressParams.gravity = Gravity.TOP;
        root.addView(progressBar, progressParams);

        setContentView(root);
        configureWebView();

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        } else {
            webView.loadUrl(ADMIN_URL);
        }
    }

    private void configureWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setSupportZoom(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setSupportMultipleWindows(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);
        settings.setUserAgentString(settings.getUserAgentString() + " AmyBlandonAdminApp/1.0");

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            settings.setSafeBrowsingEnabled(true);
        }

        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webView, true);

        webView.addJavascriptInterface(new BlobDownloader(), "AmyAndroid");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return handleNavigation(request.getUrl());
            }

            @Override
            @SuppressWarnings("deprecation")
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return handleNavigation(Uri.parse(url));
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progressBar.setProgress(newProgress);
                progressBar.setVisibility(newProgress >= 100 ? View.GONE : View.VISIBLE);
            }

            @Override
            public boolean onShowFileChooser(
                    WebView webView,
                    ValueCallback<Uri[]> newFilePathCallback,
                    FileChooserParams fileChooserParams
            ) {
                if (filePathCallback != null) {
                    filePathCallback.onReceiveValue(null);
                }
                filePathCallback = newFilePathCallback;

                Intent intent;
                try {
                    intent = fileChooserParams.createIntent();
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    startActivityForResult(intent, FILE_CHOOSER_REQUEST_CODE);
                    return true;
                } catch (ActivityNotFoundException error) {
                    filePathCallback = null;
                    Toast.makeText(MainActivity.this, "No se encontró una aplicación para seleccionar archivos.", Toast.LENGTH_LONG).show();
                    return false;
                }
            }
        });

        webView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(
                    String url,
                    String userAgent,
                    String contentDisposition,
                    String mimeType,
                    long contentLength
            ) {
                String fileName = sanitizeFileName(android.webkit.URLUtil.guessFileName(url, contentDisposition, mimeType));
                if (url != null && url.startsWith("blob:")) {
                    downloadBlob(url, mimeType, fileName);
                } else {
                    downloadHttpFile(url, userAgent, mimeType, fileName);
                }
            }
        });
    }

    private boolean handleNavigation(Uri uri) {
        if (uri == null || uri.getScheme() == null) return false;

        String scheme = uri.getScheme().toLowerCase(Locale.ROOT);
        if ("http".equals(scheme) || "https".equals(scheme)) {
            String host = uri.getHost();
            if (host != null && isTrustedAmyHost(host)) {
                return false;
            }
            openExternal(uri);
            return true;
        }

        if ("blob".equals(scheme) || "data".equals(scheme)) {
            return false;
        }

        openExternal(uri);
        return true;
    }

    private boolean isTrustedAmyHost(String host) {
        String normalized = host.toLowerCase(Locale.ROOT);
        return normalized.equals("amyblandon.com")
                || normalized.endsWith(".amyblandon.com")
                || normalized.equals("amyblandon.vercel.app")
                || normalized.endsWith(".amyblandon.vercel.app");
    }

    private void openExternal(Uri uri) {
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri));
        } catch (ActivityNotFoundException ignored) {
            Toast.makeText(this, "No hay una aplicación disponible para abrir este enlace.", Toast.LENGTH_SHORT).show();
        }
    }

    private void downloadHttpFile(String url, String userAgent, String mimeType, String fileName) {
        if (url == null || url.isEmpty()) return;

        try {
            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
            String cookie = CookieManager.getInstance().getCookie(url);
            if (cookie != null) request.addRequestHeader("Cookie", cookie);
            if (userAgent != null) request.addRequestHeader("User-Agent", userAgent);
            if (mimeType != null && !mimeType.isEmpty()) request.setMimeType(mimeType);

            request.setTitle(fileName);
            request.setDescription("Descargando desde Amy Blandon");
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "Amy Blandon/" + fileName);
            } else {
                request.setDestinationInExternalFilesDir(this, Environment.DIRECTORY_DOWNLOADS, fileName);
            }

            DownloadManager manager = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
            if (manager != null) {
                manager.enqueue(request);
                Toast.makeText(this, "Descarga iniciada", Toast.LENGTH_SHORT).show();
            }
        } catch (Exception error) {
            Toast.makeText(this, "No se pudo iniciar la descarga.", Toast.LENGTH_LONG).show();
        }
    }

    private void downloadBlob(String blobUrl, String mimeType, String fileName) {
        String safeUrl = JSONObject.quote(blobUrl);
        String safeMime = JSONObject.quote(mimeType == null ? "application/octet-stream" : mimeType);
        String safeName = JSONObject.quote(fileName);
        String script = "(async function(){try{" +
                "const response=await fetch(" + safeUrl + ");" +
                "const blob=await response.blob();" +
                "const reader=new FileReader();" +
                "reader.onloadend=function(){" +
                "const result=reader.result||'';" +
                "const base64=result.indexOf(',')>=0?result.split(',')[1]:result;" +
                "AmyAndroid.saveBase64File(base64,blob.type||" + safeMime + "," + safeName + ");" +
                "};" +
                "reader.readAsDataURL(blob);" +
                "}catch(e){AmyAndroid.showDownloadError();}})();";
        webView.evaluateJavascript(script, null);
    }

    private String sanitizeFileName(String fileName) {
        String value = (fileName == null || fileName.trim().isEmpty()) ? "amy-blandon-descarga" : fileName.trim();
        return value.replaceAll("[\\\\/:*?\"<>|]", "-");
    }

    private class BlobDownloader {
        @JavascriptInterface
        public void saveBase64File(String base64, String mimeType, String fileName) {
            new Thread(() -> {
                try {
                    byte[] data = android.util.Base64.decode(base64, android.util.Base64.DEFAULT);
                    String safeName = sanitizeFileName(fileName);
                    String resolvedMime = (mimeType == null || mimeType.isEmpty())
                            ? inferMimeType(safeName)
                            : mimeType;

                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        ContentValues values = new ContentValues();
                        values.put(MediaStore.MediaColumns.DISPLAY_NAME, safeName);
                        values.put(MediaStore.MediaColumns.MIME_TYPE, resolvedMime);
                        values.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/Amy Blandon");

                        Uri destination = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                        if (destination == null) throw new IllegalStateException("No se pudo crear el archivo de descarga.");

                        try (OutputStream output = getContentResolver().openOutputStream(destination)) {
                            if (output == null) throw new IllegalStateException("No se pudo abrir el archivo de descarga.");
                            output.write(data);
                        }
                    } else {
                        File directory = new File(getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), "Amy Blandon");
                        if (!directory.exists() && !directory.mkdirs()) {
                            throw new IllegalStateException("No se pudo crear la carpeta de descargas.");
                        }
                        File destination = new File(directory, safeName);
                        try (FileOutputStream output = new FileOutputStream(destination)) {
                            output.write(data);
                        }
                    }

                    runOnUiThread(() -> Toast.makeText(MainActivity.this, "Archivo guardado en Descargas", Toast.LENGTH_LONG).show());
                } catch (Exception error) {
                    runOnUiThread(() -> Toast.makeText(MainActivity.this, "No se pudo guardar el archivo.", Toast.LENGTH_LONG).show());
                }
            }).start();
        }

        @JavascriptInterface
        public void showDownloadError() {
            runOnUiThread(() -> Toast.makeText(MainActivity.this, "No se pudo preparar la descarga.", Toast.LENGTH_LONG).show());
        }
    }

    private String inferMimeType(String fileName) {
        String extension = MimeTypeMap.getFileExtensionFromUrl(fileName);
        String detected = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension == null ? "" : extension.toLowerCase(Locale.ROOT));
        return detected == null ? "application/octet-stream" : detected;
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != FILE_CHOOSER_REQUEST_CODE || filePathCallback == null) return;

        Uri[] results = WebChromeClient.FileChooserParams.parseResult(resultCode, data);
        filePathCallback.onReceiveValue(results);
        filePathCallback = null;
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.removeJavascriptInterface("AmyAndroid");
            webView.stopLoading();
            webView.setWebChromeClient(null);
            webView.setWebViewClient(null);
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
