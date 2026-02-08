import { io } from "../server.js"

export const emitEvent = (event, data) => {
    if (io) {
        io.emit(event, data)
    }
}
