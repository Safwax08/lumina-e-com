import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CustomerUser, 
  AdminUser, 
  getCustomerSessionService, 
  loginCustomerService, 
  logoutCustomerService,
  getAdminSessionService,
  loginAdminService,
  logoutAdminService
} from '../services/auth';

interface AuthContextType {
  customer: CustomerUser;
  admin: AdminUser;
  loginCustomer: (email: string, name?: string) => Promise<void>;
  logoutCustomer: () => Promise<void>;
  loginAdmin: (username: string, pass: string) => Promise<boolean>;
  logoutAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerUser>(getCustomerSessionService);
  const [admin, setAdmin] = useState<AdminUser>(getAdminSessionService);

  const loginCustomer = async (email: string, name?: string) => {
    const user = await loginCustomerService(email, name);
    setCustomer(user);
  };

  const logoutCustomer = async () => {
    await logoutCustomerService();
    setCustomer({ email: '', name: '', isLoggedIn: false });
  };

  const loginAdmin = async (username: string, pass: string) => {
    const success = await loginAdminService(username, pass);
    if (success) {
      setAdmin(getAdminSessionService());
    }
    return success;
  };

  const logoutAdmin = async () => {
    await logoutAdminService();
    setAdmin({ username: '', role: 'Guest', isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ customer, admin, loginCustomer, logoutCustomer, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
