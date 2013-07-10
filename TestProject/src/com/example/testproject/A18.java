package com.example.testproject;

import android.os.Bundle;
import org.apache.cordova.*;
import android.view.Menu;

public class A18 extends DroidGap {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		super.loadUrl("file:///android_asset/www/index.html");
		//setContentView(R.layout.activity_a18);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.a18, menu);
		return true;
	}

}
