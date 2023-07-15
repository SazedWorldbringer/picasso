"use client";

import { FC, useEffect, useState } from "react";

import { useDraw } from "@/hooks/use-draw";
import { drawLine } from "@/lib/utils";

import { ChromePicker } from "react-color";
import { io } from "socket.io-client";

import { Button } from "@/components/ui/button";

const socket = io('http://localhost:3001')

interface pageProps { }

type DrawLineProps = {
  prevPoint: Point | null
  currentPoint: Point
  color: string
}

const Page: FC<pageProps> = ({ }) => {
  const [color, setColor] = useState<string>('#000')
  const { canvasRef, onMouseDown, clear } = useDraw(createLine)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')

    // emit 'client-ready' event when the client loads up
    socket.emit('client-ready')

    // on the 'get-canvas-state' event, send canvas data to the server
    socket.on('get-canvas-state', () => {
      if (!canvasRef.current?.toDataURL()) return
      socket.emit('canvas-state', canvasRef.current.toDataURL())
    })

    // receiving the canvas state back from the server
    socket.on('canvas-state-from-server', (state) => {
      console.log('State received successfully')
      const img = new Image()
      img.src = state
      img.onload = () => {
        ctx?.drawImage(img, 0, 0)
      }
    })

    socket.on('draw-line', ({ prevPoint, currentPoint, color }: DrawLineProps) => {
      if (!ctx) return
      drawLine({ prevPoint, currentPoint, ctx, color })
    })

    socket.on('clear', clear)

    return () => {
        socket.off('get-canvas-state')
        socket.off('canvas-state-from-server')
        socket.off('draw-line')
        socket.off('clear')
      }
  }, [canvasRef])

  // argument order doesn't matter when they're in curly braces
  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    // send data to the server
    socket.emit('draw-line', ({ prevPoint, currentPoint, color }))
    drawLine({ prevPoint, currentPoint, ctx, color })
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col gap-10 pr-10">
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        <Button variant="outline" onClick={() => socket.emit('clear')} type="button">Clear canvas</Button>
      </div>
      <canvas
        onMouseDown={onMouseDown}
        ref={canvasRef}
        width={750}
        height={750}
        className="border border-input rounded-3xl"
      />
    </div>
  )
}

export default Page
