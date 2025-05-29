
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, FileSpreadsheet, BarChart3 } from "lucide-react";
import { TranscriptData, BatchTranscriptData, AnalyticsData } from "@/types/transcript";
import { toast } from "sonner";
import BatchTranscriptPreview from "./BatchTranscriptPreview";
import Analytics from "./Analytics";

interface ExcelUploaderProps {
  onDataParsed: (data: TranscriptData) => void;
}

const ExcelUploader = ({ onDataParsed }: ExcelUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [batchData, setBatchData] = useState<BatchTranscriptData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  const downloadTemplate = () => {
    const csvContent = `Student Name,Admission No,Course,School Year,Unit Name,CAT Score,Exam Score
John Doe,ADM001,ELECTRICAL INSTALLATION,2023/2024,TRADE THEORY,25,45
John Doe,ADM001,ELECTRICAL INSTALLATION,2023/2024,TRADE PRACTICE,28,52
John Doe,ADM001,ELECTRICAL INSTALLATION,2023/2024,COMMUNICATION SKILLS,22,48
John Doe,ADM001,ELECTRICAL INSTALLATION,2023/2024,ENTREPRENEURSHIP,26,49
John Doe,ADM001,ELECTRICAL INSTALLATION,2023/2024,MATHEMATICS,24,46
John Doe,ADM001,ELECTRICAL INSTALLATION,2023/2024,GENERAL SCIENCE,23,47
John Doe,ADM001,ELECTRICAL INSTALLATION,2023/2024,DIGITAL LITERACY,27,53
Jane Smith,ADM002,PLUMBING,2023/2024,TRADE THEORY,28,48
Jane Smith,ADM002,PLUMBING,2023/2024,TRADE PRACTICE,30,55
Jane Smith,ADM002,PLUMBING,2023/2024,COMMUNICATION SKILLS,25,50
Jane Smith,ADM002,PLUMBING,2023/2024,ENTREPRENEURSHIP,29,51
Jane Smith,ADM002,PLUMBING,2023/2024,MATHEMATICS,27,49
Jane Smith,ADM002,PLUMBING,2023/2024,GENERAL SCIENCE,26,48
Jane Smith,ADM002,PLUMBING,2023/2024,DIGITAL LITERACY,30,56
Mike Johnson,ADM003,CARPENTRY,2023/2024,TRADE THEORY,24,42
Mike Johnson,ADM003,CARPENTRY,2023/2024,TRADE PRACTICE,26,44
Mike Johnson,ADM003,CARPENTRY,2023/2024,COMMUNICATION SKILLS,20,45
Mike Johnson,ADM003,CARPENTRY,2023/2024,ENTREPRENEURSHIP,25,46
Mike Johnson,ADM003,CARPENTRY,2023/2024,MATHEMATICS,23,43
Mike Johnson,ADM003,CARPENTRY,2023/2024,GENERAL SCIENCE,22,44
Mike Johnson,ADM003,CARPENTRY,2023/2024,DIGITAL LITERACY,25,47`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'batch_transcript_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("Batch template downloaded successfully!");
  };

  const calculateGrade = (total: number): string => {
    if (total >= 70) return "A";
    if (total >= 60) return "B";
    if (total >= 50) return "C";
    if (total >= 40) return "D";
    return "E";
  };

  const generateAnalytics = (students: TranscriptData[]): AnalyticsData => {
    // Calculate overall totals for each student
    const studentsWithTotals = students.map(student => {
      const total = student.courseUnits.reduce((sum, unit) => sum + unit.total, 0);
      const grade = total >= 420 ? "DISTINCTION" : total >= 301 ? "CREDIT" : total >= 200 ? "PASS" : "FAIL";
      return {
        name: student.studentName,
        admissionNo: student.admissionNo,
        course: student.course,
        total,
        grade,
        passed: total >= 200
      };
    });

    // Top students
    const topStudents = studentsWithTotals
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    // Course analytics
    const courseMap = new Map<string, Array<{ total: number; passed: boolean }>>();
    studentsWithTotals.forEach(student => {
      if (!courseMap.has(student.course)) {
        courseMap.set(student.course, []);
      }
      courseMap.get(student.course)!.push({ total: student.total, passed: student.passed });
    });

    const courseAnalytics = Array.from(courseMap.entries()).map(([courseName, studentData]) => {
      const totalScore = studentData.reduce((sum, s) => sum + s.total, 0);
      const averageScore = totalScore / studentData.length;
      const topScore = Math.max(...studentData.map(s => s.total));
      const passedCount = studentData.filter(s => s.passed).length;
      const passRate = (passedCount / studentData.length) * 100;

      return {
        courseName,
        studentCount: studentData.length,
        averageScore,
        topScore,
        passRate
      };
    });

    // Overall stats
    const totalStudents = students.length;
    const overallAverage = studentsWithTotals.reduce((sum, s) => sum + s.total, 0) / totalStudents;
    const passedStudents = studentsWithTotals.filter(s => s.passed).length;
    const overallPassRate = (passedStudents / totalStudents) * 100;

    return {
      topStudents,
      courseAnalytics,
      overallStats: {
        totalStudents,
        overallAverage,
        overallPassRate
      }
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          toast.error("Please provide at least one data row");
          return;
        }

        // Group data by student
        const studentDataMap = new Map<string, any>();
        
        lines.slice(1).forEach(line => {
          const cols = line.split(',').map(col => col.trim());
          if (cols.length < 7) return;
          
          const [studentName, admissionNo, course, schoolYear, unitName, catStr, examStr] = cols;
          const cat = Number(catStr) || 0;
          const exam = Number(examStr) || 0;
          const total = cat + exam;
          const grade = calculateGrade(total);

          const studentKey = `${admissionNo}-${studentName}`;
          
          if (!studentDataMap.has(studentKey)) {
            studentDataMap.set(studentKey, {
              studentName,
              admissionNo,
              course,
              schoolYear,
              courseUnits: []
            });
          }

          if (unitName) {
            studentDataMap.get(studentKey).courseUnits.push({
              name: unitName,
              cat,
              exam,
              total,
              grade
            });
          }
        });

        const students = Array.from(studentDataMap.values()) as TranscriptData[];
        
        if (students.length === 0) {
          toast.error("No valid student data found");
          return;
        }

        // If only one student, use the single transcript view
        if (students.length === 1) {
          onDataParsed(students[0]);
          toast.success("Single transcript loaded successfully!");
          return;
        }

        // For multiple students, set up batch processing
        const batchTranscriptData: BatchTranscriptData = {
          students,
          metadata: {
            schoolYear: students[0]?.schoolYear || '',
            uploadDate: new Date().toISOString().split('T')[0],
            totalStudents: students.length
          }
        };

        setBatchData(batchTranscriptData);
        setAnalyticsData(generateAnalytics(students));
        toast.success(`Batch data loaded: ${students.length} students processed successfully!`);
        
      } catch (error) {
        console.error('Error parsing file:', error);
        toast.error("Error processing the file. Please check the format.");
      }
    };

    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (batchData && analyticsData) {
    return (
      <div className="space-y-6">
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Batch Preview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="mt-6">
            <BatchTranscriptPreview data={batchData} />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <Analytics data={analyticsData} />
          </TabsContent>
        </Tabs>

        <Button 
          onClick={() => {
            setBatchData(null);
            setAnalyticsData(null);
          }} 
          variant="outline" 
          className="w-full"
        >
          Upload New File
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 border-dashed border-2 border-blue-300 hover:border-blue-500 transition-colors">
        <div className="text-center space-y-4">
          <FileSpreadsheet className="w-16 h-16 text-blue-500 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Upload Excel/CSV File
            </h3>
            <p className="text-gray-600 mb-4">
              Upload a CSV file with student data and course units (supports multiple students)
            </p>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-900 hover:bg-blue-800"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-blue-900">Need a template?</h4>
            <p className="text-sm text-blue-700">
              Download our CSV template with sample data for multiple students
            </p>
          </div>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
        </div>
      </Card>

      <div className="text-sm text-gray-600 space-y-2">
        <h4 className="font-medium">File Format Requirements:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>CSV format with headers: Student Name, Admission No, Course, School Year, Unit Name, CAT Score, Exam Score</li>
          <li>Each row contains data for one course unit</li>
          <li>Multiple students can be included in the same file</li>
          <li>Each student should have multiple rows (one per course unit)</li>
          <li>CAT and Exam scores should be numbers (0-100)</li>
          <li>Student information must be consistent across all rows for the same student</li>
        </ul>
      </div>
    </div>
  );
};

export default ExcelUploader;
