
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Analytics from "@/components/Analytics";
import { AnalyticsData, TranscriptData } from "@/types/transcript";
import { BarChart3, TrendingUp, Users, FileText } from "lucide-react";

const Dashboard = () => {
  // Available courses for the vocational training centre
  const availableCourses = [
    "Motor Vehicles Mechanics",
    "Carpentry and Joinery",
    "Arc Welding",
    "Masonry and Building Technology",
    "Fashion Design and Garment Making",
    "Information Communication Technology",
    "Hairdressing and Beauty Therapy",
    "Electrical Wireman",
    "Plumbing and Pipe Fitting Technology",
    "Food Processing and Beverage"
  ];

  // Clear analytics data - ready for new data
  const [analyticsData] = useState<AnalyticsData>({
    overallStats: {
      totalStudents: 0,
      overallAverage: 0,
      overallPassRate: 0
    },
    topStudents: [],
    courseAnalytics: availableCourses.map(courseName => ({
      courseName,
      studentCount: 0,
      averageScore: 0,
      topScore: 0,
      passRate: 0
    }))
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2 flex items-center justify-center gap-3">
            <BarChart3 className="w-10 h-10" />
            Results Analysis Dashboard
          </h1>
          <p className="text-lg text-blue-700">
            Lodwar Vocational Training Centre
          </p>
          <p className="text-sm text-blue-600 mt-2">
            Comprehensive analytics and insights for student performance
          </p>
        </div>

        <div className="mb-6">
          <Analytics data={analyticsData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
