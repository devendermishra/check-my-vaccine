
export const playSound = (callback: () => void) => {
    var context = new AudioContext()
    var o = context.createOscillator()
    o.type = "sawtooth"
    o.frequency.value = 830.6
    o.connect(context.destination)
    o.start(1)
    o.stop(6)
    delay(7000, callback)
}

const delay = (ms: number, callback: () => void) => {
    return new Promise(resolve => setTimeout(resolve, ms) ).then(() => callback())
}