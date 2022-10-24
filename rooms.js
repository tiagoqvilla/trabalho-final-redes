let rooms = {
    room1: {
        players: [],
        objects:[],
        adjacentRooms: {
            'N': null,
            'S': null,
            'L': 'room2',
            'O': null
        },
    },
    room2: {
        players: [],
        objects:[],
        adjacentRooms: {
            'N': 'room3',
            'S': null,
            'L': null,
            'O': null
        },
    },
    room3: {
        players: [],
        objects:[],
        adjacentRooms: {
            'N': 'room4',
            'S': null,
            'L': null,
            'O': 'room1'
        },
    },
    room4: {
        players: [],
        objects:[],
        adjacentRooms: {
            'N': null,
            'S': 'room3',
            'L': 'room5',
            'O': null
        },
    },
    room5: {
        players: [],
        objects:[],
        adjacentRooms: {
            'N': null,
            'S': null,
            'L': null,
            'O': 'room4'
        },
    }
}

module.exports = rooms;