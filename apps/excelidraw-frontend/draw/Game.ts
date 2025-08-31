import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "pencil";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
};

export class Game {
    // ======= PRIVATE VARIABLES =======
    private canvas: HTMLCanvasElement;                // The <canvas> element in DOM
    private ctx: CanvasRenderingContext2D;            // 2D drawing context
    private existingShapes: Shape[];                  // All shapes stored in memory
    private roomId: string;                           // Room identifier for socket
    private clicked: boolean;                         // True while mouse is pressed
    private startX = 0;                               // Mouse start X (drawing)
    private startY = 0;                               // Mouse start Y (drawing)
    private previousX = 0;                            // Last mouse X (for pan)
    private previousY = 0;                            // Last mouse Y (for pan)
    private selectedTool: Tool | "pan" = "circle";    // Current active tool

    // Stores camera/viewport transformations
    private viewportTransform = {
        x: 0,   // shift in x
        y: 0,   // shift in y
        scale: 1 // zoom level (not used yet but ready)
    };

    // ======= PUBLIC VARIABLES =======
    socket: WebSocket;  // socket is public → can be accessed from outside

    // ======= CONSTRUCTOR =======
    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;

        // Initialize data and events
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
    }

    // ======= DESTROY =======
    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    }

    // ======= TOOL SELECTOR =======
    setTool(tool: Tool | "pan") {
        this.selectedTool = tool;
    }

    // ======= INIT DATA =======
    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.clearCanvas();
    }

    // ======= SOCKET HANDLERS =======
    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type == "chat") {
                const parsed = JSON.parse(message.message);
                if (parsed.shape) {
                    this.existingShapes.push(parsed.shape);
                }
                this.clearCanvas();
            }
        };
    }

    // ======= CLEAR CANVAS (with transform applied) =======
    clearCanvas() {
        // reset transform to clear correctly
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "rgba(0, 0, 0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // apply panning/zoom
        this.ctx.setTransform(
            this.viewportTransform.scale, 0,
            0, this.viewportTransform.scale,
            this.viewportTransform.x, this.viewportTransform.y
        );

        // draw shapes
        this.existingShapes.forEach((shape) => {
            if (shape.type === "rect") {
                this.ctx.strokeStyle = "rgba(255, 255, 255)";
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (shape.type === "pencil") {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.startX, shape.startY);
                this.ctx.lineTo(shape.endX, shape.endY);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        });
    }

    // ======= PANNING =======
    private updatePanning(e: MouseEvent) {
        const localX = e.clientX;
        const localY = e.clientY;

        this.viewportTransform.x += localX - this.previousX;
        this.viewportTransform.y += localY - this.previousY;

        this.previousX = localX;
        this.previousY = localY;

        this.clearCanvas();
    }
private   pointToLineDistance(p1: { x: number; y: number }, p2: { x: number; y: number }, p: { x: number; y: number }) {
    const A = p.x - p1.x;
    const B = p.y - p1.y;
    const C = p2.x - p1.x;
    const D = p2.y - p1.y;
  
    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) param = dot / len_sq;
  
    let xx, yy;
  
    if (param < 0) {
      xx = p1.x;
      yy = p1.y;
    } else if (param > 1) {
      xx = p2.x;
      yy = p2.y;
    } else {
      xx = p1.x + param * C;
      yy = p1.y + param * D;
    }
  
    const dx = p.x - xx;
    const dy = p.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
    // ======= ZOOMING =======
private updateZooming(e: WheelEvent) {
    e.preventDefault();

    const oldScale = this.viewportTransform.scale;
    const oldX = this.viewportTransform.x;
    const oldY = this.viewportTransform.y;

    const rect = this.canvas.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    // compute new scale
    const previousScale = this.viewportTransform.scale;
    let newScale = this.viewportTransform.scale + e.deltaY * -0.01;

    // clamp scale (avoid infinite zoom)
    newScale = Math.min(Math.max(0.1, newScale), 10);

    // adjust transform so zoom focuses around mouse point
    const newX = localX - (localX - oldX) * (newScale / previousScale);
    const newY = localY - (localY - oldY) * (newScale / previousScale);

    this.viewportTransform.x = newX;
    this.viewportTransform.y = newY;
    this.viewportTransform.scale = newScale;

    this.clearCanvas();
}

    // ======= MOUSE EVENTS =======
    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.previousX = e.clientX;
        this.previousY = e.clientY;
    };

    mouseUpHandler = (e: MouseEvent) => {
        this.clicked = false;

        if (this.selectedTool === "pan") return; // no shapes on pan

        let shape: Shape | null = null;

        if (this.selectedTool === "rect") {
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                width,
                height,
            };
        } else if (this.selectedTool === "circle") {
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            const radius = Math.max(width, height) / 2;
            shape = {
                type: "circle",
                radius,
                centerX: this.startX + radius,
                centerY: this.startY + radius,
            };
        }else if (this.selectedTool === "eraser") {
            // Find shape near mouse point
            const mouseX = e.clientX;
            const mouseY = e.clientY;
          
            // Simple hit detection
            this.existingShapes = this.existingShapes.filter((shape) => {
              if (shape.type === "rect") {
                return !(
                  mouseX >= shape.x &&
                  mouseX <= shape.x + shape.width &&
                  mouseY >= shape.y &&
                  mouseY <= shape.y + shape.height
                );
              } else if (shape.type === "circle") {
                const dx = mouseX - shape.centerX;
                const dy = mouseY - shape.centerY;
                return dx * dx + dy * dy > shape.radius * shape.radius;
              } else if (shape.type === "pencil") {
                // distance from point to line segment (approx eraser size = 5px)
                const dist = this.pointToLineDistance(
                  { x: shape.startX, y: shape.startY },
                  { x: shape.endX, y: shape.endY },
                  { x: mouseX, y: mouseY }
                );
                return dist > 5; // keep if far
              }
              return true;
            });
          
            this.clearCanvas();
          }
          

        if (!shape) return;

        this.existingShapes.push(shape);
        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({ shape }),
            roomId: this.roomId,
        }));
    };

    mouseMoveHandler = (e: MouseEvent) => {
        if (!this.clicked) return;

        if (this.selectedTool === "pan") {
            this.updatePanning(e);
            return;
        }

        if (this.selectedTool === "rect") {
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            this.clearCanvas();
            this.ctx.strokeStyle = "rgba(255, 255, 255)";
            this.ctx.strokeRect(this.startX, this.startY, width, height);
        } else if (this.selectedTool === "circle") {
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            const radius = Math.max(width, height) / 2;
            const centerX = this.startX + radius;
            const centerY = this.startY + radius;
            this.clearCanvas();
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.closePath();
        } else if (this.selectedTool === "pencil") {
            const shape = {
                type: "pencil" as const,
                startX: this.startX,
                startY: this.startY,
                endX: e.clientX,
                endY: e.clientY,
            };
            this.existingShapes.push(shape);
            this.socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify({ shape }),
                roomId: this.roomId,
            }));
            this.startX = e.clientX;
            this.startY = e.clientY;
            this.clearCanvas();
        }
    };

    // ======= INIT LISTENERS =======
    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.addEventListener("wheel", (e) => this.updateZooming(e));
    }
}

