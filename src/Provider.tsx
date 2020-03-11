import React, { useState, useEffect, useRef, useMemo } from 'react'
// @ts-ignore
import CannonWorker from '../src/worker'
import { context } from './index'

export type ProviderProps = {
  children: React.ReactNode
  gravity?: number[]
  tolerance?: number
  step?: number
  iterations?: number
  allowSleep?: boolean
  broadphase?: 'Naive' | 'SAP'
  axisIndex?: number
  size?: number
}

export type Buffers = { positions: Float32Array; quaternions: Float32Array }

type ProviderContext = {
  worker: Worker
  bodies: React.MutableRefObject<{ [uuid: string]: number }>
  buffers: Buffers
}

type WorkerEvent = {
  data: {
    op: string
    positions: Float32Array
    quaternions: Float32Array
    bodies: string[]
  }
}

export default function Provider({
  children,
  step = 1 / 60,
  gravity = [0, -10, 0],
  tolerance = 0.001,
  iterations = 5,
  allowSleep = true,
  broadphase = 'Naive',
  axisIndex = 0,
  size = 1000,
}: ProviderProps): JSX.Element {
  const [worker] = useState<Worker>(() => new CannonWorker() as Worker)
  const [buffers] = useState<Buffers>(() => ({
    positions: new Float32Array(size * 3),
    quaternions: new Float32Array(size * 4),
  }))
  const bodies = useRef<{ [uuid: string]: number }>({})

  useEffect(() => {
    worker.postMessage({
      op: 'init',
      props: { gravity, tolerance, step, iterations, broadphase, allowSleep, axisIndex },
    })

    function loop() {
      worker.postMessage({ op: 'step', ...buffers }, [
        buffers.positions.buffer,
        buffers.quaternions.buffer,
      ])
    }

    worker.onmessage = (e: WorkerEvent) => {
      switch (e.data.op) {
        case 'frame':
          buffers.positions = e.data.positions
          buffers.quaternions = e.data.quaternions
          requestAnimationFrame(loop)
          break
        case 'sync':
          bodies.current = e.data.bodies.reduce(
            (acc, id) => ({ ...acc, [id]: e.data.bodies.indexOf(id) }),
            {}
          )
          break
        case 'event':
          //bodies.current[e.data.bodies[0]]
          break;
      }
    }
    loop()
    return () => worker.terminate()
  }, [])

  const api = useMemo(() => ({ worker, bodies, buffers }), [worker, bodies, buffers])
  return <context.Provider value={api as ProviderContext}>{children}</context.Provider>
}