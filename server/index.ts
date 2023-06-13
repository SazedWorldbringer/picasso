const express = require('express')
const http = require('http')

const app = express()
const server = http.createServer(app)

import { Server } from "socket.io"

const io = new Server(server, {
	cors: {
		origin: "*",
	},
})

type Point = {
	x: number,
	y: number
}

type DrawLine = {
	prevPoint: Point | null
	currentPoint: Point
	color: string
}

io.on('connection', (socket) => {
	console.log('Connected')

	// When new clients join
	socket.on('client-ready', () => {
		socket.broadcast.emit('get-canvas-state')
	})
	// receiving the canvas state on event 'canvas-state',
	// send that state to the clients that just joined
	socket.on('canvas-state', (state) => {
		socket.broadcast.emit('canvas-state-from-server', state)
	})

	// Draw on the canvas
	// emit the 'draw-line' event to every client, except the client that made the changes
	socket.on('draw-line', ({ prevPoint, currentPoint, color }: DrawLine) => {
		socket.broadcast.emit('draw-line', { prevPoint, currentPoint, color })
	})

	// Clear canvas
	// emit the 'clear' event to every single client
	socket.on('clear', () => io.emit('clear'))
})

const PORT = 3001

server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`)
})
