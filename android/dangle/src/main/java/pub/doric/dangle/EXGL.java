package pub.doric.dangle;

import com.facebook.soloader.SoLoader;

public class EXGL {

    static {
        SoLoader.loadLibrary("dangle");
    }

    public static native int EXGLContextCreate(long jsCtxPtr);

    public static native void EXGLContextDestroy(int exglCtxId);

    public static native void EXGLContextFlush(int exglCtxId);

    public static native int EXGLContextCreateObject(int exglCtxId);

    public static native void EXGLContextDestroyObject(int exglCtxId, int exglObjId);

    public static native void EXGLContextMapObject(int exglCtxId, int exglObjId, int glObj);

    public static native int EXGLContextGetObject(int exglCtxId, int exglObjId);

    public static native void EXGLContextSetFlushMethod(int exglCtxId, Object glContext);

    public static native boolean EXGLContextNeedsRedraw(int exglCtxId);

    public static native void EXGLContextDrawEnded(int exglCtxId);
}
