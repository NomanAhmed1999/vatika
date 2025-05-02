"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { postApi } from "@/lib/apiService"

export default function EmailPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Generate and send password to email
      const response = await postApi("api/password-generate/", { email })
      
      // Redirect to login page with email
      router.push(`/admin/login?email=${email}`)
      
      toast({
        title: "Success",
        description: "Password has been sent to your email",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Image src="/images/vatika-logo.png" alt="Vatika Logo" width={120} height={120} />
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 text-center">
            <h1 className="text-2xl font-bold">Admin Access</h1>
            <p className="text-sm mt-1">Enter your email to receive login credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-[#003300]">
                  Email
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@vatika.com"
                    className="pl-10 bg-[#D9E9BA] border-none text-[#003300] placeholder:text-[#003300]/50"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#003300]/70 h-4 w-4" />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#8CC63F] hover:bg-[#6AAD1D] text-white font-medium py-2 rounded-lg transition-colors"
              >
                {isLoading ? "Processing..." : "Get Login Credentials"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
} 