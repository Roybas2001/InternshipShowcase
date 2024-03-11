import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

import CanvasLoader from '../Loader';

const Earth = (isMobile) => {
    const earth = useGLTF('./planet/scene.gltf');

    return (
        <mesh>
            {/* Lighting */}
            <hemisphereLight intensity={5} groundColor="black" />
            <pointLight intensity={1} />
            <spotLight position={[-20, 50, 10]} angle={0.12} penumbra={1} castShadow shadow-mapSize={1024} />

            {/* Model */}
            <primitive
            object={earth.scene}
            scale={isMobile ? 3 : 2.5}
            position={isMobile ? [0,0,0] : [0,0,0]}
            rotation={[0.01, 0.2, 0.1]}/>
        </mesh>
    )
}

const EarthCanvas = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Listening to changes in the screen size
        const mediaQuery = window.matchMedia('(max-width: 500px)');

        // Set the initial value of the isMobile state
        setIsMobile(mediaQuery.matches);

        // Callback function to handle changes to the media query
        const handleMediaQueryChange = (event) => {
            setIsMobile(event.matches);
        }

        // Add the call back function as a listener for changes to the media Query
        mediaQuery.addEventListener('change', handleMediaQueryChange);

        // remove the listener when the compoment is unmounted
        return () => {
            mediaQuery.addEventListener('change', handleMediaQueryChange)
        }
    }, [])

    return (
        <Canvas
        shadows
        frameloop='demand'
        gl={{preserveDrawingBuffer: true}}
        camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [-4, 3, 6],
        }}>
            <Suspense fallback={<CanvasLoader />}>
              <OrbitControls 
                autoRotate
                enableZoom={false}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 2}
              />
              <Earth isMobile={isMobile}/>
            </Suspense>
        </Canvas>
    )
}

export default EarthCanvas;