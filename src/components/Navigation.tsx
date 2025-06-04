
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, BarChart3 } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-blue-900">
              LVTC Transcripts
            </h1>
          </div>
          
          <div className="flex space-x-2">
            <Link to="/">
              <Button 
                variant={location.pathname === "/" ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Generator
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button 
                variant={location.pathname === "/dashboard" ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
