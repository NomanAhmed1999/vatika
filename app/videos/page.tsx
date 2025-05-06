"use client"

import { useState } from "react"
import Header from "../components/Header"
import { motion } from "framer-motion"

interface Video {
  url: string
  title: string
  description: string
}

export default function VideosPage() {
  const videos: Video[] = [
    {
      url: "https://youtu.be/7S3AOLh8Sss",
      title: "Vatika Hair Care Tips",
      description: "Learn the best hair care tips from Vatika experts"
    },
    {
      url: "https://youtu.be/hBtKWK5ZS6o?si=BnlethVErfXnBzsa",
      title: "Natural Hair Care Routine",
      description: "Complete natural hair care routine with Vatika products"
    },
    {
      url: "https://youtu.be/u7K4GBeevfo?si=Nipy03CC3-lXaBbW",
      title: "Hair Fall Solutions",
      description: "Effective solutions for hair fall problems"
    },
    {
      url: "https://youtu.be/g1_8U4KN5nk?si=-iAjU0E75G15LkkQ",
      title: "Hair Growth Secrets",
      description: "Discover the secrets to faster hair growth"
    },
    {
      url: "https://youtu.be/UuuZQjRKNUI?si=6Qsr_JQtTVWg_Ix4",
      title: "Hair Styling Tips",
      description: "Professional hair styling tips and tricks"
    },
    {
      url: "https://youtu.be/TywQ6jyIBTs?si=P-A0RwxHmWlUPARm",
      title: "Hair Care Myths Busted",
      description: "Common hair care myths debunked by experts"
    }
  ]

  // Function to extract video ID from YouTube URL
  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  // Function to get thumbnail URL
  const getThumbnailUrl = (url: string) => {
    const videoId = getVideoId(url)
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }

  return (
    <div className="min-h-screen bg-[#8CC63F]">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Vatika Hair Care Videos</h1>
        
        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <motion.a
              key={index}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer block"
            >
              <div className="relative">
                <img
                  src={getThumbnailUrl(video.url)}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-[#8CC63F]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  )
}
