
import { Card } from "@/components/ui/card";
import { AnalyticsData } from "@/types/transcript";
import { TrendingUp, Users, Award, BookOpen } from "lucide-react";

interface AnalyticsProps {
  data: AnalyticsData;
}

const Analytics = ({ data }: AnalyticsProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Analytics Dashboard</h2>
      
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold">{data.overallStats.totalStudents}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Overall Average</p>
              <p className="text-2xl font-bold">{data.overallStats.overallAverage.toFixed(1)}%</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">Pass Rate</p>
              <p className="text-2xl font-bold">{data.overallStats.overallPassRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Students */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Top Performing Students
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Rank</th>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Admission No</th>
                <th className="text-left p-2">Course</th>
                <th className="text-left p-2">Total Score</th>
                <th className="text-left p-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {data.topStudents.slice(0, 10).map((student, index) => (
                <tr key={student.admissionNo} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-semibold">{index + 1}</td>
                  <td className="p-2">{student.name}</td>
                  <td className="p-2">{student.admissionNo}</td>
                  <td className="p-2">{student.course}</td>
                  <td className="p-2 font-semibold">{student.total}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${
                      student.grade === 'A' ? 'bg-green-100 text-green-800' :
                      student.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                      student.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Course Analytics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Course Performance Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Course</th>
                <th className="text-left p-2">Students</th>
                <th className="text-left p-2">Average Score</th>
                <th className="text-left p-2">Top Score</th>
                <th className="text-left p-2">Pass Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.courseAnalytics.map((course, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-semibold">{course.courseName}</td>
                  <td className="p-2">{course.studentCount}</td>
                  <td className="p-2">{course.averageScore.toFixed(1)}%</td>
                  <td className="p-2 font-semibold">{course.topScore}%</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${
                      course.passRate >= 80 ? 'bg-green-100 text-green-800' :
                      course.passRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {course.passRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
