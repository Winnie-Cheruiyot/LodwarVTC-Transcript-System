
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Analytics from "@/components/Analytics";
import { AnalyticsData, TranscriptData } from "@/types/transcript";
import { BarChart3, TrendingUp, Users, FileText } from "lucide-react";

const Dashboard = () => {
  // Sample analytics data - in a real app, this would come from your backend
  const [analyticsData] = useState<AnalyticsData>({
    overallStats: {
      totalStudents: 156,
      overallAverage: 78.5,
      overallPassRate: 84.6
    },
    topStudents: [
      { name: "Jane Doe", admissionNo: "LVT001", course: "Electrical Installation", total: 95, grade: "A" },
      { name: "John Smith", admissionNo: "LVT002", course: "Plumbing", total: 92, grade: "A" },
      { name: "Mary Johnson", admissionNo: "LVT003", course: "Carpentry", total: 89, grade: "B" },
      { name: "Peter Wilson", admissionNo: "LVT004", course: "Masonry", total: 87, grade: "B" },
      { name: "Sarah Brown", admissionNo: "LVT005", course: "Tailoring", total: 85, grade: "B" },
      { name: "David Miller", admissionNo: "LVT006", course: "Electrical Installation", total: 88, grade: "B" },
      { name: "Lisa Anderson", admissionNo: "LVT007", course: "Computer Studies", total: 94, grade: "A" },
      { name: "Michael Davis", admissionNo: "LVT008", course: "Plumbing", total: 83, grade: "B" },
      { name: "Jennifer White", admissionNo: "LVT009", course: "Carpentry", total: 81, grade: "B" },
      { name: "Robert Taylor", admissionNo: "LVT010", course: "Masonry", total: 79, grade: "C" },
      { name: "Emma Wilson", admissionNo: "LVT011", course: "Tailoring", total: 82, grade: "B" },
      { name: "James Moore", admissionNo: "LVT012", course: "Computer Studies", total: 90, grade: "A" },
      { name: "Olivia Clark", admissionNo: "LVT013", course: "Electrical Installation", total: 86, grade: "B" },
      { name: "William Lee", admissionNo: "LVT014", course: "Plumbing", total: 78, grade: "C" },
      { name: "Sophia Garcia", admissionNo: "LVT015", course: "Carpentry", total: 84, grade: "B" },
      { name: "Alexander Martin", admissionNo: "LVT016", course: "Masonry", total: 77, grade: "C" },
      { name: "Isabella Rodriguez", admissionNo: "LVT017", course: "Tailoring", total: 80, grade: "B" },
      { name: "Benjamin Hall", admissionNo: "LVT018", course: "Computer Studies", total: 87, grade: "B" },
      { name: "Charlotte Young", admissionNo: "LVT019", course: "Electrical Installation", total: 91, grade: "A" },
      { name: "Noah King", admissionNo: "LVT020", course: "Plumbing", total: 75, grade: "C" }
    ],
    courseAnalytics: [
      { courseName: "Electrical Installation", studentCount: 32, averageScore: 82.3, topScore: 95, passRate: 87.5 },
      { courseName: "Plumbing", studentCount: 28, averageScore: 79.1, topScore: 92, passRate: 85.7 },
      { courseName: "Carpentry", studentCount: 24, averageScore: 76.8, topScore: 89, passRate: 83.3 },
      { courseName: "Masonry", studentCount: 30, averageScore: 75.2, topScore: 87, passRate: 80.0 },
      { courseName: "Tailoring", studentCount: 22, averageScore: 78.9, topScore: 85, passRate: 86.4 },
      { courseName: "Computer Studies", studentCount: 20, averageScore: 81.5, topScore: 94, passRate: 90.0 }
    ]
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
