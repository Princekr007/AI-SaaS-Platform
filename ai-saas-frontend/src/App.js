import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col bg-gray-50">
                {/* Navbar */}
                <header className="bg-blue-600 sticky top-0 z-50 shadow">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <span className="text-white text-2xl">🧪</span>
                            <h1 className="text-white font-bold text-lg">AI SaaS Testing</h1>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex space-x-4">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded transition duration-200 ${
                                        isActive
                                            ? "bg-blue-800 font-semibold text-white"
                                            : "text-white hover:bg-blue-700"
                                    }`
                                }
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/history"
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded transition duration-200 ${
                                        isActive
                                            ? "bg-blue-800 font-semibold text-white"
                                            : "text-white hover:bg-blue-700"
                                    }`
                                }
                            >
                                History
                            </NavLink>
                        </nav>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-grow p-6">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/history" element={<History />} />
                    </Routes>
                </main>

                {/* Footer */}
                <footer className="bg-gray-200 text-center py-3 shadow-inner">
                    <p className="text-sm text-gray-600">
                        © 2025 AI SaaS Testing. All rights reserved.
                    </p>
                </footer>
            </div>
        </Router>
    );
}

export default App;
