import { shaderMaterial } from "@react-three/drei"
import { extend } from "@react-three/fiber"
import glsl from "babel-plugin-glsl/macro"
import { Color } from "three"

import { colors } from "../../constants"
import frag from "./frag"

const CustomMaterial = shaderMaterial(
  {
    time: 0,
    pink: new Color(colors.pink),
    blue: new Color(colors.blue),
    blur: 0.0,
    position: [0.11, -0.15],
    // distance from center to circle
    radius: 0.15,
    seed: 0,
  },
  glsl`
      varying vec2 vUv;
      void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectionPosition = projectionMatrix * viewPosition;
          gl_Position = projectionPosition;
          vUv = uv;
        }`,
  frag
)

extend({ CustomMaterial })
export { CustomMaterial }
