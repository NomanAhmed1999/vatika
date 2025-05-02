"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { postApi } from "@/lib/apiService"
import useAuthStore from "@/app/store/store"

export default function AdminLogin() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Get email from URL if it exists
    const urlEmail = searchParams.get("email")
    if (urlEmail) {
      setEmail(urlEmail)
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await postApi("api/login/", { email, password });
  
      console.log(response);  // Log the response to make sure the token is present
  
      if (response && response.data && response.data.access_token) {
        // Store the token using Zustand
        useAuthStore.getState().setToken(response.data.access_token);
  
        // Redirect to the dashboard
        router.push("/admin/dashboard");
  
        // Show success toast
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
      } else {
        // If no token is received, show an error toast
        toast({
          title: "Error",
          description: "No token received.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // If login fails, show error toast
      toast({
        title: "Error",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  

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
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm mt-1">Login to manage Vatika Bestie Bottle submissions</p>
          </div>

          <form onSubmit={handleLogin} className="p-6">
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

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-[#003300]">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password from email"
                    className="pl-10 bg-[#D9E9BA] border-none text-[#003300] placeholder:text-[#003300]/50"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#003300]/70 h-4 w-4" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#003300]/70"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#8CC63F] hover:bg-[#6AAD1D] text-white font-medium py-2 rounded-lg transition-colors"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
