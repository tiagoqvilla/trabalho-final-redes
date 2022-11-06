const Overlap = require('overlap')
const Couleurs = require('couleurs')
const Box = require('cli-box')

let generatedRooms = []
let marksConfigs = {
  nw: '╔',
  n: '═',
  ne: '╗',
  e: '║',
  se: '╝',
  s: '═',
  sw: '╚',
  w: '║',
}
/**
 * Gera as salas para o mapa
 * @param {string} currentPlayer
 */
const generateRooms = (rooms, currentPlayer) => {
  for (const [key, value] of Object.entries(rooms)) {
    let player = value.players.includes(currentPlayer) ? 'X' : ''
    let box = Box(
      {
        w: 10,
        h: 2,
        marks: marksConfigs,
      },
      Couleurs(player, '#c0392b')
    )
    generatedRooms.push(box)
  }
}

/**
 * Printa o mapa contendo a posição atual do jogador
 * @param {string} currentPlayer
 */
const printMap = (rooms, currentPlayer) => {
  generateRooms(rooms, currentPlayer)

  let outerBox = Box(
    {
      w: 5,
      h: 20,
      fullscreen: true,
      marks: marksConfigs,
    },
    {
      text: Couleurs('Localização Atual do Jogador', [255, 255, 0]),
      vAlign: 'top',
      hAlign: 'right',
    }
  )

  // Sala 1
  let currentMap = Overlap({
    who: outerBox,
    with: generatedRooms[0],
    where: {
      x: 50,
      y: 5,
    },
  })

  // Sala 2
  currentMap = Overlap({
    who: currentMap,
    with: generatedRooms[1],
    where: {
      x: 60,
      y: 5,
    },
  })

  // Sala 3
  currentMap = Overlap({
    who: currentMap,
    with: generatedRooms[2],
    where: {
      x: 60,
      y: 9,
    },
  })

  // Sala 4
  currentMap = Overlap({
    who: currentMap,
    with: generatedRooms[3],
    where: {
      x: 60,
      y: 1,
    },
  })

  // Sala 5
  currentMap = Overlap({
    who: currentMap,
    with: generatedRooms[4],
    where: {
      x: 70,
      y: 1,
    },
  })
  console.log(currentMap)
}

module.exports = printMap
