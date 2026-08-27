import { registerPlugin } from '@capacitor/core';

export interface HardwareIdPlugin {
  /**
   * Lấy mã ANDROID_ID phần cứng thực tế (Settings.Secure.ANDROID_ID)
   */
  getAndroidId(): Promise<{ androidId: string; hardwareSerial?: string }>;
}

const NativeHardwareId = registerPlugin<HardwareIdPlugin>('HardwareId', {
  web: () => ({
    getAndroidId: async () => {
      // Fallback khi chạy trên Web Browser
      return { androidId: '' };
    }
  })
});

export default NativeHardwareId;
