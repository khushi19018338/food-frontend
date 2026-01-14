import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UserRegister from '../pages/UserRegister';
import UserLogin from '../pages/UserLogin';
import FoodPartnerRegister from '../pages/FoodPartnerRegister';
import FoodPartnerLogin from '../pages/FoodPartnerLogin';
import Home from '../pages/Home';
import CreateFood from '../pages/CreateFood';
import PartnerProfile from '../pages/PartnerProfile';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<UserRegister />} />
            <Route path="/user/register" element={<UserRegister />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/home" element={<Home />} />
            <Route path="/create-food" element={<CreateFood />} />
            <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
            <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
            <Route path="/partner/:id" element={<PartnerProfile />} />
        </Routes>
    );
};

export default AppRoutes;
