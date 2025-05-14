"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Instagram, Facebook, Youtube } from "lucide-react"

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const menuRef = useRef<HTMLDivElement>(null)

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setIsMenuOpen(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [])

//   return (
//     <header className="w-full" style={{ background: "linear-gradient(100deg, #76b900 15%, #8dd100 85%)" }}>
//       <div className="container mx-auto px-4 py-2 flex items-center justify-between">
//         <Link href="/" className="flex items-center">
//           <Image
//             src="/images/vatika-logo.png"
//             alt="Vatika Logo"
//             width={120}
//             height={40}
//             className="h-10 w-auto"
//           />
//         </Link>

//         <div className="hidden md:flex items-center space-x-4">
//           {/* Social Media Icons */}
//           <div className="flex space-x-3 mr-6">
//             <Link href="https://www.instagram.com" target="_blank" className="text-white hover:text-gray-200">
//               <Instagram size={20} />
//             </Link>
//             <Link href="https://www.facebook.com" target="_blank" className="text-white hover:text-gray-200">
//               <Facebook size={20} />
//             </Link>
//             <Link href="https://www.youtube.com" target="_blank" className="text-white hover:text-gray-200">
//               <Youtube size={20} />
//             </Link>
//           </div>

//           {/* Navigation */}
//           <nav className="flex space-x-6">
//             {[
//               { name: "HOME", path: "/" },
//               { name: "ABOUT", path: "/about" },
//               { name: "VIDEOS", path: "/videos" },
//               { name: "CONTACT", path: "/contact" },
//             ].map((item) => (
//               <Link
//                 key={item.name}
//                 href={item.path}
//                 className="text-white uppercase font-medium text-sm hover:underline"
//               >
//                 {item.name}
//               </Link>
//             ))}
//           </nav>
//         </div>

//         <button className="md:hidden text-white" onClick={toggleMenu}>
//           {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {isMenuOpen && (
//         <div ref={menuRef} className="md:hidden bg-[#8dd100] shadow-lg absolute top-16 left-0 right-0 z-20">
//           <div className="flex justify-center py-3">
//             <div className="flex space-x-6">
//               <Link href="https://www.instagram.com" target="_blank" className="text-white hover:text-gray-200">
//                 <Instagram size={20} />
//               </Link>
//               <Link href="https://www.facebook.com" target="_blank" className="text-white hover:text-gray-200">
//                 <Facebook size={20} />
//               </Link>
//               <Link href="https://www.youtube.com" target="_blank" className="text-white hover:text-gray-200">
//                 <Youtube size={20} />
//               </Link>
//             </div>
//           </div>
//           <nav className="flex flex-col items-center space-y-4 p-4">
//             {[
//               { name: "HOME", path: "/" },
//               { name: "ABOUT", path: "/about" },
//               { name: "VIDEOS", path: "/videos" },
//               { name: "CONTACT", path: "/contact" },
//             ].map((item) => (
//               <Link key={item.name} href={item.path} className="text-white uppercase font-medium">
//                 {item.name}
//               </Link>
//             ))}
//           </nav>
//         </div>
//       )}
//     </header>
//   )
// }

// export default Header
const CustomHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full z-30">
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

export default CustomHeader
