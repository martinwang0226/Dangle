package pub.doric.dangle;

import android.content.Context;
import android.graphics.SurfaceTexture;
import android.os.Bundle;
import android.util.AttributeSet;
import android.view.TextureView;

public class GLView extends TextureView implements TextureView.SurfaceTextureListener {

  static GLObjectManagerModule objectManager = new GLObjectManagerModule();
  private boolean mOnSurfaceCreateCalled = false;
  private boolean mOnSurfaceTextureCreatedWithZeroSize = false;

  private GLContext mGLContext;

  public interface OnSurfaceAvailable {
    void invoke(int width, int height);
  }
  private OnSurfaceAvailable mOnSurfaceAvailable;
  public void setOnSurfaceAvailable(OnSurfaceAvailable onSurfaceAvailable) {
    this.mOnSurfaceAvailable = onSurfaceAvailable;
  }

  public GLView(Context context) {
    super(context);
    init();
  }

  public GLView(Context context, AttributeSet attributeSet) {
    super(context, attributeSet);
    init();
  }

  private void init() {
    setSurfaceTextureListener(this);
    setOpaque(false);

    mGLContext = new GLContext(objectManager);
  }

  // Public interface to allow running events on GL thread

  public void runOnGLThread(Runnable r) {
    mGLContext.runAsync(r);
  }

  public GLContext getGLContext() {
    return mGLContext;
  }


  // `TextureView.SurfaceTextureListener` events

  @Override
  synchronized public void onSurfaceTextureAvailable(SurfaceTexture surfaceTexture, int width, int height) {
    if (!mOnSurfaceCreateCalled) {
      // onSurfaceTextureAvailable is sometimes called with 0 size texture
      // and immediately followed by onSurfaceTextureSizeChanged with actual size
      if (width == 0 || height == 0) {
        mOnSurfaceTextureCreatedWithZeroSize = true;
      }

      if (!mOnSurfaceTextureCreatedWithZeroSize) {
        initializeSurfaceInGLContext(surfaceTexture, width, height);
      }

      mOnSurfaceCreateCalled = true;
    }
  }

  @Override
  public boolean onSurfaceTextureDestroyed(SurfaceTexture surface) {
    mGLContext.destroy();

    // reset flag, so the context will be recreated when the new surface is available
    mOnSurfaceCreateCalled = false;

    return true;
  }

  @Override
  synchronized public void onSurfaceTextureSizeChanged(SurfaceTexture surfaceTexture, int width, int height) {
    if (mOnSurfaceTextureCreatedWithZeroSize && (width != 0 || height != 0)) {
      initializeSurfaceInGLContext(surfaceTexture, width, height);
      mOnSurfaceTextureCreatedWithZeroSize = false;
    }
  }

  @Override
  public void onSurfaceTextureUpdated(SurfaceTexture surface) {
  }

  public void flush() {
    mGLContext.flush();
  }

  public int getEXGLCtxId() {
    return mGLContext.getContextId();
  }

  private void initializeSurfaceInGLContext(SurfaceTexture surfaceTexture, int width, int height) {
    mGLContext.initialize(surfaceTexture, new Runnable() {
      @Override
      public void run() {
        final Bundle event = new Bundle();

        event.putInt("exglCtxId", mGLContext.getContextId());

        if (mOnSurfaceAvailable != null) {
          mOnSurfaceAvailable.invoke(width, height);
        }
      }
    });
  }
}

