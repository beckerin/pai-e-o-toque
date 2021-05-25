export default function createControls(state) {

    function subscribe(observeFunction) {
        state.observers.push(observeFunction)
    }

    function unscribe(observeFunction) {
        delete state.observers.pop(observeFunction)
    }

    function notifyAll(command) {
        for (const observeFunction of state.observers) {
            console.log(command)
            observeFunction(command)
        }
    }

    function handleKeydown(event) {
        const keyPressed = event.key

        const command = {
            playerId: state.currentPlayer,
            keyPressed
        }

        notifyAll(command)
    }
  
    document.addEventListener('keydown', handleKeydown)
    return {
        subscribe,
        unscribe
    }
}