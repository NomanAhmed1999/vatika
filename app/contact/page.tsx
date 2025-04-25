"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Header from "../components/Header"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send, MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, Youtube, CheckCircle2 } from "lucide-react"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      // Reset form after showing success message
      setTimeout(() => {
        setIsSubmitted(false)
        setFormState({
          name: "",
          email: "",
          subject: "",
          message: "",
        })
      }, 3000)
    }, 1500)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[40vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-cover bg-center bg-[#8cc63f]"
          style={{
            backgroundImage: "url('/botanical-beauty.png')",
          }}
        ></motion.div>

        {/* Curved bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 bg-[#8cc63f]"
          style={{ borderTopLeftRadius: "50% 100%", borderTopRightRadius: "50% 100%" }}
        ></div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-20 h-1 bg-[#8CC63F] mb-4"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white text-lg max-w-xl"
          >
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 justify-center items-center flex flex-col md:flex-row">
          <div className="grid w-3/4">
            {/* Contact Form */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-lg p-8"
            >
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-[#8CC63F]/10 flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} className="text-[#8CC63F]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#003300] mb-2">Thank You!</h3>
                  <p className="text-[#003300]/70">
                    Your message has been sent successfully. We'll get back to you soon.
                  </p>
                </motion.div>
              ) : (
                <>
                  <motion.h2 variants={itemVariants} className="text-2xl font-bold text-[#003300] mb-6">
                    Send Us a Message
                  </motion.h2>

                  <form onSubmit={handleSubmit}>
                    <motion.div variants={itemVariants} className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-[#003300] mb-1">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                        className="bg-[#F5F8EF] border-none focus:ring-[#8CC63F]"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants} className="mb-4">
                      <label htmlFor="email" className="block text-sm font-medium text-[#003300] mb-1">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        className="bg-[#F5F8EF] border-none focus:ring-[#8CC63F]"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants} className="mb-4">
                      <label htmlFor="subject" className="block text-sm font-medium text-[#003300] mb-1">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        placeholder="What is this regarding?"
                        required
                        className="bg-[#F5F8EF] border-none focus:ring-[#8CC63F]"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants} className="mb-6">
                      <label htmlFor="message" className="block text-sm font-medium text-[#003300] mb-1">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        placeholder="Type your message here..."
                        rows={5}
                        required
                        className="bg-[#F5F8EF] border-none focus:ring-[#8CC63F] resize-none"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#8CC63F] hover:bg-[#6AAD1D] text-white py-3 h-auto rounded-md"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Sending...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Send size={18} className="mr-2" />
                            Send Message
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </>
              )}
            </motion.div>

            
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
