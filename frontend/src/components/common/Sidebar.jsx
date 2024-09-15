import {
  BarChart2,
  Bug,
  Hospital,
  LogOut,
  Menu,
  Microchip,
  ServerCog,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS = [
  {
    name: "Overview",
    icon: BarChart2,
    color: "#6366f1",
    href: "/",
  },
  {
    name: "Organizations",
    icon: Hospital,
    color: "#10B981",
    href: "/organizations",
  },
  { name: "Users", icon: Users, color: "#EC4899", href: "/users" },
  { name: "Boxes", icon: Bug, color: "#8B5CF6", href: "/boxes" },

  { name: "Relays", icon: Microchip, color: "#F59E0B", href: "/relays" },
  { name: "Sensors", icon: ServerCog, color: "#3B82F6", href: "/sensors" },
  {
    name: "Authority",
    icon: Shield,
    color: "#34D399",
    href: "/authority",
  },
  { name: "Settings", icon: Settings, color: "#6EE7B7", href: "/login" },
  { name: "Log out", icon: LogOut, color: "red", href: "/logout" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Update isSidebarOpen based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Adjust the breakpoint as needed
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Run on mount
    handleResize();

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="h-full bg-purple-950 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={"24"} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.href} to={item.href}>
              <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
                <item.icon
                  size={20}
                  style={{ color: item.color, minWidth: "20px" }}
                />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
