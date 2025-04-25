"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Menu, X, Instagram, Facebook, Youtube } from "lucide-react"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="w-full bg-[#76b900] shadow-md">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img src="/images/vatika-logo.png" alt="Vatika" className="h-16" />
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          {/* Social Media Icons */}
          <div className="flex space-x-3 mr-6">
            <Link href="#" className="text-white hover:text-gray-200">
              <Instagram size={20} />
            </Link>
            <Link href="#" className="text-white hover:text-gray-200">
              <Facebook size={20} />
            </Link>
            <Link href="#" className="text-white hover:text-gray-200">
              <Youtube size={20} />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-6">
            {[
              { name: "HOME", path: "/" },
              { name: "ABOUT", path: "/about" },
              { name: "VIDEOS", path: "/videos" },
              { name: "CONTACT", path: "/contact" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="text-white uppercase font-medium text-sm hover:underline"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <button className="md:hidden text-white" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div ref={menuRef} className="md:hidden bg-[#8dd100] shadow-lg absolute top-16 left-0 right-0 z-20">
          <div className="flex justify-center py-3">
            <div className="flex space-x-6">
              <Link href="#" className="text-white">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-white">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-white">
                <Youtube size={20} />
              </Link>
            </div>
          </div>
          <nav className="flex flex-col items-center space-y-4 p-4">
            {[
              { name: "HOME", path: "/" },
              { name: "ABOUT", path: "/" },
              { name: "VIDEOS", path: "/" },
              { name: "CONTACT", path: "/" },
            ].map((item) => (
              <Link key={item.name} href={item.path} className="text-white uppercase font-medium">
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
