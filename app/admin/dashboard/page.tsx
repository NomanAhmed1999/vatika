"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Store } from "../../store/store";
import { useToast } from "@/hooks/use-toast"
import { getApi } from "@/lib/apiService";
import { Pacifico } from "next/font/google"

interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string
  address: string
  phone_number: string
  status: "Pending" | "Delivered"
}

const pacifico = Pacifico({ weight: "400", subsets: ["latin"], display: "swap" })

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

  useEffect(() => {
    setIsHydrated(true);
  }, []);

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
  }, [isHydrated, userData]);

  const fetchCustomer = async () => {
    try {
      const res = await getApi("api/customer", userData.access_token);
      if (!res.ok) {
        if (res.status === 401) {
          // Token expired or invalid
          router.push("/admin/login");
          toast({
            title: "Session Expired",
            description: "Please login again to continue",
            duration: 3000,
          });
          return;
        }
        throw new Error("Failed to fetch customer data");
      }
      const data = await res.json();
      setDashboardData(data);
      setCompanyData(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error!",
        description: "Failed to fetch customer data. Please try again.",
        duration: 3000,
      });
      setLoading(false);
    }
  };

  const filteredCustomers = companyData.filter((customer) => {
    const q = search.toLowerCase();
    return (
      customer.first_name.toLowerCase().includes(q) ||
      customer.last_name.toLowerCase().includes(q) ||
      customer.email.toLowerCase().includes(q) ||
      customer.address.toLowerCase().includes(q) ||
      customer.phone_number.toLowerCase().includes(q) ||
      customer.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-4xl font-bold mb-8 text-[#003300]  drop-shadow-lg`}>Customer Dashboard</h1>
        <div className="mb-6 flex justify-end">
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg border border-[#8CC63F] focus:border-[#f8c156] focus:ring-0 text-[#003300] bg-white w-full max-w-xs shadow-sm"
          />
        </div>
        <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-[#f8c156]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#8CC63F]">
              <thead className="bg-[#8CC63F]/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#003300] uppercase tracking-wider">First Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#003300] uppercase tracking-wider">Last Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#003300] uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#003300] uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#003300] uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#003300] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#f8c156]">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-[#f8c156]/10 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003300] font-medium">{customer.first_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003300] font-medium">{customer.last_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003300]">{customer.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003300]">{customer.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003300]">{customer.phone_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {customer.status === "Delivered" ? (
                        <span className="px-3 py-1 rounded-full bg-[#8CC63F]/20 text-[#6AAD1D] font-semibold">Delivered</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-[#f8c156]/20 text-[#f8c156] font-semibold">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

