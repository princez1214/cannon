![Imgur](https://imgur.com/FpBsJPL.jpg)

<br/>

    yarn add use-cannon

Live demo: https://codesandbox.io/s/r3f-cannon-instanced-physics-g1s88

Experimental web-worker based React hooks for cannon (using [cannon-es](https://github.com/drcmda/cannon-es)) in combination with [react-three-fiber](https://github.com/react-spring/react-three-fiber). Right now it only supports planes and boxes, for individual objects or instanced objects. The public api can only set positions for now. If you need more, please submit your PRs.

How does it work? It subscribes the view part of a component to cannons physics world and unsubscribes on unmount. You don't put position/rotation/scale into the mesh any longer, you put it into the hook, which takes care of forwarding all movements.

# Api

## Physics

Keeps track of physics objects and serves as a provider.

```jsx
<Physics
  children,                     // ...
  gravity = [0, -10, 0],        // default gravity
  tolerance = {0.001} />          // default tolerance
```

## [ref, api] = useCannon(props, deps = [])

Ties a referenced object to cannons physics world.

```jsx
const [ref, api] = useCannon({ type: 'Plane', mass: 0, position: [0, 0, 0] })
return <mesh ref={ref} geometry={planeGeom} />
```

### props

```jsx
{
  type: "Plane" | "Box" | ...,
  args: [...],
  position: [number, number, number],
  rotation: [number, number, number],
  //... all serializable Body props
}
```

### api

```jsx
{
  setPosition((pos: [number, number, number]))
}
```

## [ref, api] = useCannonInstanced(props, index => props, deps = [])

Ties a referenced instanced-mesh to cannons physics world.

```jsx
const [ref, api] = useCannonInstanced({ type: "Box", mass: 1, position: i => positions[i] }))
return <instancedMesh ref={ref} args={[geometry, material, count]} />
```

### props

```jsx
{
  type: "Plane" | "Box" | ...,
  args: [...],
  position: [[number, number, number], ...] | index => [number, number, number],
  rotation: [[number, number, number], ...] | index => [number, number, number],
  //... all serializable Body props
}
```

### api

```jsx
{
  setPositionAt(index, (pos: [number, number, number]))
}
```
