import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};

export const AdminProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('adminToken'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('adminToken');
        const storedAdmin = localStorage.getItem('adminData');

        if (storedToken && storedAdmin) {
            setToken(storedToken);
            setAdmin(JSON.parse(storedAdmin));
        }
        setLoading(false);
    }, []);

    const login = (adminData, adminToken) => {
        setAdmin(adminData);
        setToken(adminToken);
        localStorage.setItem('adminToken', adminToken);
        localStorage.setItem('adminData', JSON.stringify(adminData));
    };

    const logout = () => {
        setAdmin(null);
        setToken(null);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
    };

    const isAuthenticated = () => {
        return !!token && !!admin;
    };

    const value = {
        admin,
        token,
        loading,
        login,
        logout,
        isAuthenticated
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

export default AdminContext;
