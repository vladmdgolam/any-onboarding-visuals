import { useEffect, useRef } from "react"

import { DOM_EVENTS } from "./consts"

const OffscreenCanvas = ({ onClick, worker, ...props }) => {
  const canvasRef = useRef()

  useEffect(() => {
    if (!worker) return

    const canvas = canvasRef.current
    const offscreen = canvasRef.current.transferControlToOffscreen()

    worker.postMessage(
      {
        type: "init",
        payload: {
          props,
          drawingSurface: offscreen,
          width: canvas.clientWidth,
          height: canvas.clientHeight,
          pixelRatio: window.devicePixelRatio,
        },
      },
      [offscreen]
    )

    Object.values(DOM_EVENTS).forEach(([eventName, passive]) => {
      canvas.addEventListener(
        eventName,
        (event) => {
          worker.postMessage({
            type: "dom_events",
            payload: {
              eventName,
              clientX: event.clientX,
              clientY: event.clientY,
              offsetX: event.offsetX,
              offsetY: event.offsetY,
              x: event.x,
              y: event.y,
            },
          })
        },
        { passive }
      )
    })

    const handleResize = () => {
      const dpr = window.devicePixelRatio
      worker.postMessage({
        type: "resize",
        payload: {
          width: canvas.clientWidth,
          height: canvas.clientHeight,
          dpr,
        },
      })
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worker])

  useEffect(() => {
    if (!worker) return
    worker.postMessage({
      type: "props",
      payload: props,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])

  return <canvas ref={canvasRef} onClick={onClick} />
}

export default OffscreenCanvas
