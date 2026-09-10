import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { HomePage } from '../pages/Home/HomePage';
import { CustomizeHamperPage } from '../pages/CustomizeHamper/CustomizeHamperPage';
import { ShopHampersPage } from '../pages/ShopHampers/ShopHampersPage';
import { CartPage } from '../pages/Cart/CartPage';
import { CheckoutPage } from '../pages/Checkout/CheckoutPage';
import { LoginPage } from '../pages/Auth/LoginPage';
import { RegisterPage } from '../pages/Auth/RegisterPage';
import { AccountPage } from '../pages/Account/AccountPage';
import { GreetingCardPage } from '../pages/GreetingCard/GreetingCardPage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="customize-hamper" element={<CustomizeHamperPage />} />
        <Route path="shop-hampers" element={<ShopHampersPage />} />
        <Route path="occasions" element={<ShopHampersPage />} />
        <Route path="corporate-gifting" element={<ShopHampersPage />} />
        <Route path="about-us" element={<HomePage />} />
        <Route path="greeting-card" element={<GreetingCardPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
