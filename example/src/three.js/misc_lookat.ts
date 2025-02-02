import {
  Panel,
  Group,
  vlayout,
  layoutConfig,
  Gravity,
  navbar,
  GestureContainer,
  gestureContainer,
  Color,
} from "doric";
import { dangleView, getGl, vsync } from "dangle";

import * as THREE from "three"

@Entry
class misc_lookat extends Panel {

  private gestureView?: GestureContainer

  onShow() {
    navbar(context).setTitle("misc_lookat");
  }
  build(rootView: Group) {
    vlayout([
      this.gestureView = gestureContainer(
        [],
        {
          layoutConfig: layoutConfig().just(),
          width: 300,
          height: 300,
          backgroundColor: Color.BLACK
        }
      ),
    ])
      .apply({
        layoutConfig: layoutConfig().fit().configAlignment(Gravity.Center),
        space: 20,
        gravity: Gravity.Center,
      })
      .in(rootView);

    let self = this
    this.gestureView?.addChild(
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
          let camera, scene, renderer, stats;

          let sphere;

          let mouseX = 0, mouseY = 0;

          let windowHalfX = window.innerWidth / 2;
          let windowHalfY = window.innerHeight / 2;

          // document.addEventListener( 'mousemove', onDocumentMouseMove );
          self.gestureView!!.onTouchMove = ({ x, y }) => {
            onDocumentMouseMove({
              clientX: x * Environment.screenScale,
              clientY: y * Environment.screenScale,
            });
          };

          init();
          animate();


          function init() {

            camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 15000 );
            camera.position.z = 3200;

            scene = new THREE.Scene();
            scene.background = new THREE.Color( 0xffffff );

            sphere = new THREE.Mesh( new THREE.SphereGeometry( 100, 20, 20 ), new THREE.MeshNormalMaterial() );
            scene.add( sphere );

            const geometry = new THREE.CylinderGeometry( 0, 10, 100, 12 );
            geometry.rotateX( Math.PI / 2 );

            const material = new THREE.MeshNormalMaterial();

            for ( let i = 0; i < 1000; i ++ ) {

              const mesh = new THREE.Mesh( geometry, material );
              mesh.position.x = Math.random() * 4000 - 2000;
              mesh.position.y = Math.random() * 4000 - 2000;
              mesh.position.z = Math.random() * 4000 - 2000;
              mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 4 + 2;
              scene.add( mesh );

            }

            renderer = new THREE.WebGLRenderer( { antialias: true, canvas: inputCanvas } );
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( window.innerWidth, window.innerHeight );
            // document.body.appendChild( renderer.domElement );

            // stats = new Stats();
            // document.body.appendChild( stats.dom );

            //

            window.addEventListener( 'resize', onWindowResize );

          }

          function onWindowResize() {

            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( window.innerWidth, window.innerHeight );

          }

          function onDocumentMouseMove( event ) {

            mouseX = ( event.clientX - windowHalfX ) * 10;
            mouseY = ( event.clientY - windowHalfY ) * 10;

          }

          //

          function animate() {

            vsync(context).requestAnimationFrame( animate );

            render();
            // stats.update();

            gl.flush();
            gl.endFrameEXP();
          }

          function render() {

            const time = Date.now() * 0.0005;

            sphere.position.x = Math.sin( time * 0.7 ) * 2000;
            sphere.position.y = Math.cos( time * 0.5 ) * 2000;
            sphere.position.z = Math.cos( time * 0.3 ) * 2000;

            for ( let i = 1, l = scene.children.length; i < l; i ++ ) {

              scene.children[ i ].lookAt( sphere.position );

            }

            camera.position.x += ( mouseX - camera.position.x ) * .05;
            camera.position.y += ( - mouseY - camera.position.y ) * .05;
            camera.lookAt( scene.position );

            renderer.render( scene, camera );

          }
    
          //#endregion
        },
      }).apply({
        layoutConfig: layoutConfig().just(),
        width: 300,
        height: 300,
      })
    )
  }
}
  