import {
  Panel,
  Group,
  vlayout,
  layoutConfig,
  Gravity,
  navbar,
  stack,
  Color,
} from "doric";
import { dangleView, getGl, vsync } from "dangle";

import * as THREE from "three";

@Entry
class misc_animation_keys extends Panel {
  onShow() {
    navbar(context).setTitle("misc_animation_keys");
  }
  build(rootView: Group) {
    vlayout([
      stack(
        [
          dangleView({
            onPrepared: (glContextId, width, height) => {
              let gl = getGl(glContextId) as any;

              const inputCanvas = 
              ({
                width: width,
                height: height,
                style: {},
                addEventListener: (() => {}) as any,
                removeEventListener: (() => {}) as any,
                clientHeight: height,
                getContext: (() => {return gl}) as any,
              } as HTMLCanvasElement);

              let window = {
                innerWidth: width,
                innerHeight: height,
                devicePixelRatio: 1,
                addEventListener: (() => {}) as any
              }

              //#region code to impl

              let stats, clock;
              let scene, camera, renderer, mixer;

              init();
              animate();

              function init() {

                scene = new THREE.Scene();

                //

                camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
                camera.position.set( 25, 25, 50 );
                camera.lookAt( scene.position );

                //

                const axesHelper = new THREE.AxesHelper( 10 );
                scene.add( axesHelper );

                //

                const geometry = new THREE.BoxGeometry( 5, 5, 5 );
                const material = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true } );
                const mesh = new THREE.Mesh( geometry, material );
                scene.add( mesh );

                // create a keyframe track (i.e. a timed sequence of keyframes) for each animated property
                // Note: the keyframe track type should correspond to the type of the property being animated

                // POSITION
                const positionKF = new THREE.VectorKeyframeTrack( '.position', [ 0, 1, 2 ], [ 0, 0, 0, 30, 0, 0, 0, 0, 0 ] );

                // SCALE
                const scaleKF = new THREE.VectorKeyframeTrack( '.scale', [ 0, 1, 2 ], [ 1, 1, 1, 2, 2, 2, 1, 1, 1 ] );

                // ROTATION
                // Rotation should be performed using quaternions, using a THREE.QuaternionKeyframeTrack
                // Interpolating Euler angles (.rotation property) can be problematic and is currently not supported

                // set up rotation about x axis
                const xAxis = new THREE.Vector3( 1, 0, 0 );

                const qInitial = new THREE.Quaternion().setFromAxisAngle( xAxis, 0 );
                const qFinal = new THREE.Quaternion().setFromAxisAngle( xAxis, Math.PI );
                const quaternionKF = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 1, 2 ], [ qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w, qInitial.x, qInitial.y, qInitial.z, qInitial.w ] );

                // COLOR
                const colorKF = new THREE.ColorKeyframeTrack( '.material.color', [ 0, 1, 2 ], [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ], THREE.InterpolateDiscrete );

                // OPACITY
                const opacityKF = new THREE.NumberKeyframeTrack( '.material.opacity', [ 0, 1, 2 ], [ 1, 0, 1 ] );

                // create an animation sequence with the tracks
                // If a negative time value is passed, the duration will be calculated from the times of the passed tracks array
                const clip = new THREE.AnimationClip( 'Action', 3, [ scaleKF, positionKF, quaternionKF, colorKF, opacityKF ] );

                // setup the THREE.AnimationMixer
                mixer = new THREE.AnimationMixer( mesh );

                // create a ClipAction and set it to play
                const clipAction = mixer.clipAction( clip );
                clipAction.play();

                //

                renderer = new THREE.WebGLRenderer( { antialias: true, canvas: inputCanvas } );
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( window.innerWidth, window.innerHeight );
                // document.body.appendChild( renderer.domElement );

                //

                // stats = new Stats();
                // document.body.appendChild( stats.dom );

                //

                clock = new THREE.Clock();

                //

                window.addEventListener( 'resize', onWindowResize );

              }

              function onWindowResize() {

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize( window.innerWidth, window.innerHeight );

              }

              function animate() {

                vsync(context).requestAnimationFrame( animate );

                render();

                gl.flush();
                gl.endFrameEXP();
              }

              function render() {

                const delta = clock.getDelta();

                if ( mixer ) {

                  mixer.update( delta );

                }

                renderer.render( scene, camera );

                // stats.update();

              }

              //#endregion
            },
          }).apply({
            layoutConfig: layoutConfig().just(),
            width: 300,
            height: 300,
          }),
        ],
        {
          layoutConfig: layoutConfig().just(),
          width: 300,
          height: 300,
          backgroundColor: Color.BLACK,
        }
      ),
    ])
      .apply({
        layoutConfig: layoutConfig().fit().configAlignment(Gravity.Center),
        space: 20,
        gravity: Gravity.Center,
      })
      .in(rootView);
  }
}
  