import "./styles.css"

import { Canvas } from "@react-three/fiber"
import { Suspense, useContext } from "react"
import { createRoot } from "react-dom/client"
import { Context } from "src/components/Context"
import Scene from "src/components/Scene"
import { States } from "src/constants"
import { StateContext } from "src/hooks/StateContext"

import ThreeFiberOffscreen from "./ThreeFiberOffscreen"

const Button = () => {
  const { setState } = useContext(StateContext)

  const handleClick = () => {
    // next state
    setState((state) =>
      Math.min((state + 1) % (Object.keys(States).length / 2))
    )
  }

  return <button onClick={handleClick}>next</button>
}

const Dev = () => {
  const { state } = useContext(StateContext)
  return (
    <Canvas>
      <Scene state={state} />
    </Canvas>
  )
}

const Root = () => {
  const dev = process.env.NODE_ENV === "development"

  return (
    <Context>
      <Suspense fallback={null}>
        {dev ? <Dev /> : <ThreeFiberOffscreen />}
      </Suspense>
      <Button />
    </Context>
  )
}

createRoot(document.getElementById("root")).render(<Root />)
