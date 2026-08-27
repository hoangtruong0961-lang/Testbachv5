import { registerPlugin, Capacitor } from '@capacitor/core';

export interface GeminiSessionResult {
  cookies: string;
  snlm0e?: string;
  currentUrl?: string;
  success: boolean;
}

export interface GeminiWebViewPlugin {
  /**
   * Tự động khởi tạo WebView ẩn, tải https://gemini.google.com/app,
   * trích xuất Cookie và token bảo mật SNlM0e từ phiên đăng nhập thực tế của người dùng.
   */
  fetchGeminiSession(): Promise<GeminiSessionResult>;
}

const NativeGeminiWebView = registerPlugin<GeminiWebViewPlugin>('GeminiWebView', {
  web: () => ({
    fetchGeminiSession: async () => {
      // Fallback khi chạy trên Web Browser thuần túy (không hỗ trợ Native WebView ẩn)
      throw new Error(
        'Tính năng lấy tự động qua WebView ẩn chỉ hỗ trợ trên ứng dụng Android/iOS đã đóng gói qua Capacitor. Trên Web Browser, vui lòng dán Cookie thủ công (__Secure-1PSID).'
      );
    }
  })
});

/**
 * Helper kiểm tra xem thiết bị có đang chạy trên môi trường Native Capacitor hay không
 */
export function isNativeGeminiWebViewSupported(): boolean {
  return Capacitor.isNativePlatform();
}

export default NativeGeminiWebView;
