
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Analytics from "@/components/Analytics";
import { useTranscript } from "@/contexts/TranscriptContext";
import { BarChart3, TrendingUp, Users, FileText, Trophy, Award, Star } from "lucide-react";

const Dashboard = () => {
  const { analyticsData, batchData } = useTranscript();

  const getSubjectCategory = (unitName: string): string => {
    const name = unitName.toLowerCase();
    if (name.includes('theory') || name.includes('theoretical')) return 'Trade Theory';
    if (name.includes('practice') || name.includes('practical') || name.includes('workshop')) return 'Trade Practice';
    if (name.includes('communication') || name.includes('english') || name.includes('language')) return 'Communication Skills';
    if (name.includes('entrepreneur') || name.includes('business')) return 'Entrepreneurship';
    if (name.includes('math') || name.includes('arithmetic') || name.includes('calculation')) return 'Mathematics';
    if (name.includes('science') || name.includes('physics') || name.includes('chemistry') || name.includes('biology')) return 'General Science';
    if (name.includes('digital') || name.includes('computer') || name.includes('ict') || name.includes('technology')) return 'Digital Literacy';
    if (name.includes('life') || name.includes('social') || name.includes('ethics') || name.includes('guidance')) return 'Life Skills';
    return 'Other';
  };

  const getBestStudentsInSubjectCategories = () => {
    if (!batchData?.students) return [];

    const subjectCategories = [
      'Trade Theory',
      'Trade Practice', 
      'Communication Skills',
      'Entrepreneurship',
      'Mathematics',
      'General Science',
      'Digital Literacy',
      'Life Skills'
    ];

    return subjectCategories.map(category => {
      const studentScores = batchData.students.map(student => {
        const categoryUnits = student.courseUnits.filter(unit => getSubjectCategory(unit.name) === category);
        if (categoryUnits.length === 0) return { student, average: 0, hasCategory: false };
        
        const totalScore = categoryUnits.reduce((sum, unit) => sum + unit.total, 0);
        const average = totalScore / categoryUnits.length;
        
        return { student, average, hasCategory: true };
      }).filter(item => item.hasCategory);

      const bestStudent = studentScores.reduce((best, current) => 
        current.average > best.average ? current : best, 
        studentScores[0]
      );

      return {
        category,
        bestStudent: bestStudent || null,
        totalStudents: studentScores.length
      };
    }).filter(item => item.bestStudent);
  };

  const bestStudentsByCategory = getBestStudentsInSubjectCategories();

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

  // Default empty analytics data when no data is available
  const defaultAnalyticsData = {
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
  };

  const displayData = analyticsData || defaultAnalyticsData;

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
          <Analytics data={displayData} />
        </div>

        {/* Best Students by Subject Categories */}
        {bestStudentsByCategory.length > 0 && (
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <div>
                <h2 className="text-2xl font-bold text-yellow-900">Best Students by Subject Categories</h2>
                <p className="text-yellow-700">Top performers in each academic area</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {bestStudentsByCategory.map((item, index) => (
                <Card key={index} className="p-4 bg-white border-yellow-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{item.category}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold text-gray-900 text-sm">{item.bestStudent.student.studentName}</span>
                    </div>
                    
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Admission: {item.bestStudent.student.admissionNo}</div>
                      <div>Course: {item.bestStudent.student.course}</div>
                      <div className="flex justify-between items-center">
                        <span>Average Score:</span>
                        <span className="font-bold text-yellow-600">{item.bestStudent.average.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-center">
                      <span className="text-yellow-700">🏆 Top of {item.totalStudents} students</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
