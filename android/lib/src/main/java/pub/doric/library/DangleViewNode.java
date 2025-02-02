package pub.doric.library;


import com.github.pengfeizhou.jscore.JSExecutor;
import com.github.pengfeizhou.jscore.JSIRuntime;
import com.github.pengfeizhou.jscore.JSValue;

import java.lang.reflect.Field;

import pub.doric.DoricContext;
import pub.doric.DoricNativeDriver;
import pub.doric.DoricSingleton;
import pub.doric.dangle.Dangle;
import pub.doric.dangle.GLView;
import pub.doric.engine.DoricJSEngine;
import pub.doric.engine.DoricNativeJSExecutor;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.shader.ViewNode;

@DoricPlugin(name = "DangleView")
public class DangleViewNode extends ViewNode<GLView> {

    private String onPrepared;

    public DangleViewNode(DoricContext doricContext) {
        super(doricContext);

        try {
            Field field = JSIRuntime.class.getDeclaredField("jsiPtr");
            field.setAccessible(true);
            long jsiPtr = field.getLong(JSIRuntime.class);

            if (jsiPtr == 0L) {
                try {
                    DoricNativeDriver doricNativeDriver = DoricSingleton.getInstance().getNativeDriver();
                    Field doricJSEngineField = doricNativeDriver.getClass().getDeclaredField("doricJSEngine");
                    doricJSEngineField.setAccessible(true);
                    DoricJSEngine doricJSEngine = (DoricJSEngine) doricJSEngineField.get(doricNativeDriver);
                    assert doricJSEngine != null;
                    Dangle.getInstance().setJSHandler(doricJSEngine.getJSHandler());

                    Field mDoricJSEField = doricJSEngine.getClass().getDeclaredField("mDoricJSE");
                    mDoricJSEField.setAccessible(true);
                    DoricNativeJSExecutor doricNativeJSExecutor = (DoricNativeJSExecutor) mDoricJSEField.get(doricJSEngine);
                    assert doricNativeJSExecutor != null;
                    Field mJSExecutorField = doricNativeJSExecutor.getClass().getDeclaredField("mJSExecutor");
                    mJSExecutorField.setAccessible(true);
                    JSExecutor jsExecutor = (JSExecutor) mJSExecutorField.get(doricNativeJSExecutor);
                    assert jsExecutor != null;
                    Field ptrField = jsExecutor.getClass().getDeclaredField("ptr");
                    ptrField.setAccessible(true);
                    long ptr = ptrField.getLong(jsExecutor);
                    JSIRuntime.create(ptr);
                } catch (NoSuchFieldException | IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        } catch (NoSuchFieldException | IllegalAccessException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void blend(GLView view, String name, JSValue prop) {
        if ("onPrepared".equals(name)) {
            if (prop.isString()) {
                onPrepared = prop.asString().value();
            } else {
                onPrepared = null;
            }
        } else {
            super.blend(view, name, prop);
        }
    }

    @Override
    protected GLView build() {
        GLView glView = new GLView(getContext());
        glView.setOnSurfaceAvailable(new GLView.OnSurfaceAvailable() {
            @Override
            public void invoke(int width, int height) {
                if (onPrepared != null) {
                    callJSResponse(onPrepared, glView.getEXGLCtxId(), width, height);
                }
            }
        });
        return glView;
    }
}
