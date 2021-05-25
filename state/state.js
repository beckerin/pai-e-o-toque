export default function createState() {
    const screen = {
        height: 200,
        width: 250,
    }
    const observers = []
    const difficult = {
        speed: 0.1,
        spawn: 0.5,
        size: 10
    }

    const textRenders = {}

    const currentPlayer = null
    const players = {}
    const obstacles = {}

    const points = {
        max: 1,
        playerId: 'diego'
    }


    function reset() {
        for (const obstacleId in obstacles) {
            delete obstacles[obstacleId]
        }
        for (const playerId in players) {
            delete players[playerId]
        }
    }
    return  {
        screen,
        observers,
        difficult,

        textRenders,

        currentPlayer,
        players,
        obstacles,

        points,

        reset,
    }
}