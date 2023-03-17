import { useContext } from "react"
import { StateContext } from "src/hooks/StateContext"

import OffscreenCanvas from "./OffscreenCanvas"

const worker = new Worker(new URL("./worker/index.js", import.meta.url))

const App = () => {
  const { state } = useContext(StateContext)
  return <OffscreenCanvas state={state} worker={worker} />
}

export default App
