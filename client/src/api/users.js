const getServerUrl = () => {
  return import.meta.env.VITE_SERVER_URL || 'http://localhost:8000';
};

export const fetchUsers = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = null,
    order = 'asc',
    gender = null,
    search = null,
  } = options;

  // Build query string
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  if (sortBy) {
    params.append('sortBy', sortBy);
    params.append('order', order);
  }
  
  if (gender) {
    params.append('gender', gender);
  }
  
  if (search && search.trim()) {
    params.append('search', search.trim());
  }

  const response = await fetch(
    `${getServerUrl()}/users/all?${params.toString()}`
  );
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const fetchUser = async (id) => {
  const response = await fetch(`${getServerUrl()}/user/${id}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const createUser = async (userData) => {
  const response = await fetch(`${getServerUrl()}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    // If there are validation errors, include them in the error message
    if (data.errors && Array.isArray(data.errors)) {
      throw new Error(data.errors.join(', ') || data.message || 'Failed to create user');
    }
    throw new Error(data.message || 'Failed to create user');
  }
  
  return data;
};

export const updateUser = async (id, userData) => {
  const response = await fetch(`${getServerUrl()}/user/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update user');
  }
  
  return data;
};

export const deleteUser = async (id) => {
  const response = await fetch(`${getServerUrl()}/user/${id}`, {
    method: 'DELETE',
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete user');
  }
  
  return data;
};

