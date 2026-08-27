package com.bachduong.remixvideo

import android.annotation.SuppressLint
import android.content.Context
import android.os.Handler
import android.os.Looper
import android.webkit.CookieManager
import android.webkit.ValueCallback
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "GeminiWebView")
class GeminiWebViewPlugin : Plugin() {

    private var hiddenWebView: WebView? = null
    private val mainHandler = Handler(Looper.getMainLooper())

    /**
     * Tự động khởi tạo WebView ẩn, tải gemini.google.com/app,
     * trích xuất Cookie và token bảo mật SNlM0e trực tiếp từ phiên đăng nhập thật.
     */
    @SuppressLint("SetJavaScriptEnabled")
    @PluginMethod
    fun fetchGeminiSession(call: PluginCall) {
        val activity = activity ?: run {
            call.reject("Activity context không khả dụng")
            return
        }

        mainHandler.post {
            try {
                // Hủy webview cũ nếu có
                hiddenWebView?.destroy()

                val webView = WebView(activity)
                hiddenWebView = webView

                // Giấu hoàn toàn WebView khỏi giao diện người dùng
                webView.layout(0, 0, 1, 1)
                webView.alpha = 0.01f

                val settings = webView.settings
                settings.javaScriptEnabled = true
                settings.domStorageEnabled = true
                settings.databaseEnabled = true
                settings.useWideViewPort = true
                settings.loadWithOverviewMode = true
                settings.userAgentString =
                    "Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36"

                val cookieManager = CookieManager.getInstance()
                cookieManager.setAcceptCookie(true)
                cookieManager.setAcceptThirdPartyCookies(webView, true)

                var isResolved = false

                webView.webViewClient = object : WebViewClient() {
                    override fun onPageFinished(view: WebView?, url: String?) {
                        super.onPageFinished(view, url)

                        val currentUrl = url ?: ""

                        // Kiểm tra nếu bị chuyển hướng sang trang đăng nhập Google
                        if (currentUrl.contains("accounts.google.com") || currentUrl.contains("ServiceLogin")) {
                            if (!isResolved) {
                                isResolved = true
                                call.reject("Tài khoản chưa đăng nhập Google trên thiết bị. Vui lòng đăng nhập Google trước.")
                            }
                            return
                        }

                        // Đợi 3000ms để SPA khởi tạo và nạp WIZ_global_data
                        mainHandler.postDelayed({
                            if (isResolved) return@postDelayed

                            val cookies = cookieManager.getCookie("https://gemini.google.com") ?: ""

                            // Chạy JS để lấy SNlM0e trực tiếp từ context trang
                            val jsCode = """
                                (function() {
                                    try {
                                        if (window.WIZ_global_data && window.WIZ_global_data.SNlM0e) {
                                            return window.WIZ_global_data.SNlM0e;
                                        }
                                        var html = document.documentElement.innerHTML;
                                        var match = html.match(/"SNlM0e"\s*:\s*"([^"]+)"/) || html.match(/\["SNlM0e"\s*,\s*"([^"]+)"\]/);
                                        return match ? match[1] : "";
                                    } catch(e) {
                                        return "";
                                    }
                                })();
                            """.trimIndent()

                            webView.evaluateJavascript(jsCode, ValueCallback { rawResult ->
                                if (isResolved) return@ValueCallback
                                isResolved = true

                                val snlm0e = (rawResult ?: "")
                                    .replace("\"", "")
                                    .replace("\\", "")
                                    .trim()

                                val ret = JSObject()
                                ret.put("cookies", cookies)
                                ret.put("snlm0e", snlm0e)
                                ret.put("currentUrl", currentUrl)
                                ret.put("success", snlm0e.isNotEmpty() || cookies.isNotEmpty())

                                call.resolve(ret)
                            })
                        }, 3000)
                    }
                }

                webView.loadUrl("https://gemini.google.com/app")

                // Timeout an toàn sau 20 giây
                mainHandler.postDelayed({
                    if (!isResolved) {
                        isResolved = true
                        call.reject("Quá thời gian kết nối tới gemini.google.com (Timeout 20s)")
                    }
                }, 20000)

            } catch (e: Exception) {
                call.reject("Lỗi khởi tạo WebView ẩn: ${e.localizedMessage}", e)
            }
        }
    }
}
