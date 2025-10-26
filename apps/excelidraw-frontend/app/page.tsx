"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Share2, Users2, Sparkles, Github, Download, Plus, Copy, X, Star, Check, ArrowRight, Quote, Play } from "lucide-react";
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
  // const [showDemoModal, setShowDemoModal] = useState(false);

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
    <div className="min-h-screen bg-background bg-black relative overflow-hidden ">
      {/* Grid Background */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,215,0,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,215,0,0.12) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
          backgroundPosition: "0 0",
        }}
      />
      {/* Soft Glow */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(99,102,241,0.25),transparent_60%)]" />
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b bg-transparent ">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center p-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md">
                <Pencil className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-wide">
                CanvasMate
              </span>
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
                    <span >Join Room</span>
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
        <header className="relative overflow-hidden bg-transparent">
          <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 pb-4 via-purple-500 to-blue-500 bg-clip-text text-transparent tracking-tight sm:text-6xl">
                Think Together,Create Faster

              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                Create, collaborate, and share beautiful diagrams and sketches with our intuitive drawing tool.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {isAuthenticated ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-x-4">
                      <Button onClick={handleCreateRoom} variant="default" size="lg" className="h-12 px-6">
                        <Plus className="ml-2 h-4 w-4" />
                        Create Your Room
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
                    <a
                      href="https://drive.google.com/file/d/1afiWzJh__PCnwWCQ18nZXBoHcb-tokzO/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="secondary"
                        size="lg"
                        className="h-12 px-6 bg-white text-black hover:bg-white/90"
                      >
                        Watch Demo
                        <Play className="ml-2 h-4 w-4" />
                      </Button>
                    </a>

                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-4">
                      <Link href="/signin">
                        <Button variant="outline" size="lg" className="h-12 px-6">
                          Sign in
                          <Pencil className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button variant="outline" size="lg" className="h-12 px-6">
                          Sign up
                        </Button>
                      </Link>
                    </div>
                    <a
                      href="https://drive.google.com/file/d/1afiWzJh__PCnwWCQ18nZXBoHcb-tokzO/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="secondary"
                        size="lg"
                        className="h-12 px-6 bg-white text-black hover:bg-white/90"
                      >
                        Watch Demo
                        <Play className="ml-2 h-4 w-4" />
                      </Button>
                    </a>

                  </div>
                )}
              </div>
            </div>
          </div>
        </header>



        {/* Features Section */}
        <section className="py-24 bg-transparent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground ">
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"> Everything you need to collaborate</span>

              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Powerful features that make team collaboration seamless and enjoyable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-wide">Real-time Drawing</h3>
                </div>
                <p className="text-sm text-white/90 leading-relaxed">
                  Draw together in real-time with multiple tools including shapes, lines, and freehand drawing.
                </p>
              </div>



              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-wide">Team Collaboration</h3>
                </div>
                <p className="text-sm text-white/90 leading-relaxed">
                  Invite team members to join your drawing sessions and collaborate seamlessly.
                </p>
              </div>



              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-wide">Easy Sharing</h3>
                </div>
                <p className="text-sm text-white/90 leading-relaxed">
                  Share your drawings with a simple link. No downloads or installations required.
                </p>
              </div>



              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-wide">Smart Tools</h3>
                </div>
                <p className="text-sm text-white/90 leading-relaxed">
                  Intelligent drawing tools that help you create professional diagrams quickly.
                </p>
              </div>


              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-wide">Export Options</h3>
                </div>
                <p className="text-sm text-white/90 leading-relaxed">
                  Export your drawings in multiple formats for presentations and documentation.
                </p>
              </div>



              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-wide">Open Source</h3>
                </div>
                <p className="text-sm text-white/90 leading-relaxed">
                  Built with modern web technologies and open source for transparency and community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-transparent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">How it works</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">Start collaborating in three quick steps.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg" />
                  <h3 className="text-xl font-semibold text-white">Create or join</h3>
                </div>
                <p className="text-sm text-white/80">Spin up a new room or enter an invite code to jump in instantly.</p>
              </div>
              <div className="p-6 rounded-2xl border border-purple-500/20 bg-purple-500/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg" />
                  <h3 className="text-xl font-semibold text-white">Draw together</h3>
                </div>
                <p className="text-sm text-white/80">Use shapes, pens and connectors with live cursors and updates.</p>
              </div>
              <div className="p-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg" />
                  <h3 className="text-xl font-semibold text-white">Share & export</h3>
                </div>
                <p className="text-sm text-white/80">Share a link or export to images for docs, decks and wikis.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-transparent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">Loved by teams</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6">
                <div className="flex items-center gap-1 text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4" />
                  ))}
                </div>
                <p className="text-white/90 mb-4">“This replaced three different tools for our sprint planning and design reviews.”</p>
                <div className="text-sm text-white/60">Priya — Product Manager</div>
              </div>
              <div className="rounded-2xl border border-pink-500/20 bg-pink-500/10 p-6">
                <div className="flex items-center gap-1 text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4" />
                  ))}
                </div>
                <p className="text-white/90 mb-4">“Real-time is buttery smooth. Sketching flows with devs has never been easier.”</p>
                <div className="text-sm text-white/60">Andre — UX Engineer</div>
              </div>
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-6">
                <div className="flex items-center gap-1 text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4" />
                  ))}
                </div>
                <p className="text-white/90 mb-4">“We moved our onboarding diagrams here. New engineers ramp up quicker.”</p>
                <div className="text-sm text-white/60">Lina — Engineering Manager</div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-transparent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">Frequently asked questions</span>
              </h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              <details className="group rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                <summary className="cursor-pointer list-none flex items-center justify-between text-white">
                  Is there a free plan?
                  <span className="ml-4 text-sm text-white/60">{/* iconless toggle */}</span>
                </summary>
                <p className="mt-3 text-sm text-white/80">Yes, you can create rooms and collaborate with core features at no cost.</p>
              </details>
              <details className="group rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <summary className="cursor-pointer list-none flex items-center justify-between text-white">
                  Do I need to install anything?
                  <span className="ml-4 text-sm text-white/60"></span>
                </summary>
                <p className="mt-3 text-sm text-white/80">No. ExceliDraw runs in the browser and works across modern devices.</p>
              </details>
              <details className="group rounded-xl border border-purple-500/20 bg-purple-500/10 p-4">
                <summary className="cursor-pointer list-none flex items-center justify-between text-white">
                  Can I export my boards?
                  <span className="ml-4 text-sm text-white/60"></span>
                </summary>
                <p className="mt-3 text-sm text-white/80">Export diagrams to image formats for slides, docs, and tickets.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-black/30 backdrop-blur p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">Ready to collaborate faster?</h3>
                <p className="mt-2 text-white/80">Create a room now and invite your team.</p>
              </div>
              {isAuthenticated ? (
                <Button onClick={handleCreateRoom} variant="secondary" size="lg" className="bg-white text-black hover:bg-white/90">
                  Create Room
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Link href="/signup">
                  <Button variant="secondary" size="lg" className="bg-white text-black hover:bg-white/90">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className=" flex border-t border-white/10 bg-transparent  justify-between">
          <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between text-sm text-white/60">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Pencil className="h-4 w-4" />
              <p className="hover:text-white">CanvasMate</p>
            </div>
            <div className="flex items-center gap-4">
              <span>All rights reserved</span>
            </div>
            <div>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </footer>

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

        {/* Demo Video Modal */}
        {/* {showDemoModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="relative bg-white rounded-xl shadow-xl p-4 sm:p-6 md:p-8 max-w-4xl w-full mx-4">
              <button
                onClick={() => setShowDemoModal(false)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                aria-label="Close demo"
              >
                <X className="h-6 w-6" />
              </button>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pr-8">Product Demo</h2>
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                <video
                  className="w-full h-full"
                  controls
                  src="https://drive.google.com/uc?export=download&id=1afiWzJh__PCnwWCQ18nZXBoHcb-tokzO
"
                  poster="/vercel.svg"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Replace the video at <code className="font-mono">public/demo.mp4</code> with your own recording.
              </p>
            </div>
          </div>
        )} */}


      </div>
    </div>
  );
}

export default App;


