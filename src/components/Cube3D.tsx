import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import * as THREE from 'three'

const CELL = 1
const TILE_SIZE = 0.94
const TILE_RADIUS = 0.1
const TILE_LIFT = 0.004
const MAX_OFFSET = 2
const DB_MIN = -85
const DB_MAX = -20

type FaceKey = 'px' | 'nx' | 'py' | 'ny' | 'pz' | 'nz'

interface FaceMeta {
  normal: [number, number, number]
  rot: [number, number, number]
  tone: string
}

const FACES: Record<FaceKey, FaceMeta> = {
  px: { normal: [1, 0, 0], rot: [0, Math.PI / 2, 0], tone: '#1f1f23' },
  nx: { normal: [-1, 0, 0], rot: [0, -Math.PI / 2, 0], tone: '#111114' },
  py: { normal: [0, 1, 0], rot: [-Math.PI / 2, 0, 0], tone: '#333338' },
  ny: { normal: [0, -1, 0], rot: [Math.PI / 2, 0, 0], tone: '#09090b' },
  pz: { normal: [0, 0, 1], rot: [0, 0, 0], tone: '#242428' },
  nz: { normal: [0, 0, -1], rot: [0, Math.PI, 0], tone: '#151518' },
}

const FACE_KEYS = Object.keys(FACES) as FaceKey[]

interface Cell {
  id: number
  base: THREE.Vector3
  faces: FaceKey[]
}

function buildCells(): Cell[] {
  const out: Cell[] = []
  let id = 0
  for (const x of [-1, 0, 1]) {
    for (const y of [-1, 0, 1]) {
      for (const z of [-1, 0, 1]) {
        if (x === 0 && y === 0 && z === 0) continue
        const faces: FaceKey[] = []
        if (x === 1) faces.push('px')
        if (x === -1) faces.push('nx')
        if (y === 1) faces.push('py')
        if (y === -1) faces.push('ny')
        if (z === 1) faces.push('pz')
        if (z === -1) faces.push('nz')
        out.push({ id: id++, base: new THREE.Vector3(x, y, z), faces })
      }
    }
  }
  return out
}

function roundedRectShape(w: number, h: number, r: number) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  const hp = Math.PI / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.absarc(x + w - r, y + r, r, -hp, 0, false)
  s.lineTo(x + w, y + h - r)
  s.absarc(x + w - r, y + h - r, r, 0, hp, false)
  s.lineTo(x + r, y + h)
  s.absarc(x + r, y + h - r, r, hp, Math.PI, false)
  s.lineTo(x, y + r)
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false)
  return s
}

