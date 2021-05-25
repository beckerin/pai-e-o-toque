export default function renderScreen(state, requestAnimationFrame) {

    const screen = document.getElementById('game')
    const context = screen.getContext('2d')

    screen.height = state.screen.height
    screen.width = state.screen.width

    context.clearRect(0, 0, screen.height, screen.width)

    for (const playerId in state.players) {
        const player = state.players[playerId]
        context.fillStyle = '#1b131'
        context.fillRect(player.x, player.y, state.difficult.size, state.difficult.size)
    }
    
    for (const obstacleId in state.obstacles) {
        const obstacle = state.obstacles[obstacleId]

        context.fillStyle = '#620d2'
        context.fillRect(obstacle.x, obstacle.y, state.difficult.size, state.difficult.size)
    }

    for (const textRenderId in state.textRenders) {
        const textRender = state.textRenders[textRenderId]

        context.font = '12px Georgia'
        context.fillStyle = textRender.color
        context.fillText(textRender.text, textRender.x, textRender.y)
    }



    requestAnimationFrame(() => {
        renderScreen(state, requestAnimationFrame)
    })

}