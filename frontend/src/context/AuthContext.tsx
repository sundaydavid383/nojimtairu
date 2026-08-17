import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { config } from '../config';
import { notify } from '../services/notifications';
import { setUnauthorizedHandler } from '../services/api';

interface AuthContextType {
  currentUser: User;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  availableStaff: User[];
  hasPermission: (permission: keyof User['permissions']) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'ntc_active_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      id: '',
      name: '',
      email: '',
      role: 'admin',
      title: '',
      avatar: '',
      phone: '',
      lastActive: 'Never logged in',
      permissions: {
        canAddProperty: true,
        canEditProperty: true,
        canDeleteProperty: true,
        canRecordPayment: true,
        canManageStaff: true,
        canExportFinancials: true,
        canViewAuditLogs: true,
      },
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('ntc_auth_token_v1');
  });

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    setUnauthorizedHandler(() => () => {
      logout();
      notify.error(
        'Session Expired',
        'Your session has expired. Please sign in again.'
      );
    });
    return () => {
      setUnauthorizedHandler(() => {});
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (!result.success) {
        const message =
          result.message || 'Invalid credentials. Please try again.';
        notify.error('Authentication Failed', message);
        return false;
      }

      localStorage.setItem('ntc_auth_token_v1', result.token);
      setCurrentUser(result.user);
      setIsAuthenticated(true);
      notify.success(
        'Welcome Back',
        `Signed in as ${result.user.name} (${result.user.role})`
      );
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      notify.error(
        'Authentication Failed',
        error.message || 'Unable to reach the authentication server.'
      );
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ntc_auth_token_v1');
    setCurrentUser({
      id: '',
      name: '',
      email: '',
      role: 'admin',
      title: '',
      avatar: '',
      phone: '',
      lastActive: 'Never logged in',
      permissions: {
        canAddProperty: true,
        canEditProperty: true,
        canDeleteProperty: true,
        canRecordPayment: true,
        canManageStaff: true,
        canExportFinancials: true,
        canViewAuditLogs: true,
      },
    });
    notify.info('Signed Out', 'You have been securely logged out.');
  };

  const switchRole = (role: UserRole) => {
    const matchedUser = {
      ...currentUser,
      role,
    };
    setCurrentUser(matchedUser);
  };

  const hasPermission = (permission: keyof User['permissions']): boolean => {
    if (!currentUser || !currentUser.permissions) return false;
    return !!currentUser.permissions[permission];
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        logout,
        switchRole,
        availableStaff: [],
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
