export const colors = {
  pink: "#FF93AD",
  blue: "#4777FE",
}

export enum States {
  initial = 0,
  grid,
  zoomOut,
  connected,
  initial2,
  zoomIn,
}

export const props = {
  initial: {
    zoom: 6.7,
  },
  zoomOut: {
    zoom: 1,
  },
  initial2: {
    zoom: 6.7,
  },
  zoomIn: {
    zoom: 10,
  },
}
