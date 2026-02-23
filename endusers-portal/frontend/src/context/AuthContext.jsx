import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser, signOut, signIn, signUp, fetchAuthSession } from 'aws-amplify/auth';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const payload = session.tokens?.idToken?.payload;
      const role = payload?.['custom:role'] || null;
      const email = payload?.email || null;
      const sub = payload?.sub || null;

      let linkedEntityId = null;
      if (role === 'CANDIDATE' && sub) {
        try {
          const res = await axiosClient.get(`/api/candidate?userId=${sub}`);
          linkedEntityId = res.data?.id || null;
        } catch {
          // No candidate profile yet — that's fine
        }
      }

      setUser({
        username: currentUser.username,
        email,
        sub,
        role,
        linkedEntityId,
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username, password) => {
    const result = await signIn({ username, password });
    if (result.nextStep.signInStep !== 'DONE') {
      throw new Error('Additional authentication steps are not supported.');
    }
    await checkAuth();
    return user;
  };

  const refreshLinkedEntity = async () => {
    await checkAuth();
  };

  const register = async ({ username, password, email, role, name }) => {
    await signUp({
      username,
      password,
      options: {
        userAttributes: {
          email,
          name,
          'custom:role': role,
        },
      },
    });
  };

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshLinkedEntity,
    isAuthenticated: !!user,
    role: user?.role || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
