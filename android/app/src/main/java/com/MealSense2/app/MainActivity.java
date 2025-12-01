
package com.MealSense2.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.auth.AuthResult;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import android.util.Log;
import android.widget.Toast;
import androidx.annotation.NonNull;

public class MainActivity extends BridgeActivity {
	private FirebaseAuth mAuth;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		// Initialize Firebase Auth
		mAuth = FirebaseAuth.getInstance();
	}


	private static final String TAG = "MainActivity";

	@Override
	public void onStart() {
		super.onStart();
		// Check if user is signed in (non-null) and update UI accordingly.
		FirebaseUser currentUser = mAuth.getCurrentUser();
		if (currentUser == null) {
			mAuth.signInAnonymously()
				.addOnCompleteListener(this, new OnCompleteListener<AuthResult>() {
					@Override
					public void onComplete(@NonNull Task<AuthResult> task) {
						if (task.isSuccessful()) {
							// Sign in success, update UI with the signed-in user's information
							Log.d(TAG, "signInAnonymously:success");
							FirebaseUser user = mAuth.getCurrentUser();
							updateUI(user);
						} else {
							// If sign in fails, display a message to the user.
							Log.w(TAG, "signInAnonymously:failure", task.getException());
							Toast.makeText(MainActivity.this, "Authentication failed.", Toast.LENGTH_SHORT).show();
							updateUI(null);
						}
					}
				});
		} else {
			updateUI(currentUser);
		}
	}

	private void updateUI(FirebaseUser user) {
		// TODO: Implement UI update logic based on user state
	}
}


