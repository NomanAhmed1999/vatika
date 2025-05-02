const apiURL = "https://api-vatika.bnr360.net/"

export const getApi = async (url: string, token: any = null) => {
  if (token) {
    try {
      return fetch(`${apiURL}${url}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
    } catch (error: any) {
      console.error("Error retrieving data:", error)
      throw new Error(error.message)
    }
  } else {
    try {
      return fetch(`${apiURL}${url}`)
    } catch (error: any) {
      console.error("Error retrieving data:", error)
      throw new Error(error.message)
    }
  }
}

export const postApi = async (url: string, options: any, token: any = null) => {
  if (token) {
    try {
      const response = await fetch(`${apiURL}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(options),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }
      return data
    } catch (error: any) {
      console.error("Error retrieving data:", error)
      throw new Error(error.message)
    }
  } else {
    try {
      const response = await fetch(`${apiURL}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }
      return data
    } catch (error: any) {
      console.error("Error retrieving data:", error)
      throw new Error(error.message)
    }
  }
}

export const postApiOTPVerifyuser = async (url: string, data: any) => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    const response = await fetch(`${apiURL}${url}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    })

    return await response.json() // Return the parsed response
  } catch (error: any) {
    console.error("Error during API call:", error)
    throw new Error(error.message || "Unknown error occurred")
  }
}

export const postApiOTP = async (url: string, data: any, token?: string) => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Include the token in the request
    }

    const response = await fetch(`${apiURL}${url}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json() // Attempt to parse the error response
      throw new Error(errorData.detail || "Something went wrong")
    }

    return await response.json() // Return the parsed response
  } catch (error: any) {
    console.error("Error during API call:", error)
    throw new Error(error.message || "Unknown error occurred")
  }
}

export const patchApi = async (url: string, options: any, token: any) => {
  if (!token) {
    // if (typeof window !== "undefined") {
    //   window.location.href = "/"
    // }
    // throw new Error("Authentication required")
  }
  try {
    return await fetch(`${apiURL}${url}`, {
      method: "PATCH", // Specify the method type
      headers: token
        ? {
            "Content-Type": "application/json", // Set the content type to JSON
            Authorization: `Bearer ${token}`,
          }
        : {
            "Content-Type": "application/json", // Set the content type to JSON
          },
      body: JSON.stringify(options), // Convert options to a JSON string
    })
  } catch (error: any) {
    console.error("Error retrieving data:", error)
    throw new Error(error.message)
  }
}

export const putApi = async (url: string, options: any, token: any) => {
  if (!token) {
    if (typeof window !== "undefined") {
      window.location.href = "/"
    }
    throw new Error("Authentication required")
  }
  try {
    return await fetch(`${apiURL}${url}`, {
      method: "PUT", // Specify the method type
      headers: token
        ? {
            "Content-Type": "application/json", // Set the content type to JSON
            Authorization: `Bearer ${token}`,
          }
        : {
            "Content-Type": "application/json", // Set the content type to JSON
          },
      body: JSON.stringify(options), // Convert options to a JSON string
    })
  } catch (error: any) {
    console.error("Error retrieving data:", error)
    throw new Error(error.message)
  }
}

export const deleteApi = async (url: string, token: any = null) => {
  if (!token) {
    if (typeof window !== "undefined") {
      window.location.href = "/"
    }
    throw new Error("Authentication required")
  }
  try {
    return await fetch(`${apiURL}${url}`, {
      method: "DELETE", // Specify the method type
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error: any) {
    console.error("Error retrieving data:", error)
    throw new Error(error.message)
  }
}

export const postWithFile = (url: string, options: any, token: any = null) => {
  return fetch(`${apiURL}${url}`, {
    method: "POST",
    headers: token ? {
      Authorization: `Bearer ${token}`,
    } : {},
    body: options,
  })
}

export const resumeUpload = async (url: string, formData: FormData, token: string) => {
  if (!token) {
    if (typeof window !== "undefined") {
      window.location.href = "/"
    }
    throw new Error("Authentication required")
  }
  const response = await fetch(`${apiURL}${url}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to upload file(s)")
  }

  const responseData = await response.json()
  return responseData
}

export const patchWithFile = (url: string, options: any, token: any) => {
  if (!token) {
    if (typeof window !== "undefined") {
      window.location.href = "/"
    }
    throw new Error("Authentication required")
  }
  return fetch(`${apiURL}${url}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: options,
  })
}

export const getCustomers = async (token: string, search?: string, status?: string) => {
  try {
    const queryParams = new URLSearchParams()
    if (search) queryParams.append('search', search)
    if (status) queryParams.append('status', status)
    
    const url = `api/customer/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    const response = await fetch(`${apiURL}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to fetch customers")
    }
    
    return await response.json()
  } catch (error: any) {
    console.error("Error fetching customers:", error)
    throw new Error(error.message)
  }
}

export const getCustomerById = async (token: string, id: number) => {
  try {
    const response = await fetch(`${apiURL}api/customer/?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to fetch customer")
    }
    
    return await response.json()
  } catch (error: any) {
    console.error("Error fetching customer:", error)
    throw new Error(error.message)
  }
}

export const updateCustomerStatus = async (token: string, id: number, status: string) => {
  try {
    const response = await fetch(`${apiURL}api/customer/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, status }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to update customer status")
    }
    
    return await response.json()
  } catch (error: any) {
    console.error("Error updating customer status:", error)
    throw new Error(error.message)
  }
}
