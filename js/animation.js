	        const SEPARATION = 100, AMOUNTX = 100, AMOUNTY = 100;

            let container, camera, scene, renderer;

            let particles, count = 0;

            let mouseX = 0, mouseY = 0;

            let windowHalfX = window.innerWidth / 2;
            let windowHalfY = window.innerHeight / 2;


            init();
            animate();

            function init()
            {
             
                container = document.getElementById("animationPanel");
				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.z = 1000;
                camera.position.y = 10000;
				scene = new THREE.Scene();

				const numParticles = AMOUNTX * AMOUNTY;

				const positions = new Float32Array( numParticles * 3 );
				const scales = new Float32Array( numParticles );

				let i = 0, j = 0;

				for ( let ix = 0; ix < AMOUNTX; ix ++ ) {

					for ( let iy = 0; iy < AMOUNTY; iy ++ ) {

						positions[ i ] = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 ); // x
						positions[ i + 1 ] = 0; // y
						positions[ i + 2 ] = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 ); // z

						scales[ j ] = 1;

						i += 3;
						j ++;

					}

				}

				const geometry = new THREE.BufferGeometry();
				geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
				geometry.setAttribute( 'scale', new THREE.BufferAttribute( scales, 1 ) );

				const material = new THREE.ShaderMaterial( {

					uniforms: {
						color: { value: new THREE.Color( 0xffffff ) },
					},
					vertexShader: document.getElementById( 'vertexshader' ).textContent,
					fragmentShader: document.getElementById( 'fragmentshader' ).textContent

				} );  


                
				particles = new THREE.Points( geometry, material );
				scene.add( particles );

				//

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth - getScrollbarWidth(), window.innerHeight );
				container.appendChild( renderer.domElement );


				container.style.touchAction = 'none';

                // Below is used to activate in progress mouse movement camera follow

				//container.addEventListener( 'pointermove', onPointerMove );

				window.addEventListener( 'resize', onWindowResize );
            }

            function animate() {
				requestAnimationFrame( animate );
                render()
			};

            
			function onWindowResize() 
            {
                windowHalfX = window.innerWidth / 2;
                windowHalfY = window.innerHeight / 2;

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize( window.innerWidth, window.innerHeight);
            }

            function onPointerMove( event ) 
            {
				if ( event.isPrimary === false ) return;

				mouseX = event.clientX - windowHalfX;
				mouseY = event.clientY - windowHalfY;
			}

            function render() 
            {

                camera.position.x += ( mouseX - camera.position.x ) * .005;
                camera.position.y += ( - mouseY - camera.position.y ) * .005 + 1;
                camera.lookAt( scene.position );

                const positions = particles.geometry.attributes.position.array;
                const scales = particles.geometry.attributes.scale.array;

                let i = 0, j = 0;

                for ( let ix = 0; ix < AMOUNTX; ix ++ ) 
                {
                    for ( let iy = 0; iy < AMOUNTY; iy ++ ) 
                    {
                        positions[ i + 1 ] = ( Math.sin( ( ix + count ) * 0.1 ) * 50 ) +
                                        ( Math.sin( ( iy + count ) * 0.3 ) * 50 );

                        scales[ j ] = ( Math.sin( ( ix + count ) * 0.1 ) + 1 ) * 20 +
                                        ( Math.sin( ( iy + count ) * 0.3 ) + 1 ) * 20;

                        i += 3;
                        j ++;
                    }
                }

                particles.geometry.attributes.position.needsUpdate = true;
                particles.geometry.attributes.scale.needsUpdate = true;

                renderer.render( scene, camera );

                count += 0.1;

            }

            function getScrollbarWidth() {

                if (document.body == null) return 0;

                // Creating invisible container
                const outer = document.createElement('div');
                outer.style.visibility = 'hidden';
                outer.style.overflow = 'scroll'; // forcing scrollbar to appear
                outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
                document.body.appendChild(outer);

                // Creating inner element and placing it in the container
                const inner = document.createElement('div');
                outer.appendChild(inner);

                // Calculating difference between container's full width and the child width
                const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

                // Removing temporary elements from the DOM
                outer.parentNode.removeChild(outer);

                return scrollbarWidth;

            }