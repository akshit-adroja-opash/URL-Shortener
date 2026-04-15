import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/apiRequest';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'FETCH_USER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'FETCH_USER_ERROR':
    case 'LOGIN_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (state.token) {
      localStorage.setItem('token', state.token);
    } else {
      localStorage.removeItem('token');
    }
  }, [state.token]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          dispatch({ type: 'FETCH_USER_SUCCESS', payload: payload });
        } else {
          dispatch({ type: 'FETCH_USER_ERROR' });
        }
      } catch {
        localStorage.removeItem('token');
        dispatch({ type: 'FETCH_USER_ERROR' });
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/');
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR' });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const value = {
    ...state,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

