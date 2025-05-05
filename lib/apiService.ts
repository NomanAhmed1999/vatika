const apiURL = "https://api-vatika.bnr360.net/"
// h

import { useRouter } from "next/navigation";



export const getApi = async (url: string, token: any = null) => {

    if(token){
        try {
            return (fetch(`${apiURL}${url}`, {
                headers: {
                    authorization: `token ${token}`
                }
            }))
        } catch (error: any) {
            console.error('Error retrieving data:', error);
            throw new Error(error.message);
        }
    }else{
        try {
            return (fetch(`${apiURL}${url}`))
        } catch (error: any) {
            console.error('Error retrieving data:', error);
            throw new Error(error.message);
        }
    }
    
    
};

export const postApi = async (url: string, options: any, token: any = null ) => {
    if(token){
        try {
            return await fetch(`${apiURL}${url}`, {
                method: 'POST', // Specify the method type
                headers: {
                    'Content-Type': 'application/json', // Set the content type to JSON
                    'Authorization': `token ${token}`
                },
                body: JSON.stringify(options) // Convert options to a JSON string
            });
        } catch (error: any) {
            console.error('Error retrieving data:', error);
            throw new Error(error.message);
        }
    }else{
        try {
            return await fetch(`${apiURL}${url}`, {
                method: 'POST', // Specify the method type
                headers: {
                    'Content-Type': 'application/json', // Set the content type to JSON
                },
                body: JSON.stringify(options) // Convert options to a JSON string
            });
        } catch (error: any) {
            console.error('Error retrieving data:', error);
            throw new Error(error.message);
        }
    }
    
};


export const postApiOTPVerifyuser = async (url: string, data: any) => {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const response = await fetch(`${apiURL}${url}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        });

        return await response.json(); // Return the parsed response
    } catch (error: any) {
        console.error('Error during API call:', error);
        throw new Error(error.message || 'Unknown error occurred');
    }
};


export const postApiOTP = async (url: string, data: any, token?: string) => {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `token ${token}` // Include the token in the request
        };

        const response = await fetch(`${apiURL}${url}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json(); // Attempt to parse the error response
            throw new Error(errorData.detail || 'Something went wrong');
        }

        return await response.json(); // Return the parsed response
    } catch (error: any) {
        console.error('Error during API call:', error);
        throw new Error(error.message || 'Unknown error occurred');
    }
};

export const patchApi = async (url: string, options: any, token: any) => {
    if(!token){
        window.location.href = '/';
    }
    try {
        return await fetch(`${apiURL}${url}`, {
            method: 'PATCH', // Specify the method type
            headers: token? {
                'Content-Type': 'application/json', // Set the content type to JSON
                'Authorization': `token ${token}`
            }:{
                'Content-Type': 'application/json', // Set the content type to JSON
            },
            body: JSON.stringify(options) // Convert options to a JSON string
        });
    } catch (error: any) {
        console.error('Error retrieving data:', error);
        throw new Error(error.message);
    }
};

export const putApi = async (url: string, options: any, token: any) => {
    if(!token){
        window.location.href = '/';
    }
    try {
        return await fetch(`${apiURL}${url}`, {
            method: 'PUT', // Specify the method type
            headers: token? {
                'Content-Type': 'application/json', // Set the content type to JSON
                'Authorization': `token ${token}`
            }:{
                'Content-Type': 'application/json', // Set the content type to JSON
            },
            body: JSON.stringify(options) // Convert options to a JSON string
        });
    } catch (error: any) {
        console.error('Error retrieving data:', error);
        throw new Error(error.message);
    }
};

export const deleteApi = async (url: string, token: any = null) => {
    if(!token){
        window.location.href = '/';
    }
    try {
        return await fetch(`${apiURL}${url}`, {
            method: 'DELETE', // Specify the method type
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
                'Authorization': `token ${token}`
            },
        });
    } catch (error: any) {
        console.error('Error retrieving data:', error);
        throw new Error(error.message);
    }

};


export const postWithFile = (url: string, options: any, token: any) => {
    if(url !== "api/image-processing/" && !token){
        window.location.href = '/';
    }
    return fetch(
        `${apiURL}${url}`,
        {
          method: 'POST',
          headers: token ? {
            'Authorization': `token ${token}`,
          } : {},
          body: options,
        }
      )
}



export const patchWithFile = (url: string, options: any, token: any) => {
    if(!token){
        window.location.href = '/';
    }
    return fetch(
        `${apiURL}${url}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `token ${token}`,
          },
          body: options,
        }
      )
}