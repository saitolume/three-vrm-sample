import { VRM } from '@pixiv/three-vrm'
import ReactDOM from 'react-dom'
import React, { useEffect, useRef, useState } from 'react'
import { useThree, Canvas } from 'react-three-fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const useVrm = () => {
  const { camera } = useThree()
  const { current: loader } = useRef(new GLTFLoader())
  const [vrm, setVrm] = useState(null)

  const loadVrm = url => {
    loader.load(url, async gltf => {
      const vrm = await VRM.from(gltf)
      vrm.scene.rotation.y = Math.PI
      setVrm(vrm)
    })
  }

  // Look at camera
  useEffect(() => {
    if (!vrm || !vrm.lookAt) return
    vrm.lookAt.target = camera
  }, [camera, vrm])

  return { vrm, loadVrm }
}

const App = () => {
  const { aspect } = useThree()
  const { current: camera } = useRef(new THREE.PerspectiveCamera(30, aspect, 0.01, 20))
  const { vrm, loadVrm } = useVrm()

  const handleFileChange = event => {
    const url = URL.createObjectURL(event.target.files[0])
    loadVrm(url)
  }

  // Set camera position
  useEffect(() => {
    camera.position.set(0, 0.6, 4)
  }, [camera])

  return (
    <>
      <input type="file" accept=".vrm" onChange={handleFileChange} />
      <Canvas camera={camera}>
        <spotLight position={[0, 0, 50]} />
        {vrm && <primitive object={vrm.scene} />}
      </Canvas>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
