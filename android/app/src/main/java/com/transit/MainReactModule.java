package com.transit; // replace your-apps-package-name with your app’s package name

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import com.facebook.react.bridge.ReadableArray;
// import com.google.transit.realtimegtfs.GtfsRealtime.FeedMessage;

public class MainReactModule extends ReactContextBaseJavaModule {
	MainReactModule(ReactApplicationContext context) {
		super(context);
	}

	@Override
	public String getName() {
		return "MainReactModule";
	}

	@ReactMethod
	public void parseGTFS(String input, final Promise promise) {
		// FeedMessage.parseFrom(input);
	}
}
