package com.bachduong.remixvideo

import android.os.Bundle
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(HardwareIdPlugin::class.java)
        registerPlugin(GeminiWebViewPlugin::class.java)
        super.onCreate(savedInstanceState)
    }
}

