import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Eraser, Move, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { Game } from "@/draw/Game";
import { Button } from "./ui/button";

export type Tool = "circle" | "rect" | "pencil" | "eraser" | "pan";

export function Canvas({
    roomId,
    socket
}: {
    socket: WebSocket;
    roomId: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("circle")
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const link = window.location.href
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);

        } catch (err) {
            console.log(" failed to share");
        }
    }
    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game]);

    useEffect(() => {

        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket);
            setGame(g);

            return () => {
                g.destroy();
            }
        }


    }, [canvasRef]);

    return <div style={{
        height: "100vh",
        overflow: "hidden"
    }}>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} handleShare={handleShare} copied={copied} roomId={roomId} />
    </div>
}

function Topbar({ selectedTool, setSelectedTool, copied, handleShare, roomId }: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
    handleShare: () => void
    copied: boolean
    roomId: string
}) {
    return <div

        className=" fixed top-2  flex justify-between items-center w-full z-50"
    >
        {/* <div className="flex flex-col border  w-auto  ml-2 rounded-lg  bg-blue-500">
            <span className="text-lg text-white font-semibold">
                Room: {roomId}
            </span>
        </div> */}
        <Button  className="m-4 bg-blue-500 text-black cursor-pointer text-white h-11">
            RoomId : {roomId}
        </Button>

        <div className="flex gap-t border bg-gray-500 rounded-lg shadow-lg cursor-pointer ">
            <IconButton
                onClick={() => {
                    setSelectedTool("pencil")
                }}
                activated={selectedTool === "pencil"}
                icon={<Pencil />}
            />
            <IconButton onClick={() => {
                setSelectedTool("rect")
            }} activated={selectedTool === "rect"} icon={<RectangleHorizontalIcon />} ></IconButton>
            <IconButton onClick={() => {
                setSelectedTool("circle")
            }} activated={selectedTool === "circle"} icon={<Circle />}></IconButton>
            <IconButton onClick={() => {
                setSelectedTool("eraser")
            }} activated={selectedTool === "eraser"} icon={<Eraser />}></IconButton>
            <IconButton onClick={() => {
                setSelectedTool("pan")
            }} activated={selectedTool === "pan"} icon={<Move />}></IconButton>
        </div>

        {/* <button className="border border-2 h-10 w-10"/> */}
        <Button onClick={handleShare} className="m-4 bg-blue-500 text-black onhover: text-white">
            {copied ? "Copied" : "Share"}
        </Button>
    </div>
}

