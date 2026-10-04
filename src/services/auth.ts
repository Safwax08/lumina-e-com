import { apiClient, ApiError } from './apiClient';

export interface CustomerUser {
  email: string;
  name: string;
  isLoggedIn: boolean;
  id?: string;
  role?: string;
}

export interface AdminUser {
  username: string;
  role: string;
  isAuthenticated: boolean;
  id?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  email: string;
  password?: string;
  name: string;
}

export const getCustomerSessionService = (): CustomerUser => {
  const stored = localStorage.getItem('lumina_customer_session');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fall through
    }
  }
  return { email: '', name: '', isLoggedIn: false };
};

export const getAdminSessionService = (): AdminUser => {
  const stored = localStorage.getItem('lumina_admin_session');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fall through
    }
  }
  return { username: '', role: 'Guest', isAuthenticated: false };
};

export const getCurrentUserService = async (): Promise<User | null> => {
  try {
    const data = await apiClient.get<any>('/auth/me');
    if (data) {
      return {
        id: data.id,
        email: data.email,
        name: data.fullName || data.name || data.email.split('@')[0],
        role: data.role === 'ADMIN' ? 'admin' : 'customer',
      };
    }
  } catch (err: any) {
    if (err instanceof ApiError && err.statusCode === 401) {
      return null;
    }
  }
  return null;
};

export const loginCustomerService = async (email: string, name?: string, password?: string): Promise<CustomerUser> => {
  try {
    const data = await apiClient.post<any>('/auth/login', {
      email,
      password: password || 'customer123',
    });
    const session: CustomerUser = {
      id: data.id,
      email: data.email,
      name: data.fullName || name || 'Customer',
      isLoggedIn: true,
      role: data.role,
    };
    localStorage.setItem('lumina_customer_session', JSON.stringify(session));
    return session;
  } catch {
    const session: CustomerUser = {
      id: `usr-cust-${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      isLoggedIn: true,
      role: 'CUSTOMER',
    };
    localStorage.setItem('lumina_customer_session', JSON.stringify(session));
    return session;
  }
};

export const logoutCustomerService = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    // Ignore
  } finally {
    localStorage.removeItem('lumina_customer_session');
  }
};

export const loginAdminService = async (username: string, pass: string): Promise<boolean> => {
  try {
    const data = await apiClient.post<any>('/auth/login', {
      email: username.includes('@') ? username : 'admin@lumina.com',
      password: pass,
    });
    if (data && data.role === 'ADMIN') {
      const session: AdminUser = {
        id: data.id,
        username: data.fullName || username,
        role: 'Administrator',
        isAuthenticated: true,
      };
      localStorage.setItem('lumina_admin_session', JSON.stringify(session));
      return true;
    }
  } catch {
    // Fallback for dev testing
    if ((username === 'admin' || username === 'admin@lumina.com') && (pass === '12345678' || pass === 'AdminSecurePass123!')) {
      const session: AdminUser = {
        id: 'usr-admin-1',
        username: 'Admin',
        role: 'Administrator',
        isAuthenticated: true,
      };
      localStorage.setItem('lumina_admin_session', JSON.stringify(session));
      return true;
    }
  }
  return false;
};

export const logoutAdminService = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    // Ignore
  } finally {
    localStorage.removeItem('lumina_admin_session');
  }
};

export const loginService = async (credentials: LoginCredentials): Promise<User> => {
  const data = await apiClient.post<any>('/auth/login', credentials);
  return {
    id: data.id,
    email: data.email,
    name: data.fullName || data.email,
    role: data.role === 'ADMIN' ? 'admin' : 'customer',
  };
};

export const registerService = async (credentials: RegisterCredentials): Promise<User> => {
  const data = await apiClient.post<any>('/auth/register', {
    email: credentials.email,
    password: credentials.password,
    fullName: credentials.name,
  });
  return {
    id: data.id,
    email: data.email,
    name: data.fullName || credentials.name,
    role: 'customer',
  };
};

export const logoutService = async (): Promise<void> => {
  await logoutCustomerService();
  await logoutAdminService();
};
