const Overlap = require('overlap')
const Couleurs = require('couleurs')
const Box = require('cli-box')
const rooms = require('./rooms')

const generateRoom = (rooms, currentPlayer) => {
  Object.values(rooms).forEach((room) => {
    let player = room.players.includes('player') ? 'X' : ''
    let box = Box('10x2', player)
    console.log(box)
  })
}

generateRoom(rooms, 'player')

// Create two boxes
// var box1 = Box('20x10', Couleurs('Hello World', [142, 68, 173])),
//   box2 = Box('30x5', Couleurs('Hello Mars!', '#c0392b'))
// // Combine them
// console.log(
//   Overlap({
//     who: box1,
//     with: box2,
//     where: {
//       x: 17,
//       y: 2,
//     },
//   })
// )
