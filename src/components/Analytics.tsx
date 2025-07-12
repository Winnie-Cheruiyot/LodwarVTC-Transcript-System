
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AnalyticsData } from "@/types/transcript";
import { TrendingUp, Users, Award, BookOpen, Download, FileText, Trophy, GraduationCap } from "lucide-react";

interface AnalyticsProps {
  data: AnalyticsData;
}

const Analytics = ({ data }: AnalyticsProps) => {
  const handleExportReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      overallStats: data.overallStats,
      courseAnalytics: data.courseAnalytics,
      topStudents: data.topStudents
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LVTC-Performance-Report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportGrades = () => {
    const gradesData = data.topStudents.map(student => ({
      name: student.name,
      admissionNo: student.admissionNo,
      course: student.course,
      total: student.total,
      grade: student.grade
    }));
    
    const csvContent = [
      ['Name', 'Admission No', 'Course', 'Total Score', 'Grade'],
      ...gradesData.map(student => [
        student.name,
        student.admissionNo,
        student.course,
        student.total.toString(),
        student.grade
      ])
    ].map(row => row.join(',')).join('\n');
    
    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LVTC-Grade-Summary-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Calculate overall school average
  const overallSchoolAverage = data.courseAnalytics.reduce((sum, course) => sum + course.averageScore, 0) / data.courseAnalytics.length;

  // Get top 10 students for each course
  const getTopStudentsByCourse = (courseName: string) => {
    return data.topStudents
      .filter(student => student.course === courseName)
      .slice(0, 10);
  };

  // Get best student in each subject
  const getBestStudentPerCourse = () => {
    return data.courseAnalytics.map(course => {
      const courseStudents = data.topStudents.filter(student => student.course === course.courseName);
      const bestStudent = courseStudents.reduce((best, current) => 
        current.total > best.total ? current : best
      , courseStudents[0]);
      return {
        courseName: course.courseName,
        bestStudent: bestStudent || null
      };
    });
  };

  const bestStudentsPerCourse = getBestStudentPerCourse();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-900">Enhanced Analytics Dashboard</h2>
        <div className="flex gap-2">
          <Button onClick={handleExportReport} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Performance Report
          </Button>
          <Button variant="outline" onClick={handleExportGrades} className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Export Grade Summary
          </Button>
        </div>
      </div>
      
      {/* Enhanced Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <p className="text-sm text-gray-600">School Average</p>
              <p className="text-2xl font-bold">{overallSchoolAverage.toFixed(1)}%</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">Overall Pass Rate</p>
              <p className="text-2xl font-bold">{data.overallStats.overallPassRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold">{data.courseAnalytics.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="top-students">Top Students</TabsTrigger>
          <TabsTrigger value="course-leaders">Course Leaders</TabsTrigger>
          <TabsTrigger value="course-rankings">Course Rankings</TabsTrigger>
          <TabsTrigger value="all-students">All Students</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Course Analytics with Enhanced Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Course Performance Analysis
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Average Score</TableHead>
                  <TableHead>Top Score</TableHead>
                  <TableHead>Pass Rate</TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.courseAnalytics.map((course, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-semibold">{course.courseName}</TableCell>
                    <TableCell>{course.studentCount}</TableCell>
                    <TableCell>{course.averageScore.toFixed(1)}%</TableCell>
                    <TableCell className="font-semibold">{course.topScore}%</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-sm font-semibold ${
                        course.passRate >= 85 ? 'bg-green-100 text-green-800' :
                        course.passRate >= 70 ? 'bg-blue-100 text-blue-800' :
                        course.passRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {course.passRate.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      {course.averageScore >= 80 ? '🌟 Excellent' :
                       course.averageScore >= 70 ? '✅ Good' :
                       course.averageScore >= 60 ? '⚠️ Average' : '❌ Needs Improvement'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="top-students" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Top 10 Students - Whole School
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Admission No</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Total Score</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topStudents.slice(0, 10).map((student, index) => (
                  <TableRow key={student.admissionNo}>
                    <TableCell className="font-semibold">
                      {index + 1}
                      {index === 0 && ' 🥇'}
                      {index === 1 && ' 🥈'}
                      {index === 2 && ' 🥉'}
                    </TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.admissionNo}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell className="font-semibold">{student.total}%</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-sm font-semibold ${
                        student.grade === 'A' ? 'bg-green-100 text-green-800' :
                        student.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                        student.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {student.grade}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="course-leaders" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Best Student in Each Course
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Best Student</TableHead>
                  <TableHead>Admission No</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bestStudentsPerCourse.map((courseData, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-semibold">{courseData.courseName}</TableCell>
                    <TableCell>{courseData.bestStudent?.name || 'N/A'}</TableCell>
                    <TableCell>{courseData.bestStudent?.admissionNo || 'N/A'}</TableCell>
                    <TableCell className="font-semibold">{courseData.bestStudent?.total || 0}%</TableCell>
                    <TableCell>
                      {courseData.bestStudent && (
                        <span className={`px-2 py-1 rounded text-sm font-semibold ${
                          courseData.bestStudent.grade === 'A' ? 'bg-green-100 text-green-800' :
                          courseData.bestStudent.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                          courseData.bestStudent.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {courseData.bestStudent.grade}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="course-rankings" className="space-y-6">
          {data.courseAnalytics.map((course, courseIndex) => {
            const courseTopStudents = getTopStudentsByCourse(course.courseName);
            return (
              <Card key={courseIndex} className="p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  Top 10 Students - {course.courseName}
                </h3>
                {courseTopStudents.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Admission No</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courseTopStudents.map((student, index) => (
                        <TableRow key={student.admissionNo}>
                          <TableCell className="font-semibold">{index + 1}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.admissionNo}</TableCell>
                          <TableCell className="font-semibold">{student.total}%</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-sm font-semibold ${
                              student.grade === 'A' ? 'bg-green-100 text-green-800' :
                              student.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                              student.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {student.grade}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-gray-500">No students found for this course.</p>
                )}
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="all-students" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              All Students ({data.topStudents.length})
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Admission No</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Total Score</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topStudents.map((student, index) => (
                  <TableRow key={student.admissionNo}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.admissionNo}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell className="font-semibold">{student.total}%</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-sm font-semibold ${
                        student.grade === 'A' ? 'bg-green-100 text-green-800' :
                        student.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                        student.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {student.grade}
                      </span>
                    </TableCell>
                    <TableCell>
                      {student.total >= 80 ? '🌟 Excellent' :
                       student.total >= 70 ? '✅ Good' :
                       student.total >= 60 ? '⚠️ Average' : '❌ Below Average'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
