import { createContext } from "react"

export const StateContext = createContext({
  state: null,
  setState: (state: any) => {},
})