interface Band {
  lo: number
  hi: number
  gain: number
  threshold: number
  scale: number
  attack: number
  release: number
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildBands(cells: Cell[]) {
  const rng = mulberry32(20260821)
  const n = cells.length
  const edge = (i: number) => Math.max(2, Math.round(2 * Math.pow(170, i / n)))
  const list: Band[] = []
  for (let i = 0; i < n; i++) {
    const lo = edge(i)
    const hi = Math.max(lo + 1, edge(i + 1))
    const comp = 1 + (lo / 340) * 1.6
    list.push({
      lo,
      hi,
      gain: comp,
      threshold: 0,
      scale: 1,
      attack: 0,
      release: 0,
    })
  }
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  list.forEach((b) => {
    b.gain *= 0.85 + rng() * 0.5
    b.threshold = 0.35 + rng() * 0.3
    b.scale = 2.5 + rng() * 2
    b.attack = 15 + rng() * 12
    b.release = 3.5 + rng() * 3
  })
  const map = new Map<number, Band>()
  cells.forEach((c, i) => map.set(c.id, list[i]))
  const dirs = new Map<number, FaceKey>()
  cells.forEach((c) => {
    dirs.set(c.id, c.faces[Math.floor(rng() * c.faces.length)])
  })
  return { map, dirs }
}

interface CubeModelProps {
  analyserRef: MutableRefObject<AnalyserNode | null>
  playing: boolean
}

function CubeModel({ analyserRef, playing }: CubeModelProps) {
  const cells = useMemo(buildCells, [])
  const bands = useMemo(() => buildBands(cells), [cells])
  const groups = useRef<(THREE.Group | null)[]>([])
  const shafts = useRef<(THREE.Mesh | null)[]>([])
  const cur = useRef<Record<number, number>>({})
  const dataRef = useRef<Float32Array<ArrayBuffer> | null>(null)
  const mainGroupRef = useRef<THREE.Group>(null)

  const assets = useMemo(() => {
    const bodyGeo = new RoundedBoxGeometry(CELL, CELL, CELL, 3, 0.03)
    const shaftGeo = new THREE.BoxGeometry(CELL, CELL, CELL)
    const tileGeo = new THREE.ShapeGeometry(
      roundedRectShape(TILE_SIZE, TILE_SIZE, TILE_RADIUS),
      8,
    )
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: '#0c0c0e',
      roughness: 0.5,
      metalness: 0.05,
      clearcoat: 0.7,
      clearcoatRoughness: 0.3,
    })
    const tileMats = Object.fromEntries(
      FACE_KEYS.map((k) => [
        k,
        new THREE.MeshPhysicalMaterial({
          color: FACES[k].tone,
          roughness: 0.38,
          metalness: 0.08,
          clearcoat: 0.8,
          clearcoatRoughness: 0.26,
        }),
      ]),
    ) as Record<FaceKey, THREE.MeshPhysicalMaterial>
    return { bodyGeo, shaftGeo, tileGeo, bodyMat, tileMats }
  }, [])

  useEffect(() => {
    return () => {
      assets.bodyGeo.dispose()
      assets.shaftGeo.dispose()
      assets.tileGeo.dispose()
      assets.bodyMat.dispose()
      Object.values(assets.tileMats).forEach((m) => m.dispose())
    }
  }, [assets])

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 20)

    // 斜着旋转（不可被鼠标控制）
    if (mainGroupRef.current) {
      mainGroupRef.current.rotation.x += 0.003
      mainGroupRef.current.rotation.y += 0.005
    }

    const analyser = analyserRef.current

    if (analyser && playing) {
      const bins = analyser.frequencyBinCount
      if (!dataRef.current || dataRef.current.length !== bins) {
        dataRef.current = new Float32Array(bins)
      }
      const data = dataRef.current
      analyser.getFloatFrequencyData(data)

      const bandAvg = (lo: number, hi: number) => {
        let s = 0
        for (let i = lo; i < hi; i++) {
          const db = data[i]
          const v = Math.min(1, Math.max(0, (db - DB_MIN) / (DB_MAX - DB_MIN)))
          s += v
        }
        return s / (hi - lo)
      }

      for (const c of cells) {
        const b = bands.map.get(c.id)!
        const e = bandAvg(b.lo, b.hi) * b.gain
        const prev = cur.current[c.id] ?? 0
        let target = 0
        let rate = b.release
        if (e > b.threshold) {
          const excess = e - b.threshold
          target = Math.min(MAX_OFFSET, excess * b.scale)
          const norm = Math.min(1, excess / 0.4)
          rate = b.attack * (0.4 + 0.6 * norm)
        }
        cur.current[c.id] = prev + (target - prev) * (1 - Math.exp(-delta * rate))
      }
    } else {
      for (const c of cells) {
        const prev = cur.current[c.id] ?? 0
        cur.current[c.id] = prev + (0 - prev) * (1 - Math.exp(-delta * 6))
      }
    }

    cells.forEach((c, i) => {
      const head = groups.current[i]
      const shaft = shafts.current[i]
      if (!head || !shaft) return
      const d = cur.current[c.id] ?? 0
      const n = FACES[bands.dirs.get(c.id)!].normal
      head.position.set(
        c.base.x + n[0] * d,
        c.base.y + n[1] * d,
        c.base.z + n[2] * d,
      )
      if (d > 0.004) {
        shaft.visible = true
        const off = d / 2 - 0.5
        shaft.position.set(
          c.base.x + n[0] * off,
          c.base.y + n[1] * off,
          c.base.z + n[2] * off,
        )
        shaft.scale.set(n[0] !== 0 ? d : 1, n[1] !== 0 ? d : 1, n[2] !== 0 ? d : 1)
      } else {
        shaft.visible = false
      }
    })
  })

  const lift = CELL / 2 + TILE_LIFT

  return (
    <group ref={mainGroupRef}>
      {cells.map((c, i) => (
        <group key={c.id}>
          <group
            ref={(el) => {
              groups.current[i] = el
            }}
            position={[c.base.x, c.base.y, c.base.z]}
          >
            <mesh geometry={assets.bodyGeo} material={assets.bodyMat} />
            {c.faces.map((f) => (
              <mesh
                key={f}
                geometry={assets.tileGeo}
                material={assets.tileMats[f]}
                position={FACES[f].normal.map((n) => n * lift) as [
                  number,
                  number,
                  number,
                ]}
                rotation={FACES[f].rot}
              />
            ))}
          </group>
          <mesh
            ref={(el) => {
              shafts.current[i] = el
            }}
            geometry={assets.shaftGeo}
            material={assets.bodyMat}
            position={[c.base.x, c.base.y, c.base.z]}
            visible={false}
          />
        </group>
      ))}
    </group>
  )
}

export interface Cube3DProps {
  analyserRef: MutableRefObject<AnalyserNode | null>
  playing?: boolean
  className?: string
}

export default function Cube3D({
  analyserRef,
  playing = false,
  className,
}: Cube3DProps) {
  return (
    <div
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      <Canvas
        dpr={[1, 2]}
        flat
        camera={{ position: [6, 4.5, 7.2], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[6, 10, 6]} intensity={1.5} />
        <directionalLight position={[-8, -4, -8]} intensity={0.45} />
        <directionalLight position={[0, 8, -9]} intensity={0.9} />
        <CubeModel analyserRef={analyserRef} playing={playing} />
        <ContactShadows
          position={[0, -2.3, 0]}
          opacity={0.5}
          scale={14}
          blur={2.4}
          far={5}
        />
      </Canvas>
    </div>
  )
}
