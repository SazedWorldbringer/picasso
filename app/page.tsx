"use client";

import { useDraw } from "@/hooks/use-draw";
import { FC } from "react";

interface pageProps { }

const page: FC<pageProps> = ({ }) => {
  const { canvasRef, onMouseDown } = useDraw(drawLine)

  // argument order doesn't matter when they're in curly braces
  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint
    const lineColor = '#000'
    const lineWidth = 5

    const startPoint = prevPoint ?? currentPoint
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = lineColor
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(currX, currY)
    ctx.stroke()

    ctx.fillStyle = lineColor
    ctx.beginPath()
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI,)
    ctx.fill()
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <canvas
        onMouseDown={onMouseDown}
        ref={canvasRef}
        width={750}
        height={750}
        className="border border-black rounded-md"
      />
    </div>
  )
}

export default page
