const Overlap = require('overlap')
const Couleurs = require('couleurs')
const Box = require('cli-box')
const rooms = require('./rooms')

let generatedRooms = []
const generateRooms = (rooms, currentPlayer) => {
  for (const [key, value] of Object.entries(rooms)) {
    let player = value.players.includes(currentPlayer) ? 'X' : ''
    let box = Box({ w: 10, h: 2 }, player)
    generatedRooms.push(box)
  }
}

generateRooms(rooms, 'player')

let outerBox = Box({ w: 5, h: 20, fullscreen: true })

// Sala 1
let currentMap = Overlap({
  who: outerBox,
  with: generatedRooms[0],
  where: {
    x: 0,
    y: 5,
  },
})

// Sala 2
currentMap = Overlap({
  who: currentMap,
  with: generatedRooms[1],
  where: {
    x: 10,
    y: 5,
  },
})

// Sala 3
currentMap = Overlap({
  who: currentMap,
  with: generatedRooms[2],
  where: {
    x: 10,
    y: 9,
  },
})

// Sala 4
currentMap = Overlap({
  who: currentMap,
  with: generatedRooms[3],
  where: {
    x: 10,
    y: 1,
  },
})

// Sala 5
currentMap = Overlap({
  who: currentMap,
  with: generatedRooms[4],
  where: {
    x: 20,
    y: 1,
  },
})

const printMap = () => console.log(currentMap)
printMap()

module.exports = printMap
