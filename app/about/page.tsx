"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation, type Variants } from "framer-motion"
import { ChevronDown } from "lucide-react"
import Header from "../components/Header"

export default function AboutPage() {
  const storyRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const isStoryInView = useInView(storyRef, { once: true, amount: 0.3 })
  const isTimelineInView = useInView(timelineRef, { once: true, amount: 0.1 })
  const storyControls = useAnimation()
  const timelineControls = useAnimation()

  useEffect(() => {
    if (isStoryInView) {
      storyControls.start("visible")
    }
    if (isTimelineInView) {
      timelineControls.start("visible")
    }
  }, [isStoryInView, isTimelineInView, storyControls, timelineControls])

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  const staggerChildren: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const timelineVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, ease: "easeInOut" },
        opacity: { duration: 0.4 },
      },
    },
  }

  const leafVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (custom) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.5 + custom * 0.2,
        duration: 0.5,
        type: "spring",
        stiffness: 200,
      },
    }),
  }

  const timelineEvents = [
    { year: 1884, text: "Established by Dr. S.K Burman at Kolkata", delay: 0 },
    { year: 1940, text: "Personal Care Through Ayurveda", delay: 1 },
    { year: 1994, text: "Listed on Stock Exchange", delay: 2 },
    { year: 1998, text: "Professional Management", delay: 3 },
    { year: 2004, text: "International Business Set Up in Dubai", delay: 4 },
    { year: 2005, text: "Acquired Balsara (Home & Personal Care)", delay: 5 },
    { year: 2008, text: "Acquired Fem Care (Skin Care)", delay: 6 },
    { year: 2010, text: "Acquired Hobby & ORS Namaste", delay: 7 },
    { year: 2017, text: "Acquired D&A Cosmetics, Atlanta B & H in South Africa", delay: 8 },
    { year: 2018, text: "Dabur Crosses USD $10 Billion in Market Capitalization", delay: 9 },
    { year: 2022, text: "Acquired Badshah Masala", delay: 10 },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section with Parallax Effect */}
      <section className="relative h-[80vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-cover bg-center bg-[#8cc63f]"
          
        ></motion.div>

        {/* Curved bottom */}

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            OUR STORY
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-white text-lg md:text-xl max-w-3xl"
          >
            With a rich history of 138 years, Dabur emerged as an Ayurvedic medicines company in 1884 under the Burman
            family. Today, it stands as a leading transnational consumer goods company, renowned for its vast herbal and
            natural product range. Dabur's transformation from a family-run business to a professionally managed
            enterprise has set new industry standards in corporate governance and innovation.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
            className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-white"
          >
            <ChevronDown size={32} />
          </motion.div>
        </div>
      </section>


      {/* Timeline Section */}
      <section ref={timelineRef} className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            animate={timelineControls}
            className="text-4xl font-bold text-[#003300] text-center mb-16"
          >
            OUR JOURNEY
          </motion.h2>

          <div className="relative">
            {/* SVG Timeline */}
            <div className="justify-center flex items-center mb-8">
            <img src="/images/ourjourney.png" alt="Vatika" className="" />
            </div>

   </div>
   </div>
   </section>
      
 {/* Footer */}
      <footer className="bg-[#003300] text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} Vatika. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
