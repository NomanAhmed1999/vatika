"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "../components/Header"
import { Play, Pause, X, ChevronRight, ChevronLeft, Volume2, VolumeX, Maximize } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// Video data
const videos = [
  {
    id: "1",
    title: "The Science of Natural Hair Care",
    thumbnail: "/images/video1.jpeg",
    category: "Hair Care",
    duration: "4:32",
  },
  {
    id: "2",
    title: "5 Ways to Use Vatika Oil",
    thumbnail: "/images/video2.jpeg",
    category: "Tutorials",
    duration: "7:15",
  },
  {
    id: "3",
    title: "Ayurvedic Secrets for Beautiful Skin",
    thumbnail: "/images/vatika3.jpeg",
    category: "Skin Care",
    duration: "5:48",
  },
  {
    id: "4",
    title: "Customer Story: Hair Transformation",
    thumbnail: "/images/vatika4.jpeg",
    category: "Testimonials",
    duration: "3:21",
    },
]

export default function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<(typeof videos)[0] | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All")
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null)
  const [visibleVideos, setVisibleVideos] = useState(videos)

  // Filter videos by category
  useEffect(() => {
    if (activeCategory === "All") {
      setVisibleVideos(videos)
    } else {
      setVisibleVideos(videos.filter((video) => video.category === activeCategory))
    }
  }, [activeCategory])

  // Handle video selection
  const handleVideoSelect = (video: (typeof videos)[0]) => {
    setSelectedVideo(video)
    setIsVideoModalOpen(true)
    setIsPlaying(true)
  }

  // Handle video playback controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number.parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
      } else {
        document.exitFullscreen()
      }
    }
  }

  // Format time for video player
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  const categories = ["All", "Hair Care", "Skin Care", "Tutorials", "Testimonials"]

  return (
    <div className="min-h-screen bg-[#8CC63F]">
      <Header />

      {/* Video Gallery */}
      <section className="py-10 px-4">
        {/* Category Pills */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-4 no-scrollbar">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? "bg-white text-[#003300]"
                    : "bg-[#003300]/20 text-white hover:bg-[#003300]/30"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          <AnimatePresence mode="wait">
            {visibleVideos.map((video) => (
              <motion.div
                key={video.id}
                variants={itemVariants}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                onMouseEnter={() => setHoveredVideo(video.id)}
                onMouseLeave={() => setHoveredVideo(null)}
                onClick={() => handleVideoSelect(video)}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />

                  {/* Overlay with play button */}
                  <div
                    className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
                      hoveredVideo === video.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <motion.div
                      className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: hoveredVideo === video.id ? 1 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Play size={30} className="text-[#8CC63F] ml-1" />
                    </motion.div>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-2 left-2 bg-[#8CC63F] text-white text-xs px-2 py-1 rounded-full">
                    {video.category}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>


      {/* Video Modal */}
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black rounded-lg overflow-hidden">
          <div className="relative">
            {/* Video Player */}
            <div className="relative">
              <video
                ref={videoRef}
                src={selectedVideo?.id ? `/videos/sample-${selectedVideo.id}.mp4` : ""}
                poster={selectedVideo?.thumbnail}
                className="w-full aspect-video object-cover"
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                muted={isMuted}
                autoPlay
              />

              {/* Video Controls - shown on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                {/* Progress Bar */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#8CC63F]"
                  />
                  <div className="flex justify-between text-white/80 text-xs mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration || 0)}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button onClick={togglePlay} className="text-white hover:text-[#8CC63F] transition-colors">
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    <button onClick={toggleMute} className="text-white hover:text-[#8CC63F] transition-colors">
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={toggleFullscreen} className="text-white hover:text-[#8CC63F] transition-colors">
                      <Maximize size={20} />
                    </button>
                    <button
                      onClick={() => setIsVideoModalOpen(false)}
                      className="text-white hover:text-[#8CC63F] transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    

      {/* Footer */}
      {/* <footer className="bg-[#003300] text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} Vatika. All rights reserved.</p>
        </div>
      </footer> */}
    </div>
  )
}
