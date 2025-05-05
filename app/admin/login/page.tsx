"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { postApi } from "@/lib/apiService";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Store } from "../../store/store";
import { toast } from "@/hooks/use-toast";
import PasswordInput from "@/components/passwordEyeComponent";
import { Pacifico } from "next/font/google"

const pacifico = Pacifico({ weight: "400", subsets: ["latin"], display: "swap" })

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const updateUser = Store((state: any) => state.updateUser);

  const handleReset = () => {
    setFormData({ email: "", password: "" }); // Reset form fields
    setErrors({ email: "", password: "" }); // Clear errors
    setIsPasswordVisible(false); // Go back to "Get Access"
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }

    if (isPasswordVisible && !formData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleGetAccess = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (validateForm()) {
      try {
        const res = await postApi("api/password-generate/", { email: formData.email });
        const response = await res.json();

        if (response.error) {
          toast({
            title: "Error!",
            description: response.error,
            duration: 3000,
          });
        } else {
          toast({
            title: "Password Sent Successfully",
            description: "Please check your email for the password",
            variant: "default",
            duration: 3000,
          });

          setIsPasswordVisible(true);
        }
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error!",
          description: "Something went wrong. Please try again.",
          duration: 3000,
        });
      }
    }

    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (validateForm()) {
      try {
        const res = await postApi("api/login/", formData);
        const response = await res.json();
        console.log("Full Login Response:", JSON.stringify(response, null, 2));
        console.log("Response data:", response.data);
        console.log("Response data keys:", Object.keys(response.data));

        if (response.detail) {
          toast({
            title: "Login Failed!",
            description: response.detail,
            duration: 3000,
          });
          setIsLoading(false);
          return;
        } else {
          toast({
            title: "Login Successful",
            description: "Redirecting to dashboard...",
            variant: "default",
            duration: 2000,
          });

          // Check if token exists in response.data
          if (!response.data?.access_token) {
            console.error("No token received from API");
            toast({
              title: "Login Error",
              description: "Authentication token is missing. Please try again.",
              duration: 3000,
            });
            setIsLoading(false);
            return;
          }

          // Store the token and user data
          const userData = {
            access_token: response.data.access_token,
            user: response.data.user || null
          };

          console.log("Storing user data:", userData);
          updateUser(userData);
          
          // Redirect to dashboard
          router.push("/admin/dashboard");
        }
      } catch (error) {
        console.error("Login error:", error);
        toast({
          title: "Login Error",
          description: "An error occurred while processing your request. Please try again.",
          duration: 3000,
        });
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex items-center justify-center flex-grow py-8">
        <Card className="w-full max-w-xl p-8 bg-white/95 rounded-3xl shadow-2xl border-4 border-[#8CC63F]">
          <CardHeader className="flex justify-center">
            <div className="flex justify-center">
              <Image
                src="/images/vatika-logo.png"
                alt="Vatika Logo"
                width={100}
                height={50}
                className="mb-2"
              />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className={`font-bold text-3xl text-center mb-6 text-[#003300]`}>Login as Admin</CardTitle>

            <form onSubmit={isPasswordVisible ? handleLogin : handleGetAccess} className="space-y-4">
              {/* Email Input */}
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-[#003300]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-white/80 border border-[#E5E8DF] rounded-lg focus:border-[#8CC63F] focus:ring-0 text-[#003300] placeholder:text-[#003300]/50 px-4 py-3 shadow-sm"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password Input (Hidden until API call succeeds) */}
              {isPasswordVisible && (
                <div>
                  <Label htmlFor="password" className="block text-sm font-medium text-[#003300]">Password</Label>
                  <PasswordInput
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
              )}

              {/* Submit Button */}
              <div>
                <Button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-[#8CC63F] hover:bg-[#6AAD1D] rounded-lg font-bold text-lg shadow-md transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="animate-spin" size={24} /> : isPasswordVisible ? "Log In" : "Get Access"}
                </Button>
              </div>
              <div>
                {isPasswordVisible && (
                  <p className="text-sm text-center text-[#003300]">
                    Didn't receive the password?{" "}
                    <span
                      className="text-[#f8c156] underline font-bold cursor-pointer hover:text-[#8CC63F]"
                      onClick={handleReset}
                    >
                      Try again
                    </span>
                  </p>
                )}
              </div>
            </form>

           
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
