import { createRoot, extend } from "@react-three/fiber"
import { useEffect, useState } from "react"
import * as THREE from "three"

import Scene from "../../components/Scene"
import { createPointerEvents, emitter } from "./events"

extend(THREE)

let root

const CompWrapper = (initialProps) => {
  const [props, setProps] = useState(initialProps)

  useEffect(() => {
    emitter.on("props", (p) => {
      setProps(p)
    })
    return () => {
      emitter.off("props", setProps)
    }
  }, [])

  return <Scene {...props} />
}

const handleInit = (payload) => {
  const { props, drawingSurface: canvas, width, height, pixelRatio } = payload

  root = createRoot(canvas)

  root.configure({
    events: createPointerEvents,
    size: {
      width,
      height,
      updateStyle: false,
    },
    dpr: pixelRatio,
  })

  root.render(<CompWrapper {...props} />)
}

const handleResize = ({ width, height, dpr }) => {
  if (!root) return
  root.configure({
    size: {
      width,
      height,
      updateStyle: false,
    },
    dpr,
  })
}

const handleEvents = (payload) => {
  emitter.emit(payload.eventName, payload)
  emitter.on("disconnect", () => {
    self.postMessage({ type: "dom_events_disconnect" })
  })
}

const handleProps = (payload) => {
  emitter.emit("props", payload)
}

const handlerMap = {
  resize: handleResize,
  init: handleInit,
  dom_events: handleEvents,
  props: handleProps,
}

self.onmessage = (event) => {
  const { type, payload } = event.data
  const handler = handlerMap[type]
  if (handler) handler(payload)
}

self.window = {}
