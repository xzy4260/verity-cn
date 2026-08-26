"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { VARIANTS, getTalkingVariant } from "@/lib/verity-variants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Mic, MicOff, RotateCcw } from "lucide-react";

// 球体几何体（UV 优化，贴合人脸纹理）
function createSphereGeometry(
  radius = 0.5,
  lat = 32,
  lon = 32
): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const pos: number[] = [];
  const uvs: number[] = [];
  const idx: number[] = [];
  for (let la = 0; la <= lat; la++) {
    const theta = (la * Math.PI) / lat;
    const st = Math.sin(theta);
    const ct = Math.cos(theta);
    for (let lo = 0; lo <= lon; lo++) {
      const phi = (lo * 2 * Math.PI) / lon;
      pos.push(radius * st * Math.cos(phi), radius * ct, radius * st * Math.sin(phi));
      let u = phi / (Math.PI * 2);
      let v = 0.25 + (theta / Math.PI) * 0.5;
      u = THREE.MathUtils.clamp(0.5 + (u - 0.5) * 1.3, 0, 1);
      v = THREE.MathUtils.clamp(0.5 + (v - 0.5) * 1.3, 0, 1);
      uvs.push(u, v);
    }
  }
  for (let la = 0; la < lat; la++) {
    for (let lo = 0; lo < lon; lo++) {
      const f = la * (lon + 1) + lo;
      const s = f + lon + 1;
      idx.push(f, s, f + 1, s, s + 1, f + 1);
    }
  }
  geo.setIndex(idx);
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.computeVertexNormals();
  return geo;
}

// 球体 Mesh
function VeritySphere({
  variant,
  isTalking,
}: {
  variant: string;
  isTalking: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const targetScale = useRef({ x: 0.5, y: 0.5, z: 0.5 });
  const currentScale = useRef({ x: 0.5, y: 0.5, z: 0.5 });
  const geometry = useMemo(() => createSphereGeometry(0.5, 32, 32), []);

  const texture = useMemo(() => {
    const id = isTalking ? getTalkingVariant(variant) : variant;
    const tex = new THREE.TextureLoader().load(`/textures/${id}.png`);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    tex.flipY = false;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, [variant, isTalking]);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(() => {
    if (!groupRef.current) return;
    if (isTalking) {
      const t = performance.now() / 1000;
      const sy = 1.0 + Math.sin(t * 12.375) * 0.12;
      const sx = 1.0 + (1.0 - sy) * 0.5;
      targetScale.current = { x: 0.5 * sx, y: 0.5 * sy, z: 0.5 * sx };
    } else {
      targetScale.current = { x: 0.5, y: 0.5, z: 0.5 };
    }
    const lerp = 0.15;
    currentScale.current.x += (targetScale.current.x - currentScale.current.x) * lerp;
    currentScale.current.y += (targetScale.current.y - currentScale.current.y) * lerp;
    currentScale.current.z += (targetScale.current.z - currentScale.current.z) * lerp;
    groupRef.current.scale.set(
      currentScale.current.x,
      currentScale.current.y,
      currentScale.current.z
    );
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          ref={matRef}
          map={texture}
          transparent
          alphaTest={0.05}
          side={THREE.FrontSide}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}

// 场景（灯光 + 拖拽 + 缩放）
function Scene({
  variant,
  isTalking,
  onResetRotation,
}: {
  variant: string;
  isTalking: boolean;
  onResetRotation: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStartDist = useRef<number | null>(null);
  const pinchStartZ = useRef<number>(1.5);
  const damping = 0.9;

  const getPinchDist = useCallback(() => {
    const pts = Array.from(pointers.current.values());
    if (pts.length < 2) return null;
    const dx = pts[0].x - pts[1].x;
    const dy = pts[0].y - pts[1].y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  useEffect(() => {
    camera.position.set(0, 0, 1.5);
    camera.lookAt(0, 0, 0);
    if (groupRef.current) {
      groupRef.current.rotation.y = -Math.PI / 2;
    }
  }, [camera]);

  useEffect(() => {
    (window as any).__verityResetRotation = () => {
      if (groupRef.current) {
        groupRef.current.rotation.set(0, 0, 0);
        velocity.current = { x: 0, y: 0 };
      }
    };
  }, []);

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.current.size === 1) {
        // First finger — start drag
        isDragging.current = true;
        lastMouse.current = { x: e.clientX, y: e.clientY };
        velocity.current = { x: 0, y: 0 };
        gl.domElement.style.cursor = "grabbing";
      } else if (pointers.current.size === 2) {
        // Second finger — start pinch
        isDragging.current = false;
        velocity.current = { x: 0, y: 0 };
        pinchStartDist.current = getPinchDist();
        pinchStartZ.current = camera.position.z;
      }
    },
    [gl, camera, getPinchDist]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const pt = pointers.current.get(e.pointerId);
      if (!pt) return;
      pt.x = e.clientX;
      pt.y = e.clientY;

      if (pointers.current.size === 2 && pinchStartDist.current !== null) {
        // Pinch zoom
        const dist = getPinchDist();
        if (dist && pinchStartDist.current) {
          const scale = pinchStartDist.current / dist;
          camera.position.z = THREE.MathUtils.clamp(
            pinchStartZ.current * scale,
            0.3,
            4
          );
        }
      } else if (pointers.current.size === 1 && isDragging.current && groupRef.current) {
        // Single finger drag — rotate
        const dx = e.clientX - lastMouse.current.x;
        const dy = e.clientY - lastMouse.current.y;
        lastMouse.current = { x: e.clientX, y: e.clientY };
        velocity.current.x = -dy * 0.008;
        velocity.current.y = -dx * 0.008;
        groupRef.current.rotation.x -= dy * 0.008;
        groupRef.current.rotation.y -= dx * 0.008;
      }
    },
    [camera, getPinchDist]
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      pointers.current.delete(e.pointerId);
      if (pointers.current.size < 2) {
        pinchStartDist.current = null;
      }
      if (pointers.current.size === 0) {
        isDragging.current = false;
        gl.domElement.style.cursor = "grab";
      } else if (pointers.current.size === 1) {
        // One finger remains — resume drag from its position
        const remaining = Array.from(pointers.current.entries())[0];
        lastMouse.current = { x: remaining[1].x, y: remaining[1].y };
        isDragging.current = true;
      }
    },
    [gl]
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = THREE.MathUtils.clamp(
        camera.position.z + e.deltaY * 0.001,
        0.3,
        4
      );
    },
    [camera]
  );

  useFrame(() => {
    if (isDragging.current || !groupRef.current) return;
    velocity.current.x *= damping;
    velocity.current.y *= damping;
    groupRef.current.rotation.x += velocity.current.x;
    groupRef.current.rotation.y += velocity.current.y;
  });

  useEffect(() => {
    const c = gl.domElement;
    c.style.cursor = "grab";
    c.addEventListener("pointerdown", handlePointerDown);
    c.addEventListener("pointermove", handlePointerMove);
    c.addEventListener("pointerup", handlePointerUp);
    c.addEventListener("pointercancel", handlePointerUp);
    c.addEventListener("pointerleave", handlePointerUp);
    c.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      c.removeEventListener("pointerdown", handlePointerDown);
      c.removeEventListener("pointermove", handlePointerMove);
      c.removeEventListener("pointerup", handlePointerUp);
      c.removeEventListener("pointercancel", handlePointerUp);
      c.removeEventListener("pointerleave", handlePointerUp);
      c.removeEventListener("wheel", handleWheel);
    };
  }, [gl, handlePointerDown, handlePointerMove, handlePointerUp, handleWheel]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#aaccff" />
      <pointLight position={[0, -2, 3]} intensity={0.3} color="#ffddcc" />
      <group ref={groupRef}>
        <VeritySphere variant={variant} isTalking={isTalking} />
      </group>
    </>
  );
}

