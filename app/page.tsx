"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  ArrowRight,
  ArrowLeft,
  Camera,
  Download,
  Facebook,
  Share2,
  Smartphone,
  RefreshCw,
  X,
  Twitter,
  Linkedin,
  Copy,
  Check,
} from "lucide-react"
import Header from "./components/Header"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import ShareModal from "./components/imageShare"

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    yourName: "",
    bestieName: "",
    hairConcern: "",
    bottleType: "onion", // Default bottle type
  })
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const bottleRef = useRef<HTMLDivElement | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareImage, setShareImage] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  // Progress indicator
  useEffect(() => {
    setProgress((currentStep / 3) * 100)
  }, [currentStep])

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)

      // If we're moving to the last step, mark as complete
      if (currentStep === 2) {
        setIsComplete(true)
      }
    } else {
      resetForm()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const resetForm = () => {
    setCurrentStep(0)
    setFormData({
      yourName: "",
      bestieName: "",
      hairConcern: "",
      bottleType: "onion",
    })
    setFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setIsComplete(false)
    setShareImage(null)
    window.scrollTo(0, 0)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    const selectedFile = e.target.files?.[0]

    if (selectedFile) {
      setFile(selectedFile)
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreviewUrl(objectUrl)

      // Force re-render of the names
      setFormData({
        ...formData,
      })

      // Prepare share image after loading the preview
      setTimeout(() => {
      }, 500)
    }
    setLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      hairConcern: value,
    })
  }



  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      if (shareImage) {
        URL.revokeObjectURL(shareImage)
      }
    }
  }, [previewUrl, shareImage])

  const displayNames = () => {
    if (formData.yourName && formData.bestieName) {
      return `${formData.yourName} & ${formData.bestieName}`
    } else if (formData.yourName) {
      return `${formData.yourName} & Bestie`
    } else if (formData.bestieName) {
      return `You & ${formData.bestieName}`
    }
    return ""
  }

  // Button animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  }


  return (
    <div className="min-h-screen bg-[#8CC63F]">
      {/* <Header /> */}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-4 pt-8 md:pt-16 pb-16"
        >
          {currentStep === 0 ? (
            <div className="w-full flex flex-col md:flex-row items-center">
              {/* Left side - Product display with enhanced animations */}
              <div className="w-full md:w-1/2 relative flex justify-center mb-8 md:mb-0">
                <div className="relative">

                  {/* Bottles with bounce animation */}
                  <motion.img
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      delay: 0.5,
                    }}
                    src="/images/hero.png"
                    alt="Vatika Bottles"
                    className="relative z-10 h-[350px]"
                  />
                </div>
              </div>

              {/* Right side - Text content with enhanced typography */}
              <div className="w-full md:w-[500px] text-center md:text-left">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl md:text-5xl text-white font-light leading-tight"
                >
                  Create your <br />
                  <span className="font-bold">Vatika Bestie Bottle</span> <br />
                  in <span className="font-bold">4</span> easy steps!
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="font-light text-white mt-6 md:mt-10 text-base md:text-lg"
                >
                  Tag your bestie and create a one-of-a-kind Vatika shampoo bottle featuring both your names and photos!
                  With AI-powered customization, you and your buddy can solve your hair care worries – together.
                </motion.p>

                <motion.button
                  onClick={nextStep}
                  className="bg-[#6AAD1D] text-white px-8 py-4 mt-8 rounded-full font-medium text-lg hover:bg-[#5A9618] transition-colors flex items-center shadow-lg"
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  Get Started
                  <ArrowRight size={20} className="ml-2 animate-pulse" />
                </motion.button>
              </div>
            </div>
          ) : currentStep === 1 ? (
            // Step 1: Enter names - Enhanced UI
            <div className="flex flex-col md:flex-row items-center">
              {/* Left side - Circular frame with enhanced effects */}
              <div className="w-full md:w-1/2 relative flex justify-center mb-8 md:mb-0">
        
                {/* Circular frame with glow effect */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="absolute inset-0 rounded-full bg-[#f8c156] blur-md opacity-30 scale-110"></div>
                  <img src="/images/frame.png" alt="Frame" className="w-[300px] h-[300px] relative z-10" />

                  {/* Text overlay with better positioning */}
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-20">
                    <div className="text-white text-center px-8 pt-8">
                      <div className="absolute bottom-[70px] left-0 right-0 text-center text-white text-xl font-bold">
                        {displayNames() || "Enter Your Names"}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right side - Step content with enhanced inputs */}
              <div className="w-full md:w-1/2 max-w-md">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-4xl font-bold text-[#003300] mb-2 script-font">Step 1</h2>
                  <p className="text-xl text-[#0033কিন্ত00] mb-6">Enter Your Name & Your Bestie's Name</p>

                  <div className="">
                    <Input
                      type="text"
                      name="yourName"
                      value={formData.yourName}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className="bg-[#D9E9BA] border-none text-[#003300] placeholder:text-[#003300]/70 px-4 py-3 rounded-xl mb-4 focus:ring-2 focus:ring-[#003300] transition-all"
                    />

                    <Input
                      type="text"
                      name="bestieName"
                      value={formData.bestieName}
                      onChange={handleInputChange}
                      placeholder="Your Bestie's Name"
                      className="bg-[#D9E9BA] border-none text-[#003300] placeholder:text-[#003300]/70 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#003300] transition-all"
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-10">
                    <motion.button
                      onClick={prevStep}
                      className="bg-[#D9E9BA] text-[#003300] rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#C8D8A9] transition-colors shadow-md"
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <ArrowLeft size={24} />
                    </motion.button>

                    <motion.button
                      onClick={nextStep}
                      className="bg-[#003300] text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#002200] transition-colors shadow-md"
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <ArrowRight size={24} />
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : currentStep === 2 ? (
            // Step 2: Choose hair concern - Enhanced UI
            <div className="flex flex-col md:flex-row items-center">
              {/* Left side - Circular frame with enhanced effects */}
              <div className="w-full md:w-1/2 relative flex justify-center mb-8 md:mb-0">
                {/* Platform/base with shadow */}

                {/* Circular frame with glow effect */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="absolute inset-0 rounded-full bg-[#f8c156] blur-md opacity-30 scale-110"></div>
                  <img src="/images/frame.png" alt="Frame" className="w-[300px] h-[300px] relative z-10" />

                  {/* Text overlay with better positioning */}
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-20">
                    <div className="text-white text-center px-8 pt-8">
                      <div className="absolute bottom-[70px] left-0 right-0 text-center text-white text-xl font-bold">
                        {displayNames() || "Your Bestie Bottle"}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right side - Step content with enhanced select */}
              <div className="w-full md:w-1/2 max-w-md">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-4xl font-bold text-[#003300] mb-2 script-font">Step 2</h2>
                  <p className="text-xl text-[#003300] mb-6">Choose Your Bestie's Hair Concern</p>

                  <div className="">
                    <Select onValueChange={handleSelectChange} value={formData.hairConcern}>
                      <SelectTrigger className="bg-[#D9E9BA] border-none text-[#003300] h-12 rounded-xl mb-2 focus:ring-2 focus:ring-[#003300] transition-all">
                        <SelectValue placeholder="Select a hair concern" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#D9E9BA] border-none text-[#003300]">
                        <SelectItem value="dull">Dull & Weak Hair</SelectItem>
                        <SelectItem value="dry">Dry & Frizzy Hair</SelectItem>
                        <SelectItem value="hairfall">Hair Fall</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-3 mt-10">
                    <motion.button
                      onClick={prevStep}
                      className="bg-[#D9E9BA] text-[#003300] rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#C8D8A9] transition-colors shadow-md"
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <ArrowLeft size={24} />
                    </motion.button>

                    <motion.button
                      onClick={nextStep}
                      className="bg-[#003300] text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#002200] transition-colors shadow-md"
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <ArrowRight size={24} />
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : currentStep === 3 ? (
            // Step 3: Upload photo - Styled like the reference image
            <div className="flex flex-col md:flex-row items-center">
              {/* Left side - Circular frame with photo */}
              <div className="w-full md:w-1/2 relative flex justify-center mb-8 md:mb-0" ref={bottleRef}>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="relative w-[320px] h-[320px] rounded-full bg-[#9C2C7F] overflow-hidden border-8 border-[#f8c156] shadow-xl">
                    {/* Curved text at top */}
                    <div className="absolute top-0 left-0 right-0 z-10">
                      <svg viewBox="0 0 320 320" className="w-full h-full">
                        <path id="curve" d="M 0, 50 A 50, 50, 0, 0, 1, 320, 50" fill="transparent" />
                        <text className="text-white font-bold text-lg">
                          <textPath xlinkHref="#curve" startOffset="50%" textAnchor="middle">
                            Stronger Hair, Stronger Bonds
                          </textPath>
                        </text>
                      </svg>
                    </div>

                    {/* Photo area - only show if there's an uploaded image */}
                    {previewUrl ? (
                      <div className="absolute top-[50px] left-[30px] right-[30px] bottom-[50px] overflow-hidden rounded-full">
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      // Empty space when no image is uploaded
                      <div className="absolute top-[50px] left-[30px] right-[30px] bottom-[50px] rounded-full bg-[#9C2C7F] flex items-center justify-center">
                        <Camera size={50} className="text-white/50" />
                      </div>
                    )}

                    {/* Names at bottom */}
                    <div className="absolute bottom-[20px] left-0 right-0 text-center">
                      <div className="text-white font-bold text-xl">{displayNames() || "Your Bestie Bottle"}</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right side - Step content */}
              <div className="w-full md:w-1/2 max-w-md flex flex-col items-center md:items-start mt-10 md:mt-0">
                <h2 className="text-4xl font-bold text-[#003300] mb-2 script-font">Step 3</h2>
                <p className="text-xl text-[#003300] mb-6">Upload a Fun Pic Together</p>

                {/* Camera icon in a white box with upload arrow */}
                <div className="relative mb-8 w-full flex">
                  <motion.button
                    onClick={handleButtonClick}
                    className=" p-6 rounded-lg relative overflow-hidden transition-colors"
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <div className="flex flex-col items-center">
                      {loading ? (
                        <div className="animate-spin">
                          <RefreshCw size={50} className="text-[#003300]" />
                        </div>
                      ) : (
                        <>
                          <div className="">
                            <Camera size={90} className="text-[#003300]" />
                          </div>
                        </>
                      )}
                    </div>
                  </motion.button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Share button */}
                {previewUrl && (
                  <motion.button
                    onClick={() => setIsShareModalOpen(true)}
                    className="bg-[#6AAD1D] text-white w-full px-6 py-4 rounded-lg font-medium text-lg hover:bg-[#5A9618] transition-colors flex items-center justify-center gap-2 shadow-lg mb-6"
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Share2 size={20} />
                    Share Your Bestie Bottle
                  </motion.button>
                )}

                {/* Navigation buttons */}
                <div className="flex justify-end w-full gap-3 mt-4">
                  <motion.button
                    onClick={prevStep}
                    className="bg-[#D9E9BA] text-[#003300] rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#C8D8A9] transition-colors shadow-md"
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <ArrowLeft size={24} />
                  </motion.button>

                  <motion.button
                    onClick={nextStep}
                    className="bg-[#003300] text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#002200] transition-colors shadow-md"
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <ArrowRight size={24} />
                  </motion.button>
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {/* Share Modal */}
      {isShareModalOpen && <ShareModal onClose={() => setIsShareModalOpen(false)} bottleRef={bottleRef} />}

    </div>
  )
}
