"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Search, Menu, X } from "lucide-react"

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
    <header className="md:fixed top-0 left-0 right-0  shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white">
          <img src="images/vatika-logo.png" alt="Vatika Bestie Bottle" className="h-14" />
        </Link>

        <nav className="hidden md:flex space-x-6">
          {["Home", "Tips", "Gallery", "About", "Contact"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-white hover:text-pink-950 transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* <div className="hidden md:flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-1 rounded-l-md border-2 border-pink-300 focus:outline-none focus:border-pink-500"
          />
          <button className="bg-pink-500 text-white px-3 py-1 rounded-r-md hover:bg-pink-600 transition-colors">
            <Search size={20} />
          </button>
        </div> */}

        <button className="md:hidden text-pink-800" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div ref={menuRef} className="md:hidden bg-pink-50 shadow-lg absolute top-16 left-0 right-0 z-10">
          <nav className="flex flex-col space-y-4 p-4">
            {["Home", "Tips", "Gallery", "About", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-pink-800 hover:text-pink-600 transition-colors"
              >
                {item}
              </Link>
            ))}
            {/* <div className="flex items-center mt-4">
              <input
                type="text"
                placeholder="Search..."
                className="flex-grow px-3 py-1 rounded-l-md border-2 border-pink-300 focus:outline-none focus:border-pink-500"
              />
              <button className="bg-pink-500 text-white px-3 py-1 rounded-r-md hover:bg-pink-600 transition-colors">
                <Search size={20} />
              </button>
            </div> */}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header

