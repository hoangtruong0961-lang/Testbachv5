package com.bachduong.remixvideo;

import android.provider.Settings;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "HardwareId")
public class HardwareIdPlugin extends Plugin {

    @PluginMethod
    public void getAndroidId(PluginCall call) {
        try {
            String androidId = Settings.Secure.getString(
                getContext().getContentResolver(),
                Settings.Secure.ANDROID_ID
            );
            JSObject ret = new JSObject();
            ret.put("androidId", androidId != null ? androidId : "");
            ret.put("hardwareSerial", android.os.Build.SERIAL != null ? android.os.Build.SERIAL : "");
            call.resolve(ret);
        } catch (Exception e) {
            JSObject ret = new JSObject();
            ret.put("androidId", "");
            ret.put("error", e.getMessage());
            call.resolve(ret);
        }
    }
}
