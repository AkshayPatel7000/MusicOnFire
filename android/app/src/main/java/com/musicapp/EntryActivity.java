package com.musicapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.Window;
import android.view.WindowManager;

public class EntryActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,WindowManager.LayoutParams.FLAG_FULLSCREEN);

        setContentView(R.layout.activity_entry);
        Intent iHome= new Intent(EntryActivity.this,MainActivity.class);

        if(MainActivity.appInFront){
            startActivity(iHome);
        }
        else {
            new Handler().postDelayed(() -> {
                startActivity(iHome);
                finish();
            },4000);
        }
    }
}