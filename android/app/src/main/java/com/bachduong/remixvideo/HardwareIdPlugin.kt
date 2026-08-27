package com.bachduong.remixvideo

import android.annotation.SuppressLint
import android.provider.Settings
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "HardwareId")
class HardwareIdPlugin : Plugin() {

    @SuppressLint("HardwareIds")
    @PluginMethod
    fun getAndroidId(call: PluginCall) {
        try {
            val context = context
            val androidId: String? = Settings.Secure.getString(
                context.contentResolver,
                Settings.Secure.ANDROID_ID
            )

            val ret = JSObject()
            ret.put("androidId", androidId ?: "")
            ret.put("platform", "android")
            
            call.resolve(ret)
        } catch (e: Exception) {
            call.reject("Không thể lấy ANDROID_ID: ${e.localizedMessage}", e)
        }
    }
}
