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
  Instagram,
  Facebook,
  Youtube,
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
import { postApi, postWithFile } from "@/lib/apiService"
import { useToast } from "@/hooks/use-toast"
import Webcam from "react-webcam"
import html2canvas from 'html2canvas'
import Link from "next/link"
import Image from "next/image"

const hairConcernColors = {
  dull_weak: "bg-fuchsia-800",
  dry_frizzy: "bg-orange-500",
  hair_fall: "bg-fuchsia-800"
}

const hairConcernLabels = {
  dull_weak: "Dull & Weak Hair",
  dry_frizzy: "Dry & Frizzy Hair",
  hair_fall: "Hair Fall"
}

// Responsive CustomHeader component
const CustomHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#8cc63f]/90 backdrop-blur-md shadow-lg' : ''}`}>
      <div className="relative w-full h-[100px] md:h-[120px] flex items-center justify-between px-6 md:px-16">
        {/* Logo and oil drop */}
        <div className="flex items-center space-x-2">
          <Image 
            src="/images/logoo.png" 
            alt="Vatika Logo" 
            width={200} 
            height={200} 
            className="mt-36 drop-shadow-xl"
            priority
          />
        </div>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-0 ml-8">
          {/* Social Icons */}
          <div className="flex space-x-3 mr-6">
            <Link href="https://www.instagram.com" target="_blank" className="text-[#094543] hover:text-gray-200">
              <Instagram size={20} />
            </Link>
            <Link href="https://www.facebook.com" target="_blank" className="text-[#094543] hover:text-gray-200">
              <Facebook size={20} />
            </Link>
            <Link href="https://www.youtube.com" target="_blank" className="text-[#094543] hover:text-gray-200">
              <Youtube size={20} />
            </Link>
          </div>
          <span className="h-6 border-r border-white mx-3"></span>
          {/* Nav Links */}
          <a href="/" className="text-[#094543] font-semibold text-sm tracking-wide hover:text-[#003300] transition px-4 border-r border-white">HOME</a>
          <a href="/about" className="text-[#094543] font-semibold text-sm tracking-wide hover:text-[#003300] transition px-4 border-r border-white">ABOUT</a>
          <a href="/videos" className="text-[#094543] font-semibold text-sm tracking-wide hover:text-[#003300] transition px-4 border-r border-white">VIDEOS</a>
          <a href="/contact" className="text-[#094543] font-semibold text-sm tracking-wide hover:text-[#003300] transition px-4">CONTACT</a>
        </nav>
        {/* Mobile Nav */}
        <div className="flex md:hidden items-center">
          {/* Social Icons */}
          <div className="flex space-x-3 mr-6">
            <Link href="https://www.instagram.com" target="_blank" className="text-[#094543] hover:text-gray-200">
              <Instagram size={20} />
            </Link>
            <Link href="https://www.facebook.com" target="_blank" className="text-[#094543] hover:text-gray-200">
              <Facebook size={20} />
            </Link>
            <Link href="https://www.youtube.com" target="_blank" className="text-[#094543] hover:text-gray-200">
              <Youtube size={20} />
            </Link>
          </div>
          <button
            className="ml-4 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
          >
            <svg className="w-8 h-8 text-[#094543]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
            </svg>
          </button>
        </div>
        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full w-full right-0 w-48 bg-[#8cc63f] shadow-lg rounded-b-xl flex flex-col items-start py-4 px-6 md:hidden animate-fade-in z-50">
            <a href="/" className="text-white font-semibold py-2 w-full hover:text-[#003300] transition">HOME</a>
            <a href="/about" className="text-white font-semibold py-2 w-full hover:text-[#003300] transition">ABOUT</a>
            <a href="/videos" className="text-white font-semibold py-2 w-full hover:text-[#003300] transition">VIDEOS</a>
            <a href="/contact" className="text-white font-semibold py-2 w-full hover:text-[#003300] transition">CONTACT</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    customer_name: "",
    bestie_name: "",
    hairConcerns: [] as string[],
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

  const [formErrors, setFormErrors] = useState({
    customer_name: "",
    bestie_name: "",
    hairConcerns: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
  })

  const [selectedHairConcerns, setSelectedHairConcerns] = useState<string[]>([])

  const hairConcernOptions = [
    { value: "dull_weak", label: "Dull & Weak Hair", color: "#FFB6C1" },
    { value: "dry_frizzy", label: "Dry & Frizzy Hair", color: "#87CEEB" },
    { value: "hair_fall", label: "Hair Fall", color: "#98FB98" },
    { value: "split_ends", label: "Split Ends", color: "#DDA0DD" },
    { value: "dandruff", label: "Dandruff", color: "#F0E68C" },
  ]

  const [isWebcamModalOpen, setIsWebcamModalOpen] = useState(false)
  const webcamRef = useRef<any>(null)

  // Helper to detect mobile
  const isMobile = typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent)

  const [imageError, setImageError] = useState("")

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
    if (isMobile) {
      if (cameraInputRef.current) {
        cameraInputRef.current.click()
      }
      setIsImageOptionsOpen(false)
    } else {
      setIsWebcamModalOpen(true)
      setIsImageOptionsOpen(false)
    }
  }

  const nextStep = () => {
    // Validate current step before proceeding
    let canProceed = true;
    let errorMessage = "";

    switch (currentStep) {
      case 0:
        // No validation needed for first step
        break;
      case 1:
        // Validate names
        if (!formData.customer_name.trim()) {
          canProceed = false;
          errorMessage = "Please enter your name";
          setFormErrors(prev => ({ ...prev, customer_name: "Your name is required" }));
        }
        if (!formData.bestie_name.trim()) {
          canProceed = false;
          errorMessage = "Please enter your bestie's name";
          setFormErrors(prev => ({ ...prev, bestie_name: "Bestie's name is required" }));
        }
        break;
      case 2:
        // Validate hair concern
        if (!formData.hairConcerns.length) {
          canProceed = false;
          errorMessage = "Please select a hair concern";
          setFormErrors(prev => ({ ...prev, hairConcerns: "Please select a hair concern" }));
        }
        break;
      case 3:
        // Validate image
        if (!previewUrl && !processedImageUrl) {
          canProceed = false;
          errorMessage = "Please upload a photo";
          setImageError("Please upload a photo to continue");
        }
        break;
      case 5:
        // Validate form fields for step 5
        if (!validateForm()) {
          canProceed = false;
          errorMessage = "Please check the form for errors";
        }
        break;
    }

    if (!canProceed) {
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
      if (currentStep === 3) {
        setIsComplete(true);
      }
    } else {
      resetForm();
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
      hairConcerns: [],
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
      // Clear previous errors when a new image is selected
      setImageError("");
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
        setLoading(true);
        setImageError(""); // Clear any previous errors
        const canvas = document.createElement("canvas");
        const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
        const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
        const ctx = canvas.getContext("2d");
  
        if (!ctx) {
          throw new Error("Failed to get canvas context");
        }
  
        const pixelRatio = window.devicePixelRatio;
  
        canvas.width = crop.width * scaleX;
        canvas.height = crop.height * scaleY;
  
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";
  
        ctx.drawImage(
          imageRef.current,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width * scaleX,
          crop.height * scaleY
        );
  
        // Convert canvas to blob
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.95);
        });
  
        if (!blob) {
          throw new Error("Failed to create image blob");
        }
  
        // Create a new file from the blob
        const croppedFile = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });
  
        // Map the selected hair concern to its background color
        const selectedHairConcern = formData.hairConcerns[0];
        const colorMap: { [key: string]: string } = {
          dull_weak: "#86198f",
          dry_frizzy: "#f97316",
          hair_fall: "#a855f7",
        };
        const backgroundColor = colorMap[selectedHairConcern] || "#FFFFFF";
  
        // Process the cropped image
        const formDataToSend = new FormData();
        formDataToSend.append("image", croppedFile);
        formDataToSend.append("background_color", backgroundColor);
  
        const response = await postWithFile("api/image-processing/", formDataToSend, null);
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          
          // Handle different types of API errors
          let errorMessage = "Failed to process image";
          
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          } else if (Array.isArray(errorData)) {
            errorMessage = errorData.join(", ");
          }
          
          setImageError(errorMessage);
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
          return;
        }
  
        const data = await response.json();
  
        if (data.image_url) {
          setFormData((prev) => ({
            ...prev,
            image_url: data.image_url,
            background_color: data.background_color,
          }));
  
          setProcessedImageUrl(data.image_url);
  
          const croppedUrl = URL.createObjectURL(blob);
          setPreviewUrl(croppedUrl);
  
          if (tempImageUrl) {
            URL.revokeObjectURL(tempImageUrl);
            setTempImageUrl(null);
          }
  
          setIsCropModalOpen(false);
          setImageError("");
        } else {
          throw new Error("Response does not contain required fields");
        }
      } catch (error: any) {
        console.error("Error in handleCropSave:", error);
        const errorMessage = error.message || "Failed to process image. Please try again.";
        setImageError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // For phone number, format as user types
    if (name === 'phone_number') {
      let formattedValue = value.replace(/\D/g, '')
      
      // If user is typing and hasn't added +92, add it
      if (formattedValue.length > 0 && !formattedValue.startsWith('92')) {
        formattedValue = '92' + formattedValue
      }
      
      // Add + if not present
      if (formattedValue.length > 0 && !formattedValue.startsWith('+')) {
        formattedValue = '+' + formattedValue
      }
      
      // Limit to 13 characters (+92 + 10 digits)
      if (formattedValue.length <= 13) {
        setFormData(prev => ({
          ...prev,
          [name]: formattedValue
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    
    // Clear error when user starts typing
    setFormErrors(prev => ({
      ...prev,
      [name]: ""
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
    setFormData(prev => ({
      ...prev,
      hairConcerns: [value]
    }))
  }

  const validateForm = () => {
    const errors = {
      customer_name: "",
      bestie_name: "",
      hairConcerns: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      address: "",
    }

    // Name validations
    if (!formData.customer_name.trim()) {
      errors.customer_name = "Your name is required"
    }
    if (!formData.bestie_name.trim()) {
      errors.bestie_name = "Bestie's name is required"
    }
    if (!formData.hairConcerns.length) {
      errors.hairConcerns = "Please select a hair concern"
    }

    // Contact form validations
    if (!formData.first_name.trim()) {
      errors.first_name = "First name is required"
    }
    if (!formData.last_name.trim()) {
      errors.last_name = "Last name is required"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    // Phone validation - must start with +92
    const phoneRegex = /^\+92\d{10}$/
    if (!formData.phone_number.trim()) {
      errors.phone_number = "Phone number is required"
    } else if (!phoneRegex.test(formData.phone_number)) {
      errors.phone_number = "Phone number must start with +92 for Pakistan. Example: +923001234567"
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required"
    }

    setFormErrors(errors)
    return Object.values(errors).every(error => !error)
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Format phone number to ensure it starts with +92
      let formattedPhone = formData.phone_number.replace(/\D/g, '')
      if (!formattedPhone.startsWith('92')) {
        formattedPhone = '92' + formattedPhone
      }
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone
      }
      
      // Create order with all form data
      const orderData = {
        customer_name: formData.customer_name.trim(),
        bestie_name: formData.bestie_name.trim(),
        hair_condition: formData.hairConcerns[0],
        image_url: formData.image_url,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        phone_number: formattedPhone,
        address: formData.address.trim(),
      }

      const response = await postApi("api/create-order/", orderData, null)
      
      if (!response.ok) {
        const errorData = await response.json()
        
        // Handle specific API errors
        if (errorData.phone_number) {
          // Handle phone number validation errors
          setFormErrors(prev => ({
            ...prev,
            phone_number: Array.isArray(errorData.phone_number) 
              ? errorData.phone_number[0] 
              : errorData.phone_number
          }))
          throw new Error("Please check the phone number format")
        }
        
        if (errorData.error === "A customer with this email already exists") {
          setFormErrors(prev => ({
            ...prev,
            email: "This email is already registered"
          }))
          throw new Error("This email is already registered")
        }

        // Handle other API errors
        throw new Error(errorData.detail || "Failed to create order")
      }

      const data = await response.json()
      if (data) {
        setFormSubmitted(true)
        prepareShareImage()
      }
    } catch (error: any) {
      console.error("Order creation error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Prepare share image for modal
  const prepareShareImage = async () => {
    if (!bottleRef.current) return;

    try {
      // Find and prepare any external images to avoid CORS issues
      const images = bottleRef.current.querySelectorAll('img');
      images.forEach(img => {
        const originalSrc = img.getAttribute('src');
        if (originalSrc && originalSrc.startsWith('http')) {
          // Only proxy external images
          img.crossOrigin = 'anonymous';
          img.src = `/api/image-proxy?url=${encodeURIComponent(originalSrc)}`;
        }
      });

      const canvas = await html2canvas(bottleRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      const dataUrl = canvas.toDataURL("image/png");
      setShareImage(dataUrl);
    } catch (error) {
      console.error("Error capturing image:", error);
      toast({
        title: "Error",
        description: "Failed to capture image. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  
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
    const { customer_name, bestie_name } = formData;
  
    if (customer_name && bestie_name) {
      return `${customer_name} & ${bestie_name}`;
    } else if (customer_name) {
      return `${customer_name} & Bestie`;
    } else if (bestie_name) {
      return `You & ${bestie_name}`;
    }
    return "Enter Your Names";
  };

  // Button animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  }

  // Handle webcam capture
  const handleWebcamCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) {
        // Clear previous errors when a new image is captured
        setImageError("");
        // Convert base64 to blob and create object URL
        fetch(imageSrc)
          .then(res => res.blob())
          .then(blob => {
            const objectUrl = URL.createObjectURL(blob)
            setTempImageUrl(objectUrl)
            setFile(new File([blob], "webcam-photo.jpg", { type: "image/jpeg" }))
            setIsCropModalOpen(true)
            setIsWebcamModalOpen(false)
          })
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#8CC63F] relative">
      {/* Custom header on every page, above background image */}
      <CustomHeader />
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
            <div className="w-full min-h-[100vh] flex flex-col md:flex-row items-center justify-center px-4 md:px-8 lg:px-16 py-8 relative">
              {/* Background image with overlay */}
              <div className="absolute inset-0 z-0 opacity-90">
                <div
                  className="absolute inset-0 bg-cover bg-center hidden md:block"
                  style={{ backgroundImage: "url('/images/desktop-banner.jpg')" }}
                />
                <div
                  className="absolute inset-0 bg-cover bg-center block md:hidden"
                  style={{ backgroundImage: "url('/images/mob-banner.jpg')" }}
                />
              </div>

              {/* Left side - Product display with enhanced animations */}
              <div className="w-full md:w-1/2 relative z-10 flex justify-center md:ml-[50px]  md:mt-0">
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
                  className="h-auto max-h-[250px] md:max-h-[350px] lg:max-h-[450px] w-auto object-contain step0-frame md:mt-0 lg:mt-0"
                />
              </div>

              {/* Right side - Text content with enhanced typography */}
              <div className="w-full md:w-1/2 relative z-10 text-center px-4 md:text-left mt-12">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl md:text-4xl lg:text-5xl text-white font-light leading-tight font-dancing"
                  style={{ fontFamily: 'Saphire, Arial, sans-serif' }}
                >
                  Create your <br />
                  Vatika Bestie Bottle<br />
                  in <span style={{ fontFamily: ' Arial, sans-serif', color: '#094543' }}>5</span><span style={{ color: '#094543' }}> easy steps!</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="font-light trial text-white mt-4 md:mt-6 w-full md:w-3/4 text-base md:text-lg"
                >
                  Tag your bestie and create a one-of-a-kind Vatika shampoo bottle featuring both your names and photos!
                  With AI-powered customization, you and your buddy can solve your hair care worries – together.
                </motion.p>

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
              </div>
            </div>
          ) : currentStep === 1 ? (
            <div className="w-full min-h-[100vh] flex flex-col md:flex-row items-center justify-center px-4 md:px-8 lg:px-16 py-8 relative">
              {/* Background image with overlay */}
              <div className="absolute inset-0 z-0 opacity-90">
                <div
                  className="absolute inset-0 bg-cover bg-center hidden md:block"
                  style={{ backgroundImage: "url('/images/desktop-banner.jpg')" }}
                />
                <div
                  className="absolute inset-0 bg-cover bg-center block md:hidden"
                  style={{ backgroundImage: "url('/images/mob-banner.jpg')" }}
                />
              </div>

              {/* Left side - Circular frame with enhanced effects */}
              <div className="w-full md:w-1/2 relative z-10 flex justify-center items-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative flex justify-center items-center"
                >
                  <div className="absolute inset-0 rounded-full bg-[#fcde57] blur-md opacity-30 scale-110"></div>
                  <div className="relative step1-frame w-[250px] h-[250px] md:w-[300px] md:h-[300px] mt-32 rounded-full bg-transparent overflow-hidden border-8 border-[#fcde57] shadow-xl flex items-center justify-center">
                    {/* Text inside the circle */}
                    <div className="text-[#003300] bg-[#fcde57] w-full mt-[200px] text-center px-8">
                      <div className="text-xl font-bold">
                        {displayNames() || "Enter Your Names"}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right side - Step content with enhanced inputs */}
              <div className="w-full md:w-1/2 max-w-full md:max-w-md relative z-10 px-4 mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
<h2 className="text-3xl md:text-4xl font-bold overthink text-[#094543]">Step <span style={{ fontFamily: ' Arial, sans-serif', color: '#094543' }}>1</span></h2>
                <p className="text-lg md:text-xl text-white mb-6">Enter Your Name & Your Bestie's Name</p>

                  <div className="space-y-4">
                    <div>
                      <Input
                        type="text"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleInputChange}
                        placeholder="Your Name"
                        className={`bg-[#ceee8d] h-16 border-none text-[#003300] placeholder:text-[#003300]/50 px-4 py-3 rounded-lg focus:ring-1 focus:ring-[#003300] transition-all shadow-sm ${
                          formErrors.customer_name ? "ring-2 ring-red-500" : ""
                        }`}
                      />
                      {formErrors.customer_name && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.customer_name}</p>
                      )}
                    </div>

                    <div>
                      <Input
                        type="text"
                        name="bestie_name"
                        value={formData.bestie_name}
                        onChange={handleInputChange}
                        placeholder="Your Bestie's Name"
                        className={`bg-[#ceee8d] h-16 border-none text-[#003300] placeholder:text-[#003300]/50 px-4 py-3 rounded-lg focus:ring-1 focus:ring-[#003300] transition-all shadow-sm ${
                          formErrors.bestie_name ? "ring-2 ring-red-500" : ""
                        }`}
                      />
                      {formErrors.bestie_name && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.bestie_name}</p>
                      )}
                    </div>
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
            <div className="w-full min-h-[100vh] flex flex-col md:flex-row items-center justify-center px-4 md:px-8 lg:px-16 py-8 relative">
              {/* Background image with overlay */}
              <div className="absolute inset-0 z-0 opacity-90">
                <div
                  className="absolute inset-0 bg-cover bg-center hidden md:block"
                  style={{ backgroundImage: "url('/images/desktop-banner.jpg')" }}
                />
                <div
                  className="absolute inset-0 bg-cover bg-center block md:hidden"
                  style={{ backgroundImage: "url('/images/mob-banner.jpg')" }}
                />
              </div>

              {/* Left side - Circular frame with enhanced effects */}
              <div
                className="w-full md:w-1/2 relative z-10 flex justify-center items-center "
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative flex justify-center items-center"
                >
                  <div className={`relative w-[250px] step2-frame mt-24 h-[250px] md:w-[300px] md:h-[300px] rounded-full overflow-hidden border-8 border-[#fcde57] shadow-xl flex items-center justify-center ${formData.hairConcerns[0] ? hairConcernColors[formData.hairConcerns[0] as keyof typeof hairConcernColors] : "bg-transparent"}`}>
                    {/* Curved text at top */}
                    <div className="absolute top-0 left-0 right-0 z-10">
                      <svg viewBox="0 0 320 320" className="w-full h-full">
                        <path id="curve" d="M 0, 50 A 50, 50, 0, 0, 1, 320, 50" fill="transparent" />
                        <text className="text-white font-bold text-lg">
                          <textPath xlinkHref="#curve" startOffset="50%" textAnchor="middle">
                            {displayNames() || "Your Bestie Bottle"}
                          </textPath>
                        </text>
                      </svg>
                    </div>
                    <div className="text-[#003300] bg-[#fcde57] w-full mt-[200px] text-center px-8">
                    <div className="text-xl font-bold">
                        {displayNames() || "Enter Your Names"}
                      </div>
                      </div>
                  </div>
                </motion.div>
              </div>

              {/* Right side - Step content with enhanced select */}
              <div className="w-full md:w-1/2 max-w-full md:max-w-md relative z-10 px-4 mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
<h2 className="text-3xl md:text-4xl font-bold  overthink text-[#094543]">Step <span style={{ fontFamily: ' Arial, sans-serif', color: '#094543' }}>2</span></h2>
                  <p className="text-lg md:text-xl text-white mb-6">Choose Your Bestie's Hair Concern</p>

                  <div className="space-y-4">
                    <Select onValueChange={handleSelectChange} value={formData.hairConcerns[0] || ""}>
                      <SelectTrigger className="bg-[#ceee8d] h-16 border-none text-[#003300] rounded-lg mb-2 focus:ring-1 focus:ring-[#003300] transition-all shadow-sm">
                        <SelectValue placeholder="Select a hair concern" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#ceee8d] border-none text-[#003300] rounded-lg">
                        <SelectItem value="dull_weak">Dull & Weak Hair</SelectItem>
                        <SelectItem value="dry_frizzy">Dry & Frizzy Hair</SelectItem>
                        <SelectItem value="hair_fall">Hair Fall</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.hairConcerns && (
                      <p className="text-red-500 text-sm">{formErrors.hairConcerns}</p>
                    )}
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
            <div className="w-full min-h-[100vh] flex flex-col md:flex-row items-center justify-center px-4 md:px-8 lg:px-16 py-8 relative">
              {/* Background image with overlay */}
              <div className="absolute inset-0 z-0 opacity-90">
                <div
                  className="absolute inset-0 bg-cover bg-center hidden md:block"
                  style={{ backgroundImage: "url('/images/desktop-banner.jpg')" }}
                />
                <div
                  className="absolute inset-0 bg-cover bg-center block md:hidden"
                  style={{ backgroundImage: "url('/images/mob-banner.jpg')" }}
                />
              </div>

              {/* Left side - Circular frame with photo */}
              <div
                className="w-full md:w-1/2 relative z-10 flex justify-center items-center"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative flex justify-center items-center"
                >
                  <div className="absolute inset-0 rounded-full bg-[#f8c156] blur-md opacity-30 scale-110"></div>
                  <div className={`relative w-[250px] step3-frame mt-32 h-[250px] md:w-[300px] md:h-[300px] rounded-full overflow-hidden border-8 border-[#fcde57] shadow-xl flex items-center justify-center ${formData.hairConcerns[0] ? hairConcernColors[formData.hairConcerns[0] as keyof typeof hairConcernColors] : "bg-transparent"}`}>
                    {/* Photo area */}
                    {previewUrl ? (
                      <div className="absolute h-full w-full rounded-full overflow-hidden">
                        <img
                          src={processedImageUrl || previewUrl}
                          alt="Preview"
                          className="w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-[40px] rounded-full bg-transparent flex items-center justify-center">
                        <Camera size={50} className="text-white/50" />
                      </div>
                    )}
                    {/* Names at bottom */}
                    <div className="text-[#003300] relative bg-[#fcde57] w-full mt-[200px] text-center px-8">
                    <div className="text-xl font-bold">
                        {displayNames() || "Enter Your Names"}
                      </div>
                      </div>
                  </div>
                </motion.div>
              </div>

              {/* Right side - Step content */}
              <div className="w-full md:w-1/2 max-w-full md:max-w-md relative z-10 px-4 mt-32 ">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                   <h2 className="text-3xl md:text-4xl font-bold overthink text-[#094543] center">Step <span style={{ fontFamily: ' Arial, sans-serif', color: '#094543' }}>3</span></h2>
                  
                  <p className="text-lg md:text-xl text-white mb-6 center">Upload a Fun Pic Together</p>

                  {/* Camera icon in a white box with upload arrow */}
                  <div className="relative mb-8 w-full flex">
                    <motion.button
                      onClick={handleButtonClick}
                      className="relative overflow-hidden transition-colors"
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <div className="flex flex-col items-center center">
                        {loading ? (
                          <div className="animate-spin">
                            <RefreshCw size={50} className="text-[#003300]" />
                          </div>
                        ) : (
                          <>
                        <img src="/images/cameraIcon.png" alt="" />  
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
            <div className="w-full min-h-[100vh] flex flex-col items-center justify-center px-4 md:px-8 lg:px-16 py-8 relative">
              {/* Background image with overlay */}
              <div className="absolute inset-0 z-0 opacity-90">
                <div
                  className="absolute inset-0 bg-cover bg-center hidden md:block"
                  style={{ backgroundImage: "url('/images/desktop-banner.jpg')" }}
                />
                <div
                  className="absolute inset-0 bg-cover bg-center block md:hidden"
                  style={{ backgroundImage: "url('/images/mob-banner.jpg')" }}
                />
              </div>
      
            {/* Main content: bottle, text, label */}
            <div className="w-full flex flex-col step4-frame md:flex-row items-center justify-center z-10 mt-12 md:mt-24 gap-6 md:gap-0">
              {/* Left: Bottle with frame overlay */}
              <div className="flex flex-col items-center justify-center relative h-[350px] md:h-[420px] w-[180px] md:w-[220px]">
                {/* Frame overlay at top of bottle */}
                {((typeof processedImageUrl !== "undefined" && processedImageUrl) ||
                  (typeof previewUrl !== "undefined" && previewUrl)) && (
                  <div className="absolute left-1/2 -translate-x-1/2 z-20 top-0 w-[160px] md:w-[200px]">
                    <div className="relative w-full h-auto mt-[60px] md:mt-[80px] flex flex-col items-center">
                      <div className="w-[90px] h-[90px] md:w-[110px] md:h-[110px] rounded-full overflow-hidden border-2 border-[#fcde57] bg-white mx-auto shadow-lg relative">
                        <img
                          src={
                            (typeof processedImageUrl !== "undefined" && processedImageUrl) ||
                            (typeof previewUrl !== "undefined" && previewUrl) ||
                            ""
                          }
                          alt="Besties"
                          className="w-full h-full"
                        />
                        {/* Display names inside the circle at the bottom */}
                        <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 bg-[#fcde57] px-2 md:px-4 w-full text-[#003300] font-bold text-[10px] md:text-xs shadow truncate text-center">
                          {typeof displayNames !== "undefined" && displayNames()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Bottle image */}
                {typeof formData !== "undefined" && formData.hairConcerns[0] === "dull_weak" && (
                  <img
                    src="/images/black-bottle.png"
                    alt="Black Bottle"
                    className="h-[320px] md:h-[400px] w-auto object-contain relative z-10"
                  />
                )}
                {typeof formData !== "undefined" && formData.hairConcerns[0] === "dry_frizzy" && (
                  <img
                    src="/images/orange-bottle.png"
                    alt="Orange Bottle"
                    className="h-[320px] md:h-[400px] w-auto object-contain relative z-10"
                  />
                )}
                {typeof formData !== "undefined" && formData.hairConcerns[0] === "hair_fall" && (
                  <img
                    src="/images/purple-bottle.png"
                    alt="Purple Bottle"
                    className="h-[320px] md:h-[400px] w-auto object-contain relative z-10"
                  />
                )}
              </div>
      
              {/* Center: Step text */}
              <div className="flex flex-col items-center justify-center px-4 md:px-8 text-center mb-6 md:mb-0">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold overthink text-[#094543]">
                  Step <span style={{ fontFamily: "Arial, sans-serif", color: "#094543" }}>4</span>
                </h2>
                <p className="text-base md:text-lg lg:text-2xl text-[#003300] mb-1 md:mb-2 overthink font-medium">
                  Get a Custom Vatika Bottle Label
                </p>
                <p className="text-lg md:text-xl lg:text-2xl text-[#003300] overthink font-bold">Just for You Two!</p>
              </div>
      
              {/* Right: Label image with frame overlay */}
              <div className="flex flex-col items-center border rounded-lg border-[#daf2a9] justify-center relative h-[350px] md:h-[420px] w-[180px] md:w-[220px]">
                {/* Frame overlay at top of label */}
                {((typeof processedImageUrl !== "undefined" && processedImageUrl) ||
                  (typeof previewUrl !== "undefined" && previewUrl)) && (
                  <div className="absolute left-1/2 -translate-x-1/2 z-20 top-0 w-[160px] md:w-[200px]">
                    <div className="relative w-full h-auto mt-[30px] md:mt-[40px] flex flex-col items-center">
                      <div className="w-[90px] h-[90px] md:w-[120px] md:h-[120px] rounded-full overflow-hidden border-2 border-[#fcde57] bg-white mx-auto shadow-lg relative">
                        <img
                          src={
                            (typeof processedImageUrl !== "undefined" && processedImageUrl) ||
                            (typeof previewUrl !== "undefined" && previewUrl) ||
                            ""
                          }
                          alt="Besties"
                          className="w-full h-full"
                        />
                        {/* Display names inside the circle at the bottom */}
                        <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 bg-[#fcde57] px-2 md:px-4 w-full text-[#003300] font-bold text-[10px] md:text-xs shadow truncate text-center">
                          {typeof displayNames !== "undefined" && displayNames()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Label image */}
                {typeof formData !== "undefined" && formData.hairConcerns[0] === "dull_weak" && (
                  <img
                    src="/images/black-label.png"
                    alt="Black Label"
                    className="h-[320px] md:h-[400px] w-auto object-contain"
                  />
                )}
                {typeof formData !== "undefined" && formData.hairConcerns[0] === "dry_frizzy" && (
                  <img
                    src="/images/orange-label.png"
                    alt="Orange Label"
                    className="h-[320px] md:h-[400px] w-auto object-contain"
                  />
                )}
                {typeof formData !== "undefined" && formData.hairConcerns[0] === "hair_fall" && (
                  <img
                    src="/images/purple-label.png"
                    alt="Purple Label"
                    className="h-[320px] md:h-[400px] w-auto object-contain"
                  />
                )}
              </div>
            </div>
            {/* Navigation buttons for step 4 - fixed bottom right */}
            <div className="fixed bottom-6 right-6 z-50 flex gap-3">
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
            </div>
          ) : currentStep === 5 ? (
            <div className="w-full min-h-[100vh] flex flex-col md:flex-row items-center justify-center px-4 md:px-8 lg:px-16 py-8 relative">
              {/* Background image with overlay */}
              <div className="absolute inset-0 z-0 opacity-90">
                <div
                  className="absolute inset-0 bg-cover bg-center hidden md:block"
                  style={{ backgroundImage: "url('/images/desktop-banner.jpg')" }}
                />
                <div
                  className="absolute inset-0 bg-cover bg-center block md:hidden"
                  style={{ backgroundImage: "url('/images/mob-banner.jpg')" }}
                />
              </div>

              {/* Main content row: left image/box, right bottles */}
              <div className="w-full flex flex-row items-center justify-center ml-[130px] z-10 mt-24">
                {/* Left side - Box or image */}
                <div className="hidden md:flex flex-col items-center justify-center">
                  <img src="/images/box.png" alt="Box" className="h-[420px] w-auto mb-10" />
                </div>
                {/* Right side - Two bottles with frame overlay */}
                <div className="flex justify-center items-center step5-frame">
                  <div ref={bottleRef} className="relative flex flex-row items-end step5-frame gap-[-40px]" style={{ minWidth: '420px', height: '420px' }}>
                    {[0, 1].map((i) => (
                      <div key={i} className={i === 0 ? "-mr-32 z-10" : "z-20"} style={{ position: 'relative', width: '220px', height: '420px' }}>
                        {/* Frame overlay at top of bottle */}
                        {(processedImageUrl || previewUrl) && (
                          <div className="absolute left-1/3 mt-20 -translate-x-1/2 mb-[140px] z-20" style={{ width: '200px', height: '120px' }}>
                            <div className="relative w-[200px] h-[120px] flex flex-col items-center">
                              <div className="w-[110px] h-[110px] rounded-full overflow-hidden border-2 border-[#fcde57] bg-white mx-auto shadow-lg relative">
                                <img
                                  src={processedImageUrl || previewUrl || ''}
                                  alt="Besties"
                                  className="w-full h-full"
                                />
                                {/* Display names inside the circle at the bottom */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#fcde57] px-4 w-full text-[#003300] font-bold text-xs shadow">
                                {displayNames()}
                      </div>
                    </div>
                  </div>
                          </div>
                        )}
                        {/* Bottle image */}
                        {formData.hairConcerns[0] === "dull_weak" && (
                          <img 
                            src="/images/black-bottle.png" 
                            alt="Black Bottle" 
                            className="h-[400px] w-auto object-contain relative z-10"
                          />
                        )}
                        {formData.hairConcerns[0] === "dry_frizzy" && (
                          <img 
                            src="/images/orange-bottle.png" 
                            alt="Orange Bottle" 
                            className="h-[400px] w-auto object-contain relative z-10"
                          />
                        )}
                        {formData.hairConcerns[0] === "hair_fall" && (
                          <img 
                            src="/images/purple-bottle.png" 
                            alt="Purple Bottle" 
                            className="h-[400px] w-auto object-contain relative z-10"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right side - Contact form or success message */}
              <div className="w-full md:w-1/2 max-w-full md:max-w-md relative z-10 px-4 mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold overthink text-[#094543]">Step <span style={{ fontFamily: ' Arial, sans-serif', color: '#094543' }}>5</span></h2>
                  <p className="text-lg md:text-xl text-white mb-6">
                    {formSubmitted ? "Your Bestie Bottle is Ready!" : "Complete Your Details"}
                  </p>

                  {formSubmitted ? (
                    // Success message and share options
                    <div className=" backdrop-blur-sm rounded-lg shadow-sm">
                      <div className="flex flex-col items-center mb-6">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full bg-[#8CC63F] flex items-center justify-center">
                            <CheckCircle size={40} className="text-white" />
                          </div>
                          <div className="absolute -inset-2 border-2 border-[#8CC63F] rounded-full animate-pulse" />
                        </div>
                        <h3 className="text-xl font-medium mt-4 text-white">Success!</h3>
                        <p className="text-center text-white mt-2 text-sm">
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

                      {/* <div className="bg-white rounded-lg p-4 border border-[#E5E8DF]">
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
                      </div> */}
                    </div>
                  ) : (
                    // Contact form
                    <form onSubmit={handleSubmitForm} className="backdrop-blur-sm rounded-lg p-6 shadow-sm">
                      <div className="space-y-5">
                        {/* First Name & Last Name */}
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="w-full md:w-1/2">
                            {/* <label htmlFor="first_name" className="text-sm font-medium text-[#003300]/70 mb-1 block">
                              First Name
                            </label> */}
                            <div className="relative">
                              <Input
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                placeholder="First Name"
                                className={`bg-[#ceee8d] rounded-lg focus:border-[#8CC63F] focus:ring-0 transition-colors ${formErrors.first_name ? "ring-2 ring-red-500" : ""}`}
                                required
                              />
                            </div>
                            {formErrors.first_name && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.first_name}</p>
                            )}
                          </div>
                          <div className="w-full md:w-1/2">
                            {/* <label htmlFor="last_name" className="text-sm font-medium text-[#003300]/70 mb-1 block">
                              Last Name
                            </label> */}
                            <div className="relative">
                              <Input
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                                placeholder="Last Name"
                                className={`bg-[#ceee8d] rounded-lg focus:border-[#8CC63F] focus:ring-0 transition-colors ${formErrors.last_name ? "ring-2 ring-red-500" : ""}`}
                                required
                              />
                            </div>
                            {formErrors.last_name && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.last_name}</p>
                            )}
                          </div>
                        </div>
                        {/* Phone Number & Email */}
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="w-full md:w-1/2">
                            {/* <label htmlFor="phone_number" className="text-sm font-medium text-[#003300]/70 mb-1 block">
                              Phone Number
                            </label> */}
                            <div className="relative">
                              <Input
                                id="phone_number"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleInputChange}
                                placeholder="Phone Number"
                                className={`bg-[#ceee8d] rounded-lg focus:border-[#8CC63F] focus:ring-0 transition-colors ${formErrors.phone_number ? "ring-2 ring-red-500" : ""}`}
                                required
                              />
                            </div>
                            {formErrors.phone_number && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.phone_number}</p>
                            )}
                          </div>
                          <div className="w-full md:w-1/2">
                            {/* <label htmlFor="email" className="text-sm font-medium text-[#003300]/70 mb-1 block">
                              Email Address
                            </label> */}
                            <div className="relative">
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Email Address"
                                className={`bg-[#ceee8d] rounded-lg focus:border-[#8CC63F] focus:ring-0 transition-colors ${formErrors.email ? "ring-2 ring-red-500" : ""}`}
                                required
                              />
                            </div>
                            {formErrors.email && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                            )}
                          </div>
                        </div>
                        {/* Address */}
                        <div>
                          {/* <label htmlFor="address" className="text-sm font-medium text-[#003300]/70 mb-1 block">
                            Address
                          </label> */}
                          <div className="relative">
                            <Textarea
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              placeholder="Address"
                              className={`bg-[#ceee8d] rounded-lg focus:border-[#8CC63F] focus:ring-0 transition-colors ${formErrors.address ? "ring-2 ring-red-500" : ""}`}
                              required
                            />
                          </div>
                          {formErrors.address && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                          )}
                        </div>
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full overthink bg-[#469a03] hover:bg-[#6AAD1D] text-white py-3 h-auto text-base font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <RefreshCw size={18} className="animate-spin mr-2" />
                              Submitting...
                            </div>
                          ) : (
                            "Send the gift to your bestie!"
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
          ) : null}
        </motion.div>
      </AnimatePresence>

      {/* Image Options Modal */}
      <Dialog open={isImageOptionsOpen} onOpenChange={setIsImageOptionsOpen}>
        <DialogContent className="bg-white rounded-xl p-6 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">
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
            <DialogTitle className="text-xl text-center">
              Crop Your Image
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center mt-4 max-h-[70vh] overflow-y-auto w-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-8">
                <div className="animate-spin">
                  <RefreshCw size={50} className="text-[#003300]" />
                </div>
                <p className="mt-4 text-[#003300]">Processing image...</p>
                {imageError && (
                  <div className="text-red-600 text-center mt-4 font-semibold">
                    {imageError}
                  </div>
                )}
              </div>
            ) :
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
                {imageError && (
                  <div className="text-red-600 text-center mt-4 font-semibold">
                    {imageError}
                  </div>
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
            }
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      {isShareModalOpen && <ShareModal onClose={() => setIsShareModalOpen(false)} bottleRef={bottleRef} />}

      {/* Webcam Modal */}
      <Dialog open={isWebcamModalOpen} onOpenChange={setIsWebcamModalOpen}>
        <DialogContent className="bg-white rounded-xl p-6 max-w-3xl flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">Take a Picture</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 mt-4">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded-lg border border-[#8CC63F]"
              videoConstraints={{ facingMode: "user" }}
            />
            <div className="flex gap-4 mt-4">
              <Button onClick={() => setIsWebcamModalOpen(false)} variant="outline" className="border-[#003300] text-[#003300]">Cancel</Button>
              <Button onClick={handleWebcamCapture} className="bg-[#8CC63F] hover:bg-[#6AAD1D] text-white">Capture</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
