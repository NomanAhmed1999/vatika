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
      url: "https://www.youtube.com/embed/7S3AOLh8Sss?si=QCqYjE7VE6XKpyKu",
      title: "Vatika Onion Hair Oil - Enriched with Vitamins A, E & F",
      description: "Learn the best hair care tips from Vatika experts"
    },
    {
      url: "https://www.youtube.com/embed/sZcs4bzi7m8?si=vqu_WT9pjJ3Uy8k_",
      title: "Natural Hair Care Routine",
      description: "Complete natural hair care routine with Vatika products"
    },
    {
      url: "https://www.youtube.com/embed/wozLo5Fqai8?si=QnkC9yoDn-5Bv-GT",
      title: "Hair Fall Solutions",
      description: "Effective solutions for hair fall problems"
    },
    {
      url: "https://www.youtube.com/embed/b9XjLO5JdJc?si=XQSP3KZLlyqTycQO",
      title: "Hair Growth Secrets",
      description: "Discover the secrets to faster hair growth"
    },
    {
      url: "https://www.youtube.com/embed/wOzJ7zPQdh4?si=SvjhAu0od7iG2PXr",
      title: "Hair Styling Tips",
      description: "Professional hair styling tips and tricks"
    },
    {
      url: "https://www.youtube.com/embed/g1_8U4KN5nk?si=OWr50PQJ1je-_P-l",
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
    <div className="min-h-screen bg-[#8CC63F] relative">
      <Header />
      {/* "w-full min-h-[100vh] flex flex-col md:flex-row items-center justify-center px-4 md:px-8 lg:px-16 py-8 relative" */}
      <div className="w-full min-h-[100vh] flex flex-col items-center justify-center px-4 md:px-8 lg:px-16 py-8 relative">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Vatika Hair Care Videos</h1>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer block"
            >
              <div className="relative aspect-video">
                <iframe
                  src={video.url}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
