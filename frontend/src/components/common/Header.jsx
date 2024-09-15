"use client"
import React from "react";
import ThemeController from "./ThemeController";

const Header = ({ title }) => {
  return (
    <header className="bg-gray-800 dark:bg-red-500 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <ThemeController />
      </div>
    </header>
  );
};

export default Header;
