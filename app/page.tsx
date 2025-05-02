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
import { Pacifico } from "next/font/google"
import { postApi, postWithFile } from "@/lib/apiService"
import { useToast } from "@/hooks/use-toast"

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    customer_name: "",
    bestie_name: "",
    hairConcern: "",
    image_url: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
  })
  const [contactData, setContactData] = useState({
    firstName: "",
    lastName: "",
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
  const [processedImageUrl, setProcessedImageUrl] = useState<string>("")
  const { toast } = useToast()

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
      customer_name: "",
      bestie_name: "",
      hairConcern: "",
      image_url: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      address: "",
    })
    setContactData({
      firstName: "",
      lastName: "",
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
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Create a temporary URL for the selected file
      const objectUrl = URL.createObjectURL(selectedFile)
      setTempImageUrl(objectUrl)
      setFile(selectedFile) // Store the original file
      setIsCropModalOpen(true)
    }
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

  const handleCropSave = async () => {
    if (tempImageUrl && imageRef.current && crop.width && crop.height) {
      try {
        setLoading(true)
        const canvas = document.createElement("canvas")
        const scaleX = imageRef.current.naturalWidth / imageRef.current.width
        const scaleY = imageRef.current.naturalHeight / imageRef.current.height
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          throw new Error("Failed to get canvas context")
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
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(
            (blob) => resolve(blob),
            "image/jpeg",
            0.95
          )
        })

        if (!blob) {
          throw new Error("Failed to create image blob")
        }

        // Create a new file from the blob
        const croppedFile = new File([blob], "cropped-image.jpg", { type: "image/jpeg" })
        
        // Process the cropped image
        const formData = new FormData()
        formData.append("image", croppedFile)
        formData.append("background_color", "#8CC63F") // Using the green color from your theme

        const response = await postWithFile("api/image-processing/", formData, null)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to process image")
        }
        const data = await response.json()
        
        if (data.image_url) {
          // Create and set preview URL
          const croppedUrl = URL.createObjectURL(blob)
          setPreviewUrl(croppedUrl)
          setProcessedImageUrl(data.image_url)
          
          // Update form data with the processed image URL
          setFormData(prev => ({
            ...prev,
            image_url: data.image_url
          }))

          // Clean up temp image
          if (tempImageUrl) {
            URL.revokeObjectURL(tempImageUrl)
            setTempImageUrl(null)
          }

          setIsCropModalOpen(false)
        } else {
          throw new Error("Failed to process image")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process image. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
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

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create order with all form data
      const orderData = {
        customer_name: formData.customer_name,
        bestie_name: formData.bestie_name,
        hair_condition: formData.hairConcern,
        image_url: formData.image_url, // Using the processed image URL
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        address: formData.address,
      }

      const response = await postApi("api/create-order/", orderData)
      
      if (response) {
        setFormSubmitted(true)
        prepareShareImage()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
          console.error("Canvas context is null")
          return
        }

        // Add text
        ctx.fillStyle = "white"
        ctx.font = `bold 10px ${pacifico.className}, Arial`
        ctx.textAlign = "center"
        ctx.fillText("Stronger Hair, Stronger Bonds", 200, 220)

        // Add names
        ctx.fillStyle = "white"
        ctx.font = `bold 12px ${pacifico.className}, Arial`
        ctx.textAlign = "center"
        ctx.fillText(displayNames() || "Your Bestie Bottle", 200, 290)

        // Add Vatika logo
        ctx.font = `bold 16px ${pacifico.className}, Arial`
        ctx.fillText("Vatika", 200, 350)

        // Convert to data URL and set as share image
        const dataUrl = canvas.toDataURL("image/png")
        setShareImage(dataUrl)
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
    if (formData.customer_name && formData.bestie_name) {
      return `${formData.customer_name} & ${formData.bestie_name}`
    } else if (formData.customer_name) {
      return `${formData.customer_name} & Bestie`
    } else if (formData.customer_name) {
      return `You & ${formData.bestie_name}`
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
          className="w-full"
        >
          {currentStep === 0 ? (
            <div className="w-full min-h-[90vh] flex flex-col md:flex-row items-center justify-center px-4 md:px-8 lg:px-16 py-8 relative">
              {/* Background image with overlay */}
              <div className="absolute inset-0 z-0 opacity-90">
                <div
                  className="absolute inset-0 bg-cover bg-center hidden md:block"
                  style={{ backgroundImage: "url('/images/banner-img.png')" }}
                />
                <div
                  className="absolute inset-0 bg-cover bg-center block md:hidden"
                  style={{ backgroundImage: "url('/images/mobile-banner.png')" }}
                />
              </div>

              {/* Left side - Product display with enhanced animations */}
              <div className="w-full md:w-1/2 relative z-10 flex justify-center mb-8 md:mb-[120px] md:ml-[50px]">
                <motion.img
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    delay: 0.5,
                  }}
                  src="/images/hero-img.png"
                  alt="Vatika Bottles"
                  className="h-auto max-h-[250px] md:max-h-[350px] lg:max-h-[450px] w-auto object-contain"
                />
              </div>

              {/* Right side - Text content with enhanced typography */}
              <div className="w-full md:w-1/2 relative z-10 text-center mb-8 md:mb-[130px] px-4 md:text-left">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl md:text-4xl lg:text-5xl text-white font-light leading-tight"
                >
                  Create your <br />
                  <span className={`font-bold ${pacifico.className}`}>Vatika Bestie Bottle</span> <br />
                  in <span className="font-bold">5</span> easy steps!
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="font-light text-white mt-4 md:mt-6 w-full md:w-3/4 text-base md:text-lg"
                >
                  Tag your bestie and create a one-of-a-kind Vatika shampoo bottle featuring both your names and photos!
                  With AI-powered customization, you and your buddy can solve your hair care worries – together.
                </motion.p>

                <motion.button
                  onClick={nextStep}
                  className="bg-[#6AAD1D] text-white px-6 md:px-8 py-3 md:py-4 mt-6 rounded-full font-medium text-lg hover:bg-[#5A9618] transition-colors flex items-center shadow-lg mx-auto md:mx-0"
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
            <div className="w-full min-h-[90vh] flex flex-col md:flex-row items-center justify-center px-4 md:px-8 lg:px-16 py-8 relative">
              {/* Background image with overlay */}
              <div className="absolute inset-0 z-0 opacity-90">
                <div
                  className="absolute inset-0 bg-cover bg-center hidden md:block"
                  style={{ backgroundImage: "url('/images/banner-img.png')" }}
                />
                <div
                  className="absolute inset-0 bg-cover bg-center block md:hidden"
                  style={{ backgroundImage: "url('/images/mobile-banner.png')" }}
                />
              </div>

              {/* Left side - Circular frame with enhanced effects */}
              <div className="w-full md:w-1/2 relative z-10 flex justify-center items-center mb-8 md:mb-0 md:mr-[100px]">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative flex justify-center items-center"
                >
                  <div className="absolute inset-0 rounded-full bg-[#f8c156] blur-md opacity-30 scale-110"></div>
                  <div className="relative mr-[100px] w-[250px] h-[250px] md:w-[300px] md:h-[300px] rounded-full bg-[#9C2C7F] overflow-hidden border-8 border-[#f8c156] shadow-xl flex items-center justify-center">
                    {/* Text inside the circle */}
                    <div className="text-white text-center px-8">
                      <div className={`text-xl font-bold ${pacifico.className}`}>
                        {displayNames() || "Enter Your Names"}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right side - Step content with enhanced inputs */}
              <div className="w-full md:w-1/2 max-w-full md:max-w-md relative z-10 px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className={`text-3xl md:text-4xl font-bold text-white mb-2 ${pacifico.className}`}>Step 1</h2>
                  <p className="text-lg md:text-xl text-white mb-6">Enter Your Name & Your Bestie's Name</p>

                  <div className="space-y-4">
                    <Input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className="bg-white/80 border-none text-[#003300] placeholder:text-[#003300]/50 px-4 py-3 rounded-lg focus:ring-1 focus:ring-[#003300] transition-all shadow-sm"
                    />

                    <Input
                      type="text"
                      name="bestie_name"
                      value={formData.bestie_name}
                      onChange={handleInputChange}
                      placeholder="Your Bestie's Name"
                      className="bg-white/80 border-none text-[#003300] placeholder:text-[#003300]/50 px-4 py-3 rounded-lg focus:ring-1 focus:ring-[#003300] transition-all shadow-sm"
                    />
                  </div>

                  <div className="flex justify-center md:justify-end gap-3 mt-6 md:mt-10">
                    <motion.button
                      onClick={prevStep}
                      className="bg-white/90 text-[#003300] rounded-full w-12 h-12 flex items-center justify-center hover:bg-white transition-colors shadow-md"
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
            <div className="w-full min-h-[90vh] flex flex-col md:flex-row items-center justify-center px-4 md:px-8 lg:px-16 py-8 relative">
              {/* Background image with overlay */}
              <div className="absolute inset-0 z-0 opacity-90">
                <div
                  className="absolute inset-0 bg-cover bg-center hidden md:block"
                  style={{ backgroundImage: "url('/images/banner-img.png')" }}
                />
                <div
                  className="absolute inset-0 bg-cover bg-center block md:hidden"
                  style={{ backgroundImage: "url('/images/mobile-banner.png')" }}
                />
              </div>

              {/* Left side - Circular frame with enhanced effects */}
              <div className="w-full md:w-1/2 relative z-10 flex justify-center items-center mb-8 md:mb-0 md:mr-[100px]">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="absolute inset-0 rounded-full bg-[#f8c156] blur-md opacity-30 scale-110"></div>
                  <img
                    src="/images/frame.png"
                    alt="Frame"
                    className="w-[250px] h-[250px] md:w-[300px] md:h-[300px] relative z-10 "
                  />

                  {/* Text overlay */}
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-20">
                    <div className="text-white text-center px-8 pt-8">
                      <div
                        className={`absolute bottom-[70px] left-0 right-0 text-center text-white text-xl font-bold ${pacifico.className}`}
                      >
                        {displayNames() || "Your Bestie Bottle"}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right side - Step content with enhanced select */}
              <div className="w-full md:w-1/2 max-w-full md:max-w-md relative z-10 px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className={`text-3xl md:text-4xl font-bold text-white mb-2 ${pacifico.className}`}>Step 2</h2>
                  <p className="text-lg md:text-xl text-white mb-6">Choose Your Bestie's Hair Concern</p>

                  <div className="">
                    <Select onValueChange={handleSelectChange} value={formData.hairConcern}>
                      <SelectTrigger className="bg-white/80 border-none text-[#003300] h-12 rounded-lg mb-2 focus:ring-1 focus:ring-[#003300] transition-all shadow-sm">
                        <SelectValue placeholder="Select a hair concern" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-none text-[#003300] rounded-lg">
                        <SelectItem value="dull_weak">Dull & Weak Hair</SelectItem>
                        <SelectItem value="dry_frizzy">Dry & Frizzy Hair</SelectItem>
                        <SelectItem value="hair_fall">Hair Fall</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-center md:justify-end gap-3 mt-6 md:mt-10">
                    <motion.button
                      onClick={prevStep}
                      className="bg-white/90 text-[#003300] rounded-full w-12 h-12 flex items-center justify-center hover:bg-white transition-colors shadow-md"
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
            <div className="w-full min-h-[90vh] flex flex-col md:flex-row items-center justify-center px-4 md:px-8 lg:px-16 py-8 relative">
              {/* Background image with overlay */}
              <div className="absolute inset-0 z-0 opacity-90">
                <div
                  className="absolute inset-0 bg-cover bg-center hidden md:block"
                  style={{ backgroundImage: "url('/images/banner-img.png')" }}
                />
                <div
                  className="absolute inset-0 bg-cover bg-center block md:hidden"
                  style={{ backgroundImage: "url('/images/mobile-banner.png')" }}
                />
              </div>

              {/* Left side - Circular frame with photo */}
              <div
                className="w-full md:w-1/2 relative z-10 flex justify-center items-center mb-8 md:mb-0 md:mr-[100px]"
                ref={bottleRef}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="relative w-[250px] h-[250px] md:w-[300px] md:h-[300px] rounded-full bg-[#9C2C7F] overflow-hidden border-8 border-[#f8c156] shadow-xl">
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
                          src={processedImageUrl || previewUrl}
                          alt="Preview"
                          className="w-full h-full"
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
                      <div className={`text-white font-bold text-xl ${pacifico.className}`}>
                        {displayNames() || "Your Bestie Bottle"}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right side - Step content */}
              <div className="w-full md:w-1/2 max-w-full md:max-w-md relative z-10 px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className={`text-3xl md:text-4xl font-bold text-white mb-2 ${pacifico.className}`}>Step 3</h2>
                  <p className="text-lg md:text-xl text-white mb-6">Upload a Fun Pic Together</p>

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
                            <Camera size={80} className="text-[#003300]" />
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
                  <div className="flex justify-center md:justify-end gap-3 mt-6 md:mt-10">
                    <motion.button
                      onClick={prevStep}
                      className="bg-white/90 text-[#003300] rounded-full w-12 h-12 flex items-center justify-center hover:bg-white transition-colors shadow-md"
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
          ) : currentStep === 4 ? (
            <div className="w-full min-h-[90vh] flex flex-col md:flex-row items-center justify-center px-4 md:px-8 lg:px-16 py-8 relative">
              {/* Background image with overlay */}
              <div className="absolute inset-0 z-0 opacity-90">
                <div
                  className="absolute inset-0 bg-cover bg-center hidden md:block"
                  style={{ backgroundImage: "url('/images/banner-img.png')" }}
                />
                <div
                  className="absolute inset-0 bg-cover bg-center block md:hidden"
                  style={{ backgroundImage: "url('/images/mobile-banner.png')" }}
                />
              </div>

              {/* Left side - Bottle with custom label */}
              <div
                className="w-full md:w-1/2 relative z-10 flex justify-center items-center mb-8 md:mb-0 md:mr-[100px]"
                ref={bottleRef}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative flex justify-center items-center"
                >
                  <div className="absolute inset-0 rounded-full bg-[#f8c156] blur-md opacity-30 scale-110"></div>
                  <div className="relative w-[250px] h-[250px] md:w-[300px] md:h-[300px] rounded-full bg-[#9C2C7F] overflow-hidden border-8 border-[#f8c156] shadow-xl flex items-center justify-center">
                    {/* Photo */}
                    {previewUrl && (
                      <div className="absolute inset-[40px] rounded-full overflow-hidden">
                        <img
                          src={processedImageUrl || previewUrl}
                          alt="Custom label"
                          className="w-full h-full"
                        />
                      </div>
                    )}

                    {/* Names at bottom */}
                    <div className="absolute bottom-[20px] left-0 right-0 text-center">
                      <div className={`text-white font-bold text-xl ${pacifico.className}`}>
                        {displayNames() || "Your Bestie Bottle"}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right side - Contact form or success message */}
              <div className="w-full md:w-1/2 max-w-full md:max-w-md relative z-10 px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className={`text-3xl md:text-4xl font-bold text-white mb-2 ${pacifico.className}`}>Step 4</h2>
                  <p className="text-lg md:text-xl text-white mb-6">
                    {formSubmitted ? "Your Bestie Bottle is Ready!" : "Complete Your Details"}
                  </p>

                  {formSubmitted ? (
                    // Success message and share options
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                      <div className="flex flex-col items-center mb-6">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full bg-[#8CC63F] flex items-center justify-center">
                            <CheckCircle size={40} className="text-white" />
                          </div>
                          <div className="absolute -inset-2 border-2 border-[#8CC63F] rounded-full animate-pulse" />
                        </div>
                        <h3 className="text-xl font-medium text-[#003300] mt-4">Success!</h3>
                        <p className="text-center text-[#003300]/60 mt-2 text-sm">
                          Your Vatika Bestie Bottle has been created successfully. Share it with your bestie now!
                        </p>
                      </div>

                      <motion.button
                        onClick={() => setIsShareModalOpen(true)}
                        className="bg-[#6AAD1D] text-white w-full px-6 py-3 rounded-lg font-medium text-base hover:bg-[#5A9618] transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md mb-6"
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Share2 size={18} />
                        Share Your Bestie Bottle
                      </motion.button>

                      <div className="bg-white rounded-lg p-4 mb-4 border border-[#E5E8DF]">
                        <h4 className="text-[#003300] font-medium text-base mb-2 text-left">Submission Details</h4>
                        <div className="text-[#003300]/80 text-sm text-left">
                          <div className="flex justify-between py-2 border-b border-[#E5E8DF]">
                            <span>FirstName:</span>
                            <span className="font-medium">{formData.first_name}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-[#E5E8DF]">
                          <span>LastName:</span>
                            <span className="font-medium">{formData.last_name}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-[#E5E8DF]">
                            <span>Email:</span>
                            <span className="font-medium">{formData.email}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-[#E5E8DF]">
                            <span>Phone:</span>
                            <span className="font-medium">{formData.phone_number}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span>Address:</span>
                            <span className="font-medium truncate max-w-[200px]">{formData.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Contact form
                    <form onSubmit={handleSubmitForm} className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                      <div className="space-y-5">
                        <div>
                          <label htmlFor="first_name" className="text-sm font-medium text-[#003300]/70 mb-1 block">
                            First Name
                          </label>
                          <div className="relative">
                            <Input
                              id="first_name"
                              name="first_name"
                              value={formData.first_name}
                              onChange={handleInputChange}
                              placeholder="Your first name"
                              className="pl-10 bg-white border border-[#E5E8DF] rounded-lg focus:border-[#8CC63F] focus:ring-0 transition-colors"
                              required
                            />
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#003300]/40 h-4 w-4" />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="last_name" className="text-sm font-medium text-[#003300]/70 mb-1 block">
                            Last Name
                          </label>
                          <div className="relative">
                            <Input
                              id="last_name"
                              name="last_name"
                              value={formData.last_name}
                              onChange={handleInputChange}
                              placeholder="Your last name"
                              className="pl-10 bg-white border border-[#E5E8DF] rounded-lg focus:border-[#8CC63F] focus:ring-0 transition-colors"
                              required
                            />
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#003300]/40 h-4 w-4" />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="email" className="text-sm font-medium text-[#003300]/70 mb-1 block">
                            Email Address
                          </label>
                          <div className="relative">
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="your.email@example.com"
                              className="pl-10 bg-white border border-[#E5E8DF] rounded-lg focus:border-[#8CC63F] focus:ring-0 transition-colors"
                              required
                            />
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#003300]/40 h-4 w-4" />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="phone_number" className="text-sm font-medium text-[#003300]/70 mb-1 block">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Input
                              id="phone_number"
                              name="phone_number"
                              value={formData.phone_number}
                              onChange={handleInputChange}
                              placeholder="Your phone number"
                              className="pl-10 bg-white border border-[#E5E8DF] rounded-lg focus:border-[#8CC63F] focus:ring-0 transition-colors"
                              required
                            />
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#003300]/40 h-4 w-4" />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="address" className="text-sm font-medium text-[#003300]/70 mb-1 block">
                            Address
                          </label>
                          <div className="relative">
                            <Textarea
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              placeholder="Your delivery address"
                              className="pl-10 bg-white border border-[#E5E8DF] rounded-lg focus:border-[#8CC63F] focus:ring-0 transition-colors min-h-[100px] resize-none"
                              required
                            />
                            <MapPin className="absolute left-3 top-3 text-[#003300]/40 h-4 w-4" />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-[#8CC63F] hover:bg-[#6AAD1D] text-white py-3 h-auto text-base font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <RefreshCw size={18} className="animate-spin mr-2" />
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
                  <div className="flex justify-center md:justify-end gap-3 mt-6 md:mt-10">
                    <motion.button
                      onClick={prevStep}
                      className="bg-white/90 text-[#003300] rounded-full w-12 h-12 flex items-center justify-center hover:bg-white transition-colors shadow-md"
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
            <DialogTitle className={`text-[#003300] text-xl text-center ${pacifico.className}`}>
              Choose an Option
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Button
              onClick={handleUploadClick}
              className="bg-[#F5F8EF] hover:bg-[#E5E8DF] text-[#003300] p-6 h-auto flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                <ImageIcon size={32} className="text-[#003300]" />
              </div>
              <span>Upload Image</span>
            </Button>

            <Button
              onClick={handleCameraClick}
              className="bg-[#F5F8EF] hover:bg-[#E5E8DF] text-[#003300] p-6 h-auto flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
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
            <DialogTitle className={`text-[#003300] text-xl text-center ${pacifico.className}`}>
              Crop Your Image
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center mt-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-8">
                <div className="animate-spin">
                  <RefreshCw size={50} className="text-[#003300]" />
                </div>
                <p className="mt-4 text-[#003300]">Processing image...</p>
              </div>
            ) : (
              <>
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
                      src={tempImageUrl}
                      alt="Crop preview"
                      className="max-h-[30vh] md:max-h-[50vh] w-full object-contain"
                    />
                  </ReactCrop>
                )}

                <div className="flex justify-between w-full mt-6">
                  <Button onClick={handleCropCancel} variant="outline" className="border-[#003300] text-[#003300]">
                    Cancel
                  </Button>

                  <Button 
                    onClick={handleCropSave} 
                    className="bg-[#8CC63F] hover:bg-[#6AAD1D] text-white"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Apply Crop"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      {isShareModalOpen && <ShareModal onClose={() => setIsShareModalOpen(false)} bottleRef={bottleRef} />}
    </div>
  )
}