// 主组件
export function VerityModel() {
  const [variant, setVariant] = useState("happy");
  const [isTalking, setIsTalking] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  // 表情条：鼠标滚轮横向滚动（悬停时阻止页面纵向滚动）
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;
      e.preventDefault();
      el.scrollLeft += Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const handleReset = () => {
    if ((window as any).__verityResetRotation) {
      (window as any).__verityResetRotation();
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* 3D 画布 */}
      <div className="relative flex-1 min-h-0">
        <Canvas
          camera={{ position: [0, 0, 1.5], fov: 45, near: 0.1, far: 100 }}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
          onCreated={({ gl }) => {
            (gl.domElement as HTMLElement).style.touchAction = "none";
          }}
          style={{ background: "transparent" }}
        >
          <Scene variant={variant} isTalking={isTalking} onResetRotation={handleReset} />
        </Canvas>
      </div>

      {/* 控制栏 */}
      <div className="flex items-center gap-3 px-3 py-2 border-t border-border/50">
        {/* 当前情绪 */}
        <Badge variant="secondary" className="shrink-0 text-xs">
          {VARIANTS.find((v) => v.id === variant)?.label ?? variant}
        </Badge>

        {/* 表情选择条（溢出时横向滚动） */}
        <div
          ref={stripRef}
          className="scrollbar-thin-x flex min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-lg bg-background/80 p-1 backdrop-blur-sm border border-border/50"
        >
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              onClick={() => setVariant(v.id)}
              className={`size-7 shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                variant === v.id
                  ? "border-primary"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
              title={v.label}
            >
              <img
                src={`/textures/${v.id}.png`}
                alt={v.label}
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {/* 说话开关 */}
          <div className="flex items-center gap-1.5">
            {isTalking ? (
              <Mic className="size-3.5 text-primary" />
            ) : (
              <MicOff className="size-3.5 text-muted-foreground" />
            )}
            <Switch
              checked={isTalking}
              onCheckedChange={setIsTalking}
              className="scale-75"
            />
          </div>

          {/* 重置旋转 */}
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={handleReset}
            title="重置旋转"
          >
            <RotateCcw className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
