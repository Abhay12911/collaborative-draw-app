"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Share2, Users2, Sparkles, Github, Download, Plus, Copy, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/ModeToggle";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [roomId, setRoomId] = useState<string>('');
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const handleCreateRoom = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:3001/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: `Room-${Date.now()}` // Generate unique room name
        })
      });

      if (response.ok) {
        const data = await response.json();
        setRoomId(data.roomId.toString());
        setShowRoomModal(true);
      }
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  const handleJoinRoom = async () => {
    const token = localStorage.getItem("authToken");
    if (!token || !joinRoomCode) return;

    try {
      // For now, we'll redirect directly to the room
      // In a real implementation, you'd validate the room exists first
      window.location.href = `/canvas/${joinRoomCode}?token=${token}`;
    } catch (error) {
      console.error("Failed to join room:", error);
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    // You could add a toast notification here
  };

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Pencil className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">ExceliDraw</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button onClick={handleCreateRoom} variant="outline" size="sm" className="flex items-center space-x-2 bg-gray-100">
                  <Plus className="h-4 w-4" />
                  <span>Create Room</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowJoinModal(true)}
                  className="flex items-center space-x-2 bg-gray-100"
                >
                  <Users2 className="h-4 w-4" />
                  <span>Join Room</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
                <ModeToggle />
              </>
            ) : (
              <>
                <Link href="/signin">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="default" size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-white">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 bg-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent tracking-tight sm:text-6xl">
              Collaborative Whiteboarding
              <span className="text-primary block  bg-gradient-to-r from-pink-500 to-blue-700 bg-clip-text text-transparent">Made Simple</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Create, collaborate, and share beautiful diagrams and sketches with our intuitive drawing tool.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {isAuthenticated ? (
                <div className="flex gap-x-4">
                  <Button onClick={handleCreateRoom} variant="default" size="lg" className="h-12 px-6">
                    <Plus className="ml-2 h-4 w-4" />
                    Create Your First Room
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-12 px-6"
                    onClick={() => setShowJoinModal(true)}
                  >
                    <Users2 className="ml-2 h-4 w-4" />
                    Join Room
                  </Button>
                </div>
              ) : (
                <>
                  <Link href="/signin">
                    <Button variant="default" size="lg" className="h-12 px-6">
                      Sign in
                      <Pencil className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="outline" size="lg" className="h-12 px-6">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Everything you need to collaborate
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features that make team collaboration seamless and enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Pencil className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Real-time Drawing</h3>
              </div>
              <p className="text-muted-foreground">
                Draw together in real-time with multiple tools including shapes, lines, and freehand drawing.
              </p>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Team Collaboration</h3>
              </div>
              <p className="text-muted-foreground">
                Invite team members to join your drawing sessions and collaborate seamlessly.
              </p>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Share2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Easy Sharing</h3>
              </div>
              <p className="text-muted-foreground">
                Share your drawings with a simple link. No downloads or installations required.
              </p>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Smart Tools</h3>
              </div>
              <p className="text-muted-foreground">
                Intelligent drawing tools that help you create professional diagrams quickly.
              </p>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Export Options</h3>
              </div>
              <p className="text-muted-foreground">
                Export your drawings in multiple formats for presentations and documentation.
              </p>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Github className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Open Source</h3>
              </div>
              <p className="text-muted-foreground">
                Built with modern web technologies and open source for transparency and community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Room Created Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Room Created!</h2>
              <button
                onClick={() => setShowRoomModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">Share this room ID with others to let them join:</p>
              <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg">
                <span className="font-mono text-lg font-bold text-gray-900">{roomId}</span>
                <button
                  onClick={copyRoomId}
                  className="p-2 hover:bg-gray-200 rounded"
                  title="Copy room ID"
                >
                  <Copy className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  const token = localStorage.getItem("authToken");
                  if (token) {
                    window.location.href = `/canvas/${roomId}?token=${token}`;
                  }
                }}
                className="flex-1"
              >
                Enter Room
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRoomModal(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Join Room</h2>
              <button
                onClick={() => setShowJoinModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Room ID
              </label>
              <input
                type="text"
                id="roomCode"
                value={joinRoomCode}
                onChange={(e) => setJoinRoomCode(e.target.value)}
                placeholder="Enter room ID"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex space-x-3">
              <Button
                variant="default"
                size="sm"
                onClick={handleJoinRoom}
                className="flex-1"
              >
                Join Room
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowJoinModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;