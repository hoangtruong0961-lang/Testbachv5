package com.bachduong.remixvideo;

import android.os.Handler;
import android.os.Looper;
import android.webkit.CookieManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "GeminiWebView")
public class GeminiWebViewPlugin extends Plugin {

    private WebView hiddenWebView;

    @PluginMethod
    public void fetchGeminiSession(PluginCall call) {
        new Handler(Looper.getMainLooper()).post(() -> {
            try {
                if (hiddenWebView == null) {
                    hiddenWebView = new WebView(getContext());
                    WebSettings settings = hiddenWebView.getSettings();
                    settings.setJavaScriptEnabled(true);
                    settings.setDomStorageEnabled(true);
                    settings.setUserAgentString("Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36");
                }

                String cookies = CookieManager.getInstance().getCookie("https://gemini.google.com");
                boolean hasAuth = cookies != null && (cookies.contains("__Secure-1PSID") || cookies.contains("__Secure-3PSID") || cookies.contains("SID"));

                JSObject ret = new JSObject();
                ret.put("cookies", cookies != null ? cookies : "");
                ret.put("currentUrl", "https://gemini.google.com/app");
                ret.put("success", hasAuth);
                call.resolve(ret);
            } catch (Exception e) {
                JSObject ret = new JSObject();
                ret.put("cookies", "");
                ret.put("currentUrl", "");
                ret.put("success", false);
                ret.put("error", e.getMessage());
                call.resolve(ret);
            }
        });
    }
}
