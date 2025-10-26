
"use client";

import { RoomCanvas } from "@/components/RoomCanvas";
import { useSearchParams } from "next/navigation";

type CanvasPageProps = {
  params: any; // <-- bypass strict type
};

export default function CanvasPage({ params }: CanvasPageProps) {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const roomId = params.roomId;

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Token Required</h1>
          <p className="text-gray-600 mb-4">
            Please provide a valid JWT token as a query parameter
          </p>
          <p className="text-sm text-gray-500">
            Example: /canvas/{roomId}?token=YOUR_JWT_TOKEN
          </p>
        </div>
      </div>
    );
  }

  return <RoomCanvas roomId={roomId} token={token} />;
}
