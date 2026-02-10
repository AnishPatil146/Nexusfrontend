import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const Layout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        // MAIN CONTAINER: Screen height fix, overflow hidden taaki double scroll na aaye
        <div className="flex h-screen w-full bg-[#0b1120] overflow-hidden font-sans">

            {/* 1. LEFT SIDE: Sidebar (Fixed Width) */}
            <div className="hidden md:flex flex-shrink-0 h-full">
                <Sidebar />
            </div>

            {/* 2. MOBILE OVERLAY (Only visible on small screens) */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className="relative animate-in slide-in-from-left h-full">
                        <Sidebar isMobile={true} closeMobileMenu={() => setIsMobileMenuOpen(false)} />
                    </div>
                </div>
            )}

            {/* 3. RIGHT SIDE: TopBar + Main Content */}
            <div className="flex-1 flex flex-col h-full min-w-0">

                {/* A. TopBar Header (Flex Item, will push content down) */}
                <div className="flex-shrink-0 z-30 relative">
                    <TopBar toggleSidebar={() => setIsMobileMenuOpen(true)} />
                </div>

                {/* B. Scrollable Page Content (Takes remaining space) */}
                <div className="flex-1 overflow-y-auto bg-[#0b1120] relative scroll-smooth">
                    {/* Padding wrapper to give content some breathing room from edges */}
                    <div className="min-h-full w-full">
                        <Outlet />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Layout;