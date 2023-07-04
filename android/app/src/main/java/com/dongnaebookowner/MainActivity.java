package com.dmonster.dongnaebookowner;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import android.os.Bundle; // 스플래시 이미지
import com.rnfs.RNFSPackage; // react-native-fs
//import org.devio.rn.splashscreen.SplashScreen;
// for PushSound
import android.os.Build;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.ContentResolver;
import android.media.AudioAttributes;
import androidx.core.app.NotificationCompat;
import android.net.Uri;
// END for PushSound

public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        //SplashScreen.show(this, R.style.SplashScreenTheme, true);

        super.onCreate(savedInstanceState);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          // 채널 01 (1회 알림)
          NotificationChannel notificationChannel01 = new NotificationChannel("dongnaebookowner01", "Order Alarm01", NotificationManager.IMPORTANCE_HIGH);
          notificationChannel01.setShowBadge(true);
          notificationChannel01.setDescription("");
          AudioAttributes att01 = new AudioAttributes.Builder()
                  .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                  .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                  .build();
          notificationChannel01.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/dongnaebook_sound_1"), att01);
          notificationChannel01.enableVibration(true);
          notificationChannel01.setVibrationPattern(new long[]{400, 400});
          notificationChannel01.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
          NotificationManager manager01 = getSystemService(NotificationManager.class);
          manager01.createNotificationChannel(notificationChannel01);

          // 채널 02 (2회 알림)
          NotificationChannel notificationChannel02 = new NotificationChannel("dongnaebookowner02", "Order Alarm02", NotificationManager.IMPORTANCE_HIGH);
          notificationChannel02.setShowBadge(true);
          notificationChannel02.setDescription("");
          AudioAttributes att02 = new AudioAttributes.Builder()
                  .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                  .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                  .build();
          notificationChannel02.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/dongnaebook_sound_2"), att02);
          notificationChannel02.enableVibration(true);
          notificationChannel02.setVibrationPattern(new long[]{400, 400});
          notificationChannel02.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
          NotificationManager manager02 = getSystemService(NotificationManager.class);
          manager02.createNotificationChannel(notificationChannel02);
      }
    }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "dongnaebookowner";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the renderer you wish to use - the new renderer (Fabric) or the old renderer
   * (Paper).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }

    @Override
    protected boolean isConcurrentRootEnabled() {
      // If you opted-in for the New Architecture, we enable Concurrent Root (i.e. React 18).
      // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }
  }
}
