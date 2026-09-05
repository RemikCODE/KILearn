import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, useGLTF } from '@react-three/drei'
import { cn } from '@/lib/utils'

const MODEL_URL = import.meta.env.BASE_URL + 'mascot.glb'
// docelowy rozmiar modelu (mieszczenie się w kwadratowym pudle sceny)
const TARGET_SIZE = 2.4

function usePrefersReducedMotion() {
  const reduced = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  return reduced
}

function MascotModel() {
  const gltf = useGLTF(MODEL_URL)
  const group = useRef<THREE.Group>(null)
  const reducedMotion = usePrefersReducedMotion()

  // dopasowujemy model do sceny: skalujemy do TARGET_SIZE i centrujemy
  useEffect(() => {
    const g = group.current
    if (!g) return

    // model jest zamknięty — renderujemy tylko front, żeby nie podwajać pracy GPU
    g.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (mesh.isMesh && Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => {
          m.side = THREE.FrontSide
          m.needsUpdate = true
        })
      } else if (mesh.isMesh) {
        const m = mesh.material as THREE.Material
        m.side = THREE.FrontSide
        m.needsUpdate = true
      }
    })

    const box = new THREE.Box3().setFromObject(g)
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const scale = TARGET_SIZE / maxDim

    g.scale.setScalar(scale)

    const center = box.getCenter(new THREE.Vector3())
    g.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
  }, [gltf])

  // delikatny obrót "karuzeli" — maskotka sama się prezentuje
  useFrame((_, delta) => {
    if (reducedMotion.current || !group.current) return
    group.current.rotation.y += delta * 0.35
  })

  return (
    <group ref={group}>
      <primitive object={gltf.scene} />
    </group>
  )
}

export function BrainMascot3D({ className }: { className?: string }) {
  return (
    <div className={cn('h-auto w-full', className)}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.4, 3.6], fov: 42 }}
        style={{ aspectRatio: '1 / 1', width: '100%' }}
        role="img"
        aria-label="Maskotka 3D KILearn — mózg w czapce studenckiej"
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 5, 5]} intensity={2.2} />
        <directionalLight position={[-5, 2, -2]} intensity={1.1} color="#ffd9a8" />
        <directionalLight position={[0, -3, 2]} intensity={0.5} color="#ff9a5c" />

        <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.9} floatingRange={[-0.12, 0.12]}>
          <MascotModel />
        </Float>
      </Canvas>
    </div>
  )
}

// preload modelu + typ GLTF
useGLTF.preload(MODEL_URL)