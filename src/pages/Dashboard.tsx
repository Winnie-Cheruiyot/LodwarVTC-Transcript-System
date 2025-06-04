
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      { name: "Sarah Brown", admissionNo: "LVT005", course: "Tailoring", total: 85, grade: "B" }
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
          <Tabs defaultValue="analytics" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="students" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Students
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Reports
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="analytics" className="mt-6">
              <Analytics data={analyticsData} />
            </TabsContent>
            
            <TabsContent value="students" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Student Management</h3>
                <p className="text-gray-600 mb-4">
                  Detailed student performance tracking and individual analytics coming soon.
                </p>
                <Button variant="outline">
                  View All Students
                </Button>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Generate Reports</h3>
                <p className="text-gray-600 mb-4">
                  Export detailed performance reports and analytics data.
                </p>
                <div className="flex gap-4">
                  <Button>
                    Export Performance Report
                  </Button>
                  <Button variant="outline">
                    Export Grade Summary
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
