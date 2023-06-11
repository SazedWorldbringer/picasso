"use client";

import { useDraw } from "@/hooks/use-draw";
import { FC } from "react";

interface pageProps { }

const page: FC<pageProps> = ({ }) => {
  const { canvasRef } = useDraw()

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <canvas
        ref={canvasRef}
        width={750}
        height={750}
        className="border border-black rounded-md"
      />
    </div>
  )
}

export default page
