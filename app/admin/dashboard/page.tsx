"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Store } from "../../store/store";
import { useToast } from "@/hooks/use-toast"
import { getApi, patchApi } from "@/lib/apiService";
import { Pacifico } from "next/font/google"
import { LogOut, User, Mail, BarChart2, Clock, CheckCircle, XCircle, Download } from "lucide-react"

interface Customer {
  id: number
  customer_name: string
  bestie_name: string
  hair_condition: string
  image_url: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  address: string
  status: string
  created_at: string
  updated_at: string
}

interface DashboardStats {
  delivered_count: number
  pending_count: number
  rejected_count: number
  total_orders: number
}

const pacifico = Pacifico({ weight: "400", subsets: ["latin"], display: "swap" })

function getInitials(name: string) {
  if (!name) return "AD";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Dashboard() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const userData = Store((state: any) => state.users);
  const [dashboardData, setDashboardData] = useState<any>({});
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter()
  const { toast } = useToast()
  const [companyData, setCompanyData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    delivered_count: 0,
    pending_count: 0,
    rejected_count: 0,
    total_orders: 0
  });
  const [adminProfile, setAdminProfile] = useState({
    name: userData?.user?.full_name || '',
    email: userData?.user?.email || ''
  });
  const [profileDropdown, setProfileDropdown] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (userData?.user) {
      setAdminProfile({
        name: userData.user.full_name || '',
        email: userData.user.email || ''
      });
    }
  }, [userData]);

  // Fetch grand totals for stats on mount
  const fetchStats = async () => {
    try {
      if (!userData?.access_token) return;
      const res = await getApi("api/customer/", userData.access_token);
      if (!res.ok) return;
      const data = await res.json();
      setStats({
        delivered_count: data.results.delivered_count || 0,
        pending_count: data.results.pending_count || 0,
        rejected_count: data.results.rejected_count || 0,
        total_orders: data.results.total_orders || 0
      });
    } catch (e) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    fetchStats();
  }, [userData]);

  useEffect(() => {
    if (isHydrated) {
      if (!userData?.access_token) {
        router.push("/admin/login");
        toast({
          title: "Authentication Required",
          description: "Please login to access the dashboard",
          duration: 3000,
        });
        return;
      }
      fetchCustomer();
    }
  }, [isHydrated, userData, search, statusFilter, page]);

  const fetchCustomer = async () => {
    try {
      let url = "api/customer/";
      const params = new URLSearchParams();
      
      if (search) {
        params.append("search", search);
      }
      if (statusFilter && statusFilter !== "") {
        params.append("status", statusFilter);
      }
      if (selectedCustomerId) {
        params.append("id", selectedCustomerId.toString());
      }
      
      // Pagination
      params.append("page", page.toString());
      params.append("limit", itemsPerPage.toString());
      
      const queryString = params.toString();
      const finalUrl = queryString ? `${url}?${queryString}` : url;

      if (!userData?.access_token) {
        router.push("/admin/login");
        return;
      }

      const res = await getApi(finalUrl, userData.access_token);
      
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        return;
      }

      const data = await res.json();
      setDashboardData(data.results.customers);
      setCompanyData(data.results.customers || []);
      setTotalItems(data.count || 0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setCompanyData([]);
      setTotalItems(0);
    }
  };

  
  const updateOrderStatus = async (customerId: number, newStatus: string) => {
    if (!isHydrated) {
      toast({
        title: "Please wait",
        description: "System is initializing, please try again in a moment",
        duration: 3000,
      });
      return;
    }

    const token = userData?.access_token;
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to perform this action.",
        duration: 3000,
      });
      router.push("/admin/login");
      return;
    }

    try {
      const res = await patchApi("api/customer/", {
        id: customerId,
        status: newStatus,
      }, token);

      toast({
        title: "Success!",
        description: "Order status updated successfully",
        duration: 3000,
      });

      setPage(1);
      fetchCustomer();
      fetchStats(); // Refresh stats after status update
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        title: "Error!",
        description: error.message || "Failed to update order status. Please try again.",
        duration: 3000,
      });
    }
  };
  
  const handleLogout = () => {
    // Clear user data from store
    Store.setState({ users: null });
    router.push("/admin/login");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
      duration: 3000,
    });
  };

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Reset page when status filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const handleExportCSV = async () => {
    if (!userData?.access_token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to perform this action.",
        duration: 3000,
      });
      router.push("/admin/login");
      return;
    }

    try {
      const response = await getApi("api/export-customers-csv/", userData.access_token);
      
      if (!response.ok) {
        throw new Error('Failed to export CSV');
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `customers-export-${new Date().toISOString().split('T')[0]}.csv`;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success!",
        description: "CSV file has been downloaded successfully",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Error exporting CSV:", error);
      toast({
        title: "Error!",
        description: error.message || "Failed to export CSV. Please try again.",
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[#003300] tracking-tight">Vatika Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleExportCSV}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#8CC63F] rounded-md hover:bg-[#6AAD1D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8CC63F]"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
              <div className="relative">
                <button
                  className="flex items-center space-x-3 focus:outline-none group"
                  onClick={() => setProfileDropdown((v) => !v)}
                >
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[#8cc63f] text-white font-bold text-lg shadow-md">
                    {getInitials(adminProfile.name)}
                  </span>
                  <span className="text-[#003300] font-semibold text-base group-hover:underline">{adminProfile.name}</span>
                </button>
                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-[#E5E7EB] animate-fade-in">
                    <div className="px-4 py-2 flex items-center space-x-2 border-b border-[#F3F4F6]">
                      <Mail className="h-4 w-4 text-[#8CC63F]" />
                      <span className="text-xs text-gray-700">{adminProfile.email}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-black hover:bg-[#F3F4F6] flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[#003300] drop-shadow-lg">Customer Dashboard</h1>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-[#8CC63F] flex items-center space-x-4">
              <BarChart2 className="h-8 w-8 text-[#8CC63F]" />
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Total Orders</h3>
                <p className="text-2xl font-bold text-[#003300]">{stats.total_orders}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-[#f8c156] flex items-center space-x-4">
              <Clock className="h-8 w-8 text-[#f8c156]" />
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Pending Orders</h3>
                <p className="text-2xl font-bold text-[#f8c156]">{stats.pending_count}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-[#8CC63F] flex items-center space-x-4">
              <CheckCircle className="h-8 w-8 text-[#8CC63F]" />
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Delivered Orders</h3>
                <p className="text-2xl font-bold text-[#8CC63F]">{stats.delivered_count}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-red-400 flex items-center space-x-4">
              <XCircle className="h-8 w-8 text-red-400" />
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Rejected Orders</h3>
                <p className="text-2xl font-bold text-red-400">{stats.rejected_count}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4 justify-end items-stretch md:items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-[#8CC63F] focus:border-[#f8c156] focus:ring-0 text-[#003300] bg-white shadow-sm"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
              <option value="rejected">Rejected</option>
            </select>
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 rounded-lg border border-[#8CC63F] focus:border-[#f8c156] focus:ring-0 text-[#003300] bg-white w-full max-w-xs shadow-sm"
            />
          </div>

          {/* Table */}
          <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-[#f8c156] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#8CC63F] rounded-2xl">
                <thead className="bg-[#8CC63F]/20 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#003300] uppercase tracking-wider">Sr. No</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#003300] uppercase tracking-wider">Customer Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#003300] uppercase tracking-wider">Bestie Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#003300] uppercase tracking-wider">Hair Condition</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#003300] uppercase tracking-wider">First Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#003300] uppercase tracking-wider">Last Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#003300] uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#003300] uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#003300] uppercase tracking-wider">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#003300] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#003300] uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#003300] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#f8c156]">
                  {companyData.map((customer, index) => (
                    <tr key={customer.id} className="hover:bg-[#f8c156]/10 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003300]">{(page - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003300]">{customer.customer_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003300]">{customer.bestie_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003300]">{customer.hair_condition}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003300]">{customer.first_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003300]">{customer.last_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003300]">{customer.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003300]">{customer.phone_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003300]">{customer.address}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full font-semibold text-xs
                          ${customer.status === "delivered"
                            ? "bg-[#8CC63F]/20 text-[#6AAD1D]"
                            : customer.status === "rejected"
                            ? "bg-red-400/20 text-red-500"
                            : "bg-[#f8c156]/20 text-[#f8c156]"}
                        `}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {customer.image_url && (
                          <img
                            src={customer.image_url}
                            alt={`${customer.customer_name}'s image`}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {customer.status === "pending" && (
                          <select
                            onChange={(e) => updateOrderStatus(customer.id, e.target.value)}
                            className="px-3 py-1 bg-white border border-[#8CC63F] text-[#003300] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8CC63F]"
                            defaultValue=""
                          >
                            <option value="" disabled>Update Status</option>
                            <option value="delivered">Mark as Delivered</option>
                            <option value="rejected">Mark as Rejected</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between border-t border-[#f8c156] gap-2">
              <div className="text-sm text-[#003300] mb-2 md:mb-0">
                Showing <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">{Math.min(page * itemsPerPage, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className={`px-3 py-1 rounded-lg border border-[#8CC63F] text-sm font-medium transition-colors ${
                    page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-[#003300] hover:bg-[#8CC63F]/10'}
                  `}
                >
                  Previous
                </button>
                <span className="px-3 py-1 rounded-lg bg-[#8CC63F]/10 text-[#003300] border border-[#8CC63F] font-semibold">
                  {page}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={companyData.length < itemsPerPage}
                  className={`px-3 py-1 rounded-lg border border-[#8CC63F] text-sm font-medium transition-colors ${
                    companyData.length < itemsPerPage ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-[#003300] hover:bg-[#8CC63F]/10'}
                  `}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-[#003300] text-center">
            © {new Date().getFullYear()} Vatika. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

