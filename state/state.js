export default function createState() {
  const screen = {
    height: 500,
    width: 900,
  };
  const observers = [];
  const difficult = {
    speed: 0.05,
    spawn: 0.05,
    size: 20,
  };

  const textRenders = {};

  const currentPlayer = null;
  const players = {};
  const obstacles = {};

  const points = {
    max: 9999,
    playerId: "diego",
  };

  function reset() {
    for (const obstacleId in obstacles) {
      delete obstacles[obstacleId];
    }
    for (const playerId in players) {
      delete players[playerId];
    }
  }
  return {
    screen,
    observers,
    difficult,

    textRenders,

    currentPlayer,
    players,
    obstacles,

    points,

    reset,
  };
}
