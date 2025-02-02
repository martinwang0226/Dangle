#include <stdint.h>

#include <android/log.h>
#include <jni.h>
#include <thread>

#include <jsi/jsi.h>
#include "UEXGL.h"

extern "C" {

JNIEXPORT jint JNICALL
Java_pub_doric_dangle_EXGL_EXGLContextCreate(JNIEnv *env, jclass clazz, jlong jsiPtr) {
  return UEXGLContextCreate((void *)jsiPtr);
}

JNIEXPORT void JNICALL
Java_pub_doric_dangle_EXGL_EXGLContextDestroy(JNIEnv *env, jclass clazz, jint exglCtxId) {
  UEXGLContextDestroy(exglCtxId);
}

JNIEXPORT void JNICALL
Java_pub_doric_dangle_EXGL_EXGLContextFlush(JNIEnv *env, jclass clazz, jint exglCtxId) {
  UEXGLContextFlush(exglCtxId);
}

JNIEXPORT jint JNICALL
Java_pub_doric_dangle_EXGL_EXGLContextCreateObject(JNIEnv *env, jclass clazz, jint exglCtxId) {
  return UEXGLContextCreateObject(exglCtxId);
}

JNIEXPORT void JNICALL Java_pub_doric_dangle_EXGL_EXGLContextDestroyObject(
    JNIEnv *env,
    jclass clazz,
    jint exglCtxId,
    jint exglObjId) {
  UEXGLContextDestroyObject(exglCtxId, exglObjId);
}

JNIEXPORT void JNICALL Java_pub_doric_dangle_EXGL_EXGLContextMapObject(
    JNIEnv *env,
    jclass clazz,
    jint exglCtxId,
    jint exglObjId,
    jint glObj) {
  UEXGLContextMapObject(exglCtxId, exglObjId, glObj);
}

JNIEXPORT jint JNICALL Java_pub_doric_dangle_EXGL_EXGLContextGetObject(
    JNIEnv *env,
    jclass clazz,
    jint exglCtxId,
    jint exglObjId) {
  return UEXGLContextGetObject(exglCtxId, exglObjId);
}

JNIEXPORT void JNICALL Java_pub_doric_dangle_EXGL_EXGLContextSetFlushMethod(
    JNIEnv *env,
    jclass clazz,
    jint exglCtxId,
    jobject glContext) {
  jclass GLContextClass = env->GetObjectClass(glContext);
  jobject glContextRef = env->NewGlobalRef(glContext);
  jmethodID flushMethodRef = env->GetMethodID(GLContextClass, "flush", "()V");

  std::function<void(void)> flushMethod = [env, glContextRef, flushMethodRef] {
    env->CallVoidMethod(glContextRef, flushMethodRef);
  };
  UEXGLContextSetFlushMethod(exglCtxId, flushMethod);
}

JNIEXPORT bool JNICALL
Java_pub_doric_dangle_EXGL_EXGLContextNeedsRedraw(JNIEnv *env, jclass clazz, jint exglCtxId) {
  return UEXGLContextNeedsRedraw(exglCtxId);
}

JNIEXPORT void JNICALL
Java_pub_doric_dangle_EXGL_EXGLContextDrawEnded(JNIEnv *env, jclass clazz, jint exglCtxId) {
  UEXGLContextDrawEnded(exglCtxId);
}
}
