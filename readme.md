![Imgur](https://imgur.com/FpBsJPL.jpg)

<br/>

    yarn add use-cannon

Live demo: https://codesandbox.io/s/r3f-cannon-instanced-physics-g1s88

Experimental web-worker based React hooks for cannon (using [cannon-es](https://github.com/drcmda/cannon-es)) in combination with [react-three-fiber](https://github.com/react-spring/react-three-fiber). Right now it only supports planes and boxes, for individual objects or instanced objects. The public api can only set positions for now. If you need more, please submit your PRs.

How does it work? It subscribes the view part of a component to cannons physics world and unsubscribes on unmount. You don't put position/rotation/scale into the mesh any longer, you put it into the hook, which takes care of forwarding all movements.

# Api

```jsx
function Plane() {
  const [ref] = usePlane(() => ({ mass: 0 }))
  return (
    <mesh ref={ref}>
      <planeBufferGeometry attach="geometry" />
    </mesh>
  )
}

function Box() {
  const [ref, api] = useBox(() => ({ 
    mass: 1,
    position: [0, 0, 10],
    args: { halfExtents: [0.5, 0.5, 0.5] }
  }))
  return (
    <mesh ref={ref}>
      <boxBufferGeometry attach="geometry" />
    </mesh>
  )
}

function InstancedSpheres({ number = 100 }) {
  const [ref, api] = useSphere(index => ({ 
    mass: 1,
    position: [0, 0, index + 10],
    args: { radius: 0.5 }
  }))
  return (
    <instancedMesh ref={ref} args={[null, null, number]}>
      <sphereBufferGeometry attach="geometry" />
    </instancedMesh>
  )
}

function App() {
  return (
    <Physics gravity={[0, 0, -10]}>
      <Plane />
      <Box />
      <InstancedSpheres />
    </Physics>
  )
}
```

## Exports

```jsx
export declare function Physics({ children, step, gravity, tolerance, }: PhysicsProps): React.ReactNode
export declare function usePlane(fn: PlaneFn, deps?: any[]): Api
export declare function useBox(fn: BoxFn, deps?: any[]): Api
export declare function useCylinder(fn: CylinderFn, deps?: any[]): Api
export declare function useHeightfield(fn: HeightfieldFn, deps?: any[]): Api
export declare function useParticle(fn: ParticleFn, deps?: any[]): Api
export declare function useSphere(fn: SphereFn, deps?: any[]): Api
export declare function useTrimesh(fn: TrimeshFn, deps?: any[]): Api
```

## Returned api

```jsx
declare type Api = [React.MutableRefObject<THREE.Object3D | undefined>, ({
  setPosition: (x: number, y: number, z: number) => void
  setRotation: (x: number, y: number, z: number) => void
  setPositionAt: (index: number, x: number, y: number, z: number) => void
  setRotationAt: (index: number, x: number, y: number, z: number) => void
} | undefined)]
```

## Props

```jsx
declare type PhysicsProps = {
  children: React.ReactNode
  gravity?: number[]
  tolerance?: number
  step?: number
}

declare type ShapeProps = {
  position?: number[]
  rotation?: number[]
  scale?: number[]
  mass?: number
}
declare type PlaneProps = ShapeProps & {}
declare type BoxProps = ShapeProps & { args?: { halfExtents?: number[] } }
declare type CylinderProps = ShapeProps & {
  args?: {
    radiusTop?: number
    radiusBottom?: number
    height?: number
    numSegments?: number
  }
}
declare type HeightfieldProps = ShapeProps & {
  args?: {
    data?: number[]
    minValue?: number
    maxValue?: number
    elementSize?: number
  }
}
declare type ParticleProps = ShapeProps & {}
declare type SphereProps = ShapeProps & { args?: { radius?: number } }
declare type TrimeshProps = ShapeProps & {
  args?: { vertices?: number[], indices?: number[] }
}

declare type PlaneFn = (ref: THREE.Object3D, index?: number) => PlaneProps
declare type BoxFn = (ref: THREE.Object3D, index?: number) => BoxProps
declare type CylinderFn = (ref: THREE.Object3D, index?: number) => CylinderProps
declare type HeightfieldFn = (ref: THREE.Object3D, index?: number) => HeightfieldProps
declare type ParticleFn = (ref: THREE.Object3D, index?: number) => ParticleProps
declare type SphereFn = (ref: THREE.Object3D, index?: number) => SphereProps
declare type TrimeshFn = (ref: THREE.Object3D, index?: number) => TrimeshProps
```
