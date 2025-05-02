"use client"
import { motion } from "framer-motion"
import { useState } from "react"
import { Check, Clock, Download, Eye, LogOut, RefreshCw, Search, User, Users } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Static mock data
const mockSubmissions = [
  {
    id: "sub_1001",
    firstName: "Mahnoor",
    lastName: "Khan",
    email: "mahnoor@example.com",
    phoneNumber: "+92 300 1234567",
    address: "House #42, Street 7, Karachi, Pakistan",
    bestieImage: "/diverse-group-city.png",
    status: "delivered",
    createdAt: "2023-05-15T10:30:00Z",
  }
]

export default function AdminDashboard() {
  // Static admin user
  const adminUser = {
    name: "Admin User",
    email: "admin@vatika.com",
  }

  const [currentPage, setCurrentPage] = useState(1)
  const entriesPerPage = 10

  // Calculate the total number of pages
  const totalPages = Math.ceil(mockSubmissions.length / entriesPerPage)

  // Get the submissions for the current page
  const currentSubmissions = mockSubmissions.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  

  return (
    <div className="min-h-screen bg-[#F5F8EF]">
      {/* Header */}
      <header className="bg-[#8CC63F] shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full bg-white flex items-center justify-center">
                <span className="text-[#8CC63F] font-bold text-lg">V</span>
              </div>
            </div>
            <h1 className="text-[#003300] font-bold text-xl">Vatika Admin</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[#003300]">
              <User size={18} />
              <span className="font-medium">{adminUser.name}</span>
            </div>

            <Button variant="ghost" size="sm" className="text-[#003300] hover:bg-[#003300]/10">
              <LogOut size={18} className="mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Page title and stats */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#003300]">Bestie Bottle Submissions</h2>
              <p className="text-[#003300]/70">Manage and track all user submissions</p>
            </div>

            <div className="flex gap-4 mt-4 md:mt-0">
              <div className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-2">
                <div className="bg-[#9C2C7F]/10 p-2 rounded-full">
                  <Users size={18} className="text-[#9C2C7F]" />
                </div>
                <div>
                  <p className="text-xs text-[#003300]/70">Total</p>
                  <p className="font-bold text-[#003300]">42</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-2">
                <div className="bg-[#f8c156]/10 p-2 rounded-full">
                  <Clock size={18} className="text-[#f8c156]" />
                </div>
                <div>
                  <p className="text-xs text-[#003300]/70">Pending</p>
                  <p className="font-bold text-[#003300]">18</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-2">
                <div className="bg-[#8CC63F]/10 p-2 rounded-full">
                  <Check size={18} className="text-[#8CC63F]" />
                </div>
                <div>
                  <p className="text-xs text-[#003300]/70">Delivered</p>
                  <p className="font-bold text-[#003300]">24</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#003300]/50 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by name, email or phone..."
                  className="pl-10 bg-[#F5F8EF] border-none"
                />
              </div>

              <div className="w-full md:w-48">
                <Select defaultValue="all">
                  <SelectTrigger className="bg-[#F5F8EF] border-none">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" className="bg-[#F5F8EF] border-none text-[#003300] hover:bg-[#D9E9BA]">
                <RefreshCw size={16} className="mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#F5F8EF]">
                  <TableRow>
                    <TableHead className="text-[#003300] font-medium">First Name</TableHead>
                    <TableHead className="text-[#003300] font-medium">Last Name</TableHead>
                    <TableHead className="text-[#003300] font-medium">Email</TableHead>
                    <TableHead className="text-[#003300] font-medium">Phone Number</TableHead>
                    <TableHead className="text-[#003300] font-medium">Address</TableHead>
                    <TableHead className="text-[#003300] font-medium">Bestie Image</TableHead>
                    <TableHead className="text-[#003300] font-medium">Status</TableHead>
                    <TableHead className="text-[#003300] font-medium text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSubmissions.map((submission) => (
                    <TableRow key={submission.id} className="hover:bg-[#F5F8EF]/50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-[#003300]">{submission.firstName}</p>
                          <p className="text-xs text-[#003300]/70">ID: {submission.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-[#003300]">{submission.lastName}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-[#003300]">{submission.email}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-[#003300]">{submission.phoneNumber}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-[#003300] truncate max-w-[200px]">{submission.address}</p>
                      </TableCell>
                      <TableCell>
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-[#9C2C7F]">
                          <img
                            src={submission.bestieImage || "/placeholder.svg"}
                            alt="Bestie"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            submission.status === "delivered"
                              ? "bg-[#8CC63F]/10 text-[#8CC63F]"
                              : "bg-[#f8c156]/10 text-[#f8c156]"
                          }`}
                        >
                          {submission.status === "delivered" ? (
                            <Check size={12} className="mr-1" />
                          ) : (
                            <Clock size={12} className="mr-1" />
                          )}
                          {submission.status === "delivered" ? "Delivered" : "Pending"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#003300]">
                                <Eye size={16} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white">
                              <DialogHeader>
                                <DialogTitle className="text-[#003300]">Submission Details</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4">
                                <div className="flex gap-4 mb-4">
                                  <div className="relative h-20 w-20 rounded-full overflow-hidden bg-[#9C2C7F] border-4 border-[#f8c156]">
                                    <img
                                      src={submission.bestieImage || "/placeholder.svg"}
                                      alt="Bestie"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-[#003300] text-lg">
                                      {submission.firstName} {submission.lastName}
                                    </h3>
                                    <p className="text-[#003300]/70 text-sm">ID: {submission.id}</p>
                                    <div
                                      className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        submission.status === "delivered"
                                          ? "bg-[#8CC63F]/10 text-[#8CC63F]"
                                          : "bg-[#f8c156]/10 text-[#f8c156]"
                                      }`}
                                    >
                                      {submission.status === "delivered" ? (
                                        <Check size={12} className="mr-1" />
                                      ) : (
                                        <Clock size={12} className="mr-1" />
                                      )}
                                      {submission.status === "delivered" ? "Delivered" : "Pending"}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-3 mt-6">
                                  <div className="grid grid-cols-3 gap-2 py-2 border-b border-[#F5F8EF]">
                                    <span className="text-[#003300]/70">First Name:</span>
                                    <span className="text-[#003300] col-span-2">{submission.firstName}</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2 py-2 border-b border-[#F5F8EF]">
                                    <span className="text-[#003300]/70">Last Name:</span>
                                    <span className="text-[#003300] col-span-2">{submission.lastName}</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2 py-2 border-b border-[#F5F8EF]">
                                    <span className="text-[#003300]/70">Email:</span>
                                    <span className="text-[#003300] col-span-2">{submission.email}</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2 py-2 border-b border-[#F5F8EF]">
                                    <span className="text-[#003300]/70">Phone:</span>
                                    <span className="text-[#003300] col-span-2">{submission.phoneNumber}</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2 py-2 border-b border-[#F5F8EF]">
                                    <span className="text-[#003300]/70">Address:</span>
                                    <span className="text-[#003300] col-span-2">{submission.address}</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2 py-2 border-b border-[#F5F8EF]">
                                    <span className="text-[#003300]/70">Created:</span>
                                    <span className="text-[#003300] col-span-2">
                                      {new Date(submission.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                </div>

                                <div className="mt-6 flex justify-between">
                                  <Button
                                    variant="outline"
                                    className="bg-[#F5F8EF] border-none text-[#003300] hover:bg-[#D9E9BA]"
                                  >
                                    <Download size={16} className="mr-2" />
                                    Download Details
                                  </Button>

                                  {submission.status === "pending" && (
                                    <Button className="bg-[#8CC63F] hover:bg-[#6AAD1D] text-white">
                                      <Check size={16} className="mr-2" />
                                      Mark as Delivered
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {submission.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-[#8CC63F] text-white hover:bg-[#6AAD1D] border-none"
                            >
                              <Check size={16} className="mr-1" />
                              Mark Delivered
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-[#F5F8EF]">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={`cursor-pointer ${currentPage === 1 ? "opacity-50 pointer-events-none" : ""}`}
                      onClick={() => handlePageChange(currentPage - 1)}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        isActive={currentPage === index + 1}
                        className={`cursor-pointer ${currentPage === index + 1 ? "bg-[#8CC63F] text-white" : ""}`}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      className={`cursor-pointer ${currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}`}
                      onClick={() => handlePageChange(currentPage + 1)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <div className="text-xs text-[#003300]/70 text-center mt-2">
                Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
                {Math.min(currentPage * entriesPerPage, mockSubmissions.length)} of {mockSubmissions.length} entries
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-[#003300] text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} Vatika Admin Panel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
