// Admin authentication utility functions

export function getAdminPassword(): string | null {
  const authToken = localStorage.getItem("adminAuth");
  const authExpiry = localStorage.getItem("adminAuthExpiry");
  
  if (authToken && authExpiry) {
    const now = new Date().getTime();
    const expiry = parseInt(authExpiry);
    
    if (now < expiry) {
      return authToken;
    } else {
      // Token expired, clean up
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("adminAuthExpiry");
    }
  }
  
  return null;
}

export function isAdminAuthenticated(): boolean {
  return getAdminPassword() !== null;
}

export async function makeAdminRequest(url: string, options: RequestInit = {}): Promise<Response> {
  const adminPassword = getAdminPassword();
  
  if (!adminPassword) {
    throw new Error("Admin authentication required");
  }
  
  // Add admin password header for routes that use isAdminAuthenticated middleware
  const headers = {
    ...options.headers,
    'x-admin-password': adminPassword,
  };
  
  return fetch(url, {
    ...options,
    headers,
  });
}

export function redirectToAdminLogin() {
  window.location.href = "/admin";
}