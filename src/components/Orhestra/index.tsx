import { useFrame } from "@react-three/fiber"
import { States, props } from "src/constants"

import { Circles } from "../Circles"
import { Grid } from "../Grid"

export const Orchestra = ({ state: sceneState }) => {
  useFrame((state, delta) => {
    if (sceneState === States.initial) {
      state.camera.zoom = props.initial.zoom
    } else if (props[States[sceneState]] && props[States[sceneState]].zoom) {
      const desiredZoom = props[States[sceneState]].zoom
      state.camera.zoom += (desiredZoom - state.camera.zoom) * delta * 10
    }
    state.camera.updateProjectionMatrix()
  })

  // const dev = process.env.NODE_ENV === "development"

  return (
    <>
      {/* {dev && <OrbitControls />} */}
      {sceneState === States.grid && (
        <Grid
          rotation={[Math.PI / 2, 0, 0]}
          position-z={0.1}
          infiniteGrid={true}
          sectionSize={0.25}
          cellThickness={1}
          sectionColor="#444"
        />
      )}
      <Circles state={sceneState} />
    </>
  )
}
