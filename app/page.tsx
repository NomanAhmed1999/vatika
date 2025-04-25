"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  ArrowRight,
  ArrowLeft,
  Camera,
  Share2,
  RefreshCw,
  ImageIcon,
  CheckCircle,
  Mail,
  Phone,
  User,
  MapPin,
} from "lucide-react"
import Header from "./components/Header"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import ShareModal from "./components/imageShare"
import ReactCrop, { type Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    yourName: "",
    bestieName: "",
    hairConcern: "",
    bottleType: "onion", // Default bottle type
  })
  const [contactData, setContactData] = useState({
    firstName: "",
    email: "",
    phone: "",
    address: "",
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const cameraInputRef = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const bottleRef = useRef<HTMLDivElement | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareImage, setShareImage] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  // Image capture and cropping states
  const [isImageOptionsOpen, setIsImageOptionsOpen] = useState(false)
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 80,
    height: 80,
    x: 10,
    y: 10,
  })
  const imageRef = useRef<HTMLImageElement | null>(null)


  const handleButtonClick = () => {
    // Instead of directly opening file input, show options
    setIsImageOptionsOpen(true)
  }

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
    setIsImageOptionsOpen(false)
  }

  const handleCameraClick = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click()
    }
    setIsImageOptionsOpen(false)
  }

  const nextStep = () => {
    if (currentStep < 4) {
      // Updated to account for new step 4
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)

      // If we're moving to the last step, mark as complete
      if (currentStep === 3) {
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
    setContactData({
      firstName: "",
      email: "",
      phone: "",
      address: "",
    })
    setFormSubmitted(false)
    setFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl)
      setTempImageUrl(null)
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

      // Instead of setting preview directly, set temp image and open crop modal
      setTempImageUrl(objectUrl)
      setIsCropModalOpen(true)
    }
    setLoading(false)
  }

  const handleCropComplete = (crop: Crop) => {
    setCrop(crop)
  }

  const handleCropCancel = () => {
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl)
      setTempImageUrl(null)
    }
    setIsCropModalOpen(false)
  }

  const handleCropSave = () => {
    if (tempImageUrl && imageRef.current && crop.width && crop.height) {
      const canvas = document.createElement("canvas")
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        console.error("No 2d context")
        return
      }

      const pixelRatio = window.devicePixelRatio

      canvas.width = crop.width * scaleX
      canvas.height = crop.height * scaleY

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      ctx.imageSmoothingQuality = "high"

      ctx.drawImage(
        imageRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY,
      )

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create a new file from the blob
            const croppedFile = new File([blob], "cropped-image.jpg", { type: "image/jpeg" })
            setFile(croppedFile)

            // Create and set preview URL
            const croppedUrl = URL.createObjectURL(blob)
            setPreviewUrl(croppedUrl)

            // Clean up temp image
            if (tempImageUrl) {
              URL.revokeObjectURL(tempImageUrl)
              setTempImageUrl(null)
            }

            // Force re-render of the names
            setFormData({
              ...formData,
            })
          }
        },
        "image/jpeg",
        0.95,
      )

      setIsCropModalOpen(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactData({
      ...contactData,
      [name]: value,
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      hairConcern: value,
    })
  }

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setLoading(true)

    setTimeout(() => {
      setFormSubmitted(true)
      setLoading(false)

      // Prepare share image for sharing
      prepareShareImage()
    }, 1500)
  }

  // Prepare share image for modal
  const prepareShareImage = () => {
    if (!bottleRef.current) return

    // Create a canvas element
    const canvas = document.createElement("canvas")
    canvas.width = 400
    canvas.height = 600
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw background
    ctx.fillStyle = "#8CC63F"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Create a new image for the bottle
    const bottleImg = new Image()
    bottleImg.crossOrigin = "anonymous"
    bottleImg.src = "/images/vatika-bottle-onion.png"

    bottleImg.onload = () => {
      // Draw the bottle
      ctx.drawImage(bottleImg, 100, 100, 200, 400)

      // Draw the circular label
      ctx.beginPath()
      ctx.arc(200, 250, 50, 0, Math.PI * 2)
      ctx.fillStyle = "#9C2C7F"
      ctx.fill()

      // Draw the photo if available
      if (previewUrl) {
        const photoImg = new Image()
        photoImg.crossOrigin = "anonymous"
        photoImg.src = previewUrl

        photoImg.onload = () => {
          // Create a circular clipping path for the photo
          ctx.save()
          ctx.beginPath()
          ctx.arc(200, 250, 40, 0, Math.PI * 2)
          ctx.clip()

          // Draw the photo
          ctx.drawImage(photoImg, 160, 210, 80, 80)
          ctx.restore()

          // Add text
          finishImage()
        }

        photoImg.onerror = () => {
          finishImage()
        }
      } else {
        finishImage()
      }

      function finishImage() {
        if (!ctx) {
          console.error("Canvas context is null");
          return;
        }
      
        // Add text
        ctx.fillStyle = "white";
        ctx.font = "bold 10px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Stronger Hair, Stronger Bonds", 200, 220);
      
        // Add names
        ctx.fillStyle = "white";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(displayNames() || "Your Bestie Bottle", 200, 290);
      
        // Add Vatika logo
        ctx.font = "bold 16px Arial";
        ctx.fillText("Vatika", 200, 350);
      
        // Convert to data URL and set as share image
        const dataUrl = canvas.toDataURL("image/png");
        setShareImage(dataUrl);
      }
      
    }
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
      if (tempImageUrl) {
        URL.revokeObjectURL(tempImageUrl)
      }
    }
  }, [previewUrl, shareImage, tempImageUrl])

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
      <Header />

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
                  in <span className="font-bold">5</span> easy steps!
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
                  <p className="text-xl text-[#003300] mb-6">Enter Your Name & Your Bestie's Name</p>

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
                <p className="text-xl text-[#003300]">Upload a Fun Pic Together</p>

                {/* Camera icon in a white box with upload arrow */}
                <div className="relative mb-8 w-full flex">
                  <motion.button
                    onClick={handleButtonClick}
                    className="p-6 relative overflow-hidden transition-colors"
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
                            <Camera size={150} className="text-[#003300]" />
                          <p className="mt-2 text-[#003300] font-medium">Add Photo</p>
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

                  <input
                    type="file"
                    ref={cameraInputRef}
                    accept="image/png, image/jpeg, image/jpg"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

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
          ) : currentStep === 4 ? (
            // Step 4: Contact Form and Success Message
            <div className="flex flex-col md:flex-row items-center">
              {/* Left side - Bottle with custom label */}
              <div className="w-full md:w-1/2 relative flex justify-center mb-8 md:mb-0" ref={bottleRef}>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="relative w-[200px] h-[400px]">

                    {/* Custom label with photo */}
                    <div className="absolute top-[100px] left-[40px] w-[320px] h-[320px] rounded-full overflow-hidden">
                      {/* Circular background */}
                      <div className="absolute inset-0 bg-[#9C2C7F] rounded-full"></div>

                      {/* Photo */}
                      {previewUrl ? (
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt="Custom label"
                          className="absolute top-[15px] left-0 right-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute top-[15px] left-0 right-0 w-full h-[70px] bg-[#9C2C7F]"></div>
                      )}

                      {/* Names */}
                      <div className="absolute bottom-[5px] w-full text-center">
                        <div className="text-[20px] text-white font-bold">{displayNames()}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right side - Contact form or success message */}
              <div className="w-full md:w-1/2 max-w-md">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-4xl font-bold text-[#003300] mb-2 script-font">Step 4</h2>
                  <p className="text-xl text-[#003300] mb-6">
                    {formSubmitted ? "Your Bestie Bottle is Ready!" : "Complete Your Details"}
                  </p>

                  {formSubmitted ? (
                    // Success message and share options
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                      <div className="flex flex-col items-center mb-6">
                        <div className="w-16 h-16 bg-[#8CC63F] rounded-full flex items-center justify-center mb-4">
                          <CheckCircle size={32} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-[#003300]">Success!</h3>
                        <p className="text-center text-[#003300]/70 mt-2">
                          Your Vatika Bestie Bottle has been created successfully. Share it with your bestie now!
                        </p>
                      </div>

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

                      <div className="bg-[#D9E9BA] rounded-xl p-4 mb-4">
                        <h4 className="text-[#003300] font-bold text-lg mb-2 text-left">Submission Details</h4>
                        <div className="text-[#003300] text-left">
                          <div className="flex justify-between py-2 border-b border-[#003300]/20">
                            <span>Name:</span>
                            <span className="font-medium">{contactData.firstName}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-[#003300]/20">
                            <span>Email:</span>
                            <span className="font-medium">{contactData.email}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-[#003300]/20">
                            <span>Phone:</span>
                            <span className="font-medium">{contactData.phone}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span>Address:</span>
                            <span className="font-medium truncate max-w-[200px]">{contactData.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Contact form
                    <form onSubmit={handleSubmitForm} className="bg-white rounded-lg p-6 shadow-lg">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="firstName" className="text-sm font-medium text-[#003300]">
                            First Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#003300]/50 h-4 w-4" />
                            <Input
                              id="firstName"
                              name="firstName"
                              value={contactData.firstName}
                              onChange={handleContactInputChange}
                              placeholder="Your first name"
                              className="pl-10 bg-[#F5F8EF] border-none"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium text-[#003300]">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#003300]/50 h-4 w-4" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={contactData.email}
                              onChange={handleContactInputChange}
                              placeholder="your.email@example.com"
                              className="pl-10 bg-[#F5F8EF] border-none"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium text-[#003300]">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#003300]/50 h-4 w-4" />
                            <Input
                              id="phone"
                              name="phone"
                              value={contactData.phone}
                              onChange={handleContactInputChange}
                              placeholder="Your phone number"
                              className="pl-10 bg-[#F5F8EF] border-none"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="address" className="text-sm font-medium text-[#003300]">
                            Address
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-[#003300]/50 h-4 w-4" />
                            <Textarea
                              id="address"
                              name="address"
                              value={contactData.address}
                              onChange={handleContactInputChange}
                              placeholder="Your delivery address"
                              className="pl-10 bg-[#F5F8EF] border-none min-h-[100px]"
                              required
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-[#8CC63F] hover:bg-[#6AAD1D] text-white py-3 h-auto text-lg"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <RefreshCw size={20} className="animate-spin mr-2" />
                              Submitting...
                            </div>
                          ) : (
                            "Submit & Complete"
                          )}
                        </Button>
                      </div>
                    </form>
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

                    {formSubmitted && (
                      <motion.button
                        onClick={resetForm}
                        className="bg-[#003300] text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#002200] transition-colors shadow-md"
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <RefreshCw size={24} />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {/* Image Options Modal */}
      <Dialog open={isImageOptionsOpen} onOpenChange={setIsImageOptionsOpen}>
        <DialogContent className="bg-white rounded-xl p-6 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#003300] text-xl text-center">Choose an Option</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button
              onClick={handleUploadClick}
              className="bg-[#D9E9BA] hover:bg-[#C8D8A9] text-[#003300] p-6 h-auto flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <ImageIcon size={32} className="text-[#003300]" />
              </div>
              <span>Upload Image</span>
            </Button>

            <Button
              onClick={handleCameraClick}
              className="bg-[#D9E9BA] hover:bg-[#C8D8A9] text-[#003300] p-6 h-auto flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Camera size={32} className="text-[#003300]" />
              </div>
              <span>Take Picture</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Crop Modal */}
      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent className="bg-white rounded-xl p-6 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-[#003300] text-xl text-center">Crop Your Image</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center mt-4">
            {tempImageUrl && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={handleCropComplete}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imageRef}
                  src={tempImageUrl || "/placeholder.svg"}
                  alt="Crop preview"
                  className="max-h-[50vh] object-contain"
                />
              </ReactCrop>
            )}

            <div className="flex justify-between w-full mt-6">
              <Button onClick={handleCropCancel} variant="outline" className="border-[#003300] text-[#003300]">
                Cancel
              </Button>

              <Button onClick={handleCropSave} className="bg-[#8CC63F] hover:bg-[#6AAD1D] text-white">
                Apply Crop
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      {isShareModalOpen && <ShareModal onClose={() => setIsShareModalOpen(false)} bottleRef={bottleRef} />}
    </div>
  )
}
