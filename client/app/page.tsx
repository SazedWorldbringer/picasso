"use client";

import { FC, useEffect } from "react";
import { useState } from "react";

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

const page: FC<pageProps> = ({ }) => {
  const [color, setColor] = useState<string>('#000')
  const { canvasRef, onMouseDown, clear } = useDraw(createLine)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')

    socket.on('draw-line', ({ prevPoint, currentPoint, color }: DrawLineProps) => {
      if (!ctx) return
      drawLine({ prevPoint, currentPoint, ctx, color })
    })

    socket.on('clear', clear)
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

export default page
