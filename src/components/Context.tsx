import { useState } from "react"
import { States } from "src/constants"
import { StateContext } from "src/hooks/StateContext"

export const Context = ({ children }) => {
  const [state, setState] = useState(States.initial)
  // console.log(state)
  return (
    <StateContext.Provider
      value={{
        state,
        setState,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}
