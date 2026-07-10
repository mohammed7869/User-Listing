// API Configuration
const API_BASE_URL = "https://cocapi.baawancrm.com/api/1";

// Get authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("accessToken");
};

// Get authorization header
const getAuthHeaders = (customHeaders = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// API request interceptor
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: getAuthHeaders(options.headers),
  };

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
      throw new Error("Unauthorized. Please login again.");
    }

    // Handle other errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

// API Service Functions
export const apiService = {
  // Fetch users
  async fetchUsers(role = 4) {
    const response = await apiRequest("/users", {
      method: "POST",
      body: JSON.stringify({ role }),
    });

    return await response.json();
  },

  // Login
  async login(username, password) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return await response.json();
  },

  // Generic fetch method for future use
  async fetch(endpoint, options = {}) {
    const response = await apiRequest(endpoint, options);
    return await response.json();
  },

  // ---- Game Layouts ----

  // Fetch all game layouts
  async fetchLayouts() {
    const response = await apiRequest("/game-layouts/get-all", {
      method: "POST",
      body: JSON.stringify({}),
    });
    return await response.json();
  },

  // Fetch a single game layout by ID
  async fetchLayoutById(id) {
    const response = await apiRequest(`/game-layouts/get/${id}`, {
      method: "GET",
    });
    return await response.json();
  },

  // Create a new game layout
  async createLayout(layoutData) {
    const response = await apiRequest("/game-layouts/save", {
      method: "POST",
      body: JSON.stringify(layoutData),
    });
    return await response.json();
  },

  // Update an existing game layout
  async updateLayout(layoutData) {
    const response = await apiRequest("/game-layouts/update", {
      method: "POST",
      body: JSON.stringify(layoutData),
    });
    return await response.json();
  },

  // Delete a game layout by ID
  async deleteLayout(id) {
    const response = await apiRequest(`/game-layouts/delete/${id}`, {
      method: "DELETE",
    });
    return await response.json();
  },
};

export default apiService;
