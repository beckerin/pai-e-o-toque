export default function createGame(state, controls) {

    var interval = null
    var intervalMoveEnemy = null
    var intervalText = null

    function gameStarted() {
        return interval && intervalMoveEnemy
    }
    
    function preGame() {
        // Tela visual do jogo antes de começar o mesmo
        controls.subscribe(keyPress)
        
        createText('textoInicial','Aperta spaco para começar','#000', state.screen.width/5.5, state.screen.height/2)

        updateLeaderboard()
    }
    function start() {
        // começa de fato a se jogar, entrará os binds de controle
        removeText({textId: 'textoInicial'})
        interval = setInterval(addObstacle, 500 * state.difficult.spawn )
        intervalMoveEnemy = setInterval(moveEnemy, 1000 * state.difficult.speed)
        intervalText = setInterval(textUpdate, 100)
        removeText({textId: 'placar'})
        removeText({textId: 'lider'})
        state.currentPlayer = addPlayer()
        controls.subscribe(movePlayer)
        
    }
    function end() {
        // desativará os binds de controle e encerrará o jogo
        clearInterval(interval)
        interval = null

        clearInterval(intervalMoveEnemy)
        intervalMoveEnemy = null

        clearInterval(intervalText)
        intervalText = null

        
        controls.unscribe(movePlayer)

        updateLeaderboard()
        createText('textoInicial','Aperte espaço para começar','#000', state.screen.width/5.5, state.screen.height/2)
        
        
        removeText({textId: 'textoPontos'})
        state.currentPlayer = null
        state.reset()
    }
    function textUpdate() {
        createText('textoPontos',`Pontos: ${state.players[state.currentPlayer].points}`,'#000', 0, 20)
    }    
    function detectPlayerColision(player) {
        for (const obstacleId in state.obstacles) {
            const obstacle = state.obstacles[obstacleId]
            if (objectColide(player.x, player.y, obstacle.x, obstacle.y)) {
                end()
            }
        }
    }
    function detectObstacleColision(obstacle) {
        for (const playerId in state.players) {
            const player = state.players[playerId]
            if (objectColide(player.x, player.y, obstacle.x, obstacle.y)) {
                end()
            }
        }
    }
    function keyPress(command) {
        const keyPressed = command.keyPressed

        const validKeys = {
            " "() {
                if (gameStarted()) {
                    end()
                } else {
                    start()
                }
            },
            o() {
                if (!gameStarted() && state.difficult.spawn + 0.1 < 1 && state.difficult.speed + 0.1 < 1) {
                    state.difficult.spawn += 0.1
                    state.difficult.speed += 0.1
                    console.log('Dificuldade diminuida')
                }
            },
            l() {
                if (!gameStarted() && state.difficult.spawn - 0.2 > 0 && state.difficult.speed - 0.2 > 0) {
                    state.difficult.spawn -= 0.1
                    state.difficult.speed -= 0.1
                    console.log('Dificuldade aumentada')
                }
            }
        }

        const keyFunction = validKeys[keyPressed]
        if (keyFunction) {
            keyFunction()
        }
    }
    function movePlayer(command) {
        const keyPressed = command.keyPressed
        const player = state.players[command.playerId]

        const validKeys = {
            ArrowRight(player) {
                if (player.x + state.difficult.size < state.screen.width) player.x += state.difficult.size
            },
            ArrowLeft(player) {
                if (player.x > 0) player.x -= state.difficult.size
            },
        }

        const moveFunction = validKeys[keyPressed]
        if (player && moveFunction) {
            moveFunction(player)
            detectPlayerColision(player)
        }
    }
    function moveObstacle(command) {
        const keyPressed = command.keyPressed
        const obstacle = state.obstacles[command.obstacleId]

        const validKeys = {
            ArrowDown(obstacle) {
                if (obstacle.y < state.screen.height) {
                    obstacle.y += state.difficult.size
                } else {
                    removeObstacle({obstacleId: obstacle.id})
                    addPoints()
                }
            },
            ArrowUp(obstacle) {
                if (obstacle.y < 0) {
                    obstacle.y -+ state.difficult.size
                }
            }
        }
        

        const moveFunction = validKeys[keyPressed]
        if (obstacle && moveFunction) {
            moveFunction(obstacle)
            detectObstacleColision(obstacle)
        }
    }
    function addPoints() {
        const player = state.players[state.currentPlayer]
        player.points += 1
    }
    function addPlayer() {
        let playerId = getRandomId()
    
        state.players[playerId] = {
            id: playerId,
            x: getRandomPos(state.screen.width) ,
            y: state.screen.height - state.difficult.size,
            points: 0,
        }

        return playerId
    }
    function removePlayer(command) {
        delete state.players[command.playerId]
    }
    function addObstacle() {
        let obstacleId = getRandomId()
    
        state.obstacles[obstacleId] = {
            id: obstacleId,
            x: getRandomPos(state.screen.width),
            y: 0,
        }
    }
    function removeObstacle(command) {
        delete state.obstacles[command.obstacleId]
    }
    function createText(textId = getRandomId(),text, color = '#000', x, y) {
        addText({textId, text, color, textX: x, textY: y})
        return textId
    }
    function addText(command) {
        const textId = command.textId
        const color = command.color
        const text = command.text
        const x = command.textX
        const y = command.textY

        state.textRenders[textId] = {
            color,
            text,
            x,
            y
        }
    }
    function removeText(command) {
        delete state.textRenders[command.textId]
    }

    function updateLeaderboard() {
        const points = state.points
        if(state.currentPlayer) {
            const player = state.players[state.currentPlayer]
            if ( player.points > points.max) {
                points.playerId = player.id
                points.max = player.points
            }
        }
        createText('placar',`Pontuação Máxima`,'#000', state.screen.width/5.5, state.screen.height/6)
        createText('lider',`${points.playerId} - ${points.max}`,'#000', state.screen.width/5.5, state.screen.height/4)
    }

    function moveEnemy() {
        for (const obstacleId in state.obstacles) {

            const command = {
                obstacleId: obstacleId,
                keyPressed: 'ArrowDown'
            }

            moveObstacle(command)
        }
    }
    function objectColide(x1, y1, x2, y2) {
        return x1 == x2 && y1 == y2
    }
    function getRandomPos(max) {
        const min = Math.ceil(0)
        max = max / state.difficult.size
        
        const pos = Math.floor(Math.random() * (max - min)) + min
        
        return pos * state.difficult.size
        
    }
    function getRandomId() {
        const min = Math.ceil(0)
        const max = Math.floor(1000)
        return Math.floor(Math.random() * (max - min)) + min
    }

    return{
        preGame,
        start,
        end,
    }
}