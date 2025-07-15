import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, FileSpreadsheet, BarChart3 } from "lucide-react";
import { TranscriptData, BatchTranscriptData, AnalyticsData } from "@/types/transcript";
import { toast } from "sonner";
import { useTranscript } from "@/contexts/TranscriptContext";
import BatchTranscriptPreview from "./BatchTranscriptPreview";
import Analytics from "./Analytics";

interface ExcelUploaderProps {
  onDataParsed: (data: TranscriptData) => void;
}

const ExcelUploader = ({ onDataParsed }: ExcelUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setAnalyticsData, setBatchData, batchData } = useTranscript();
  const [localAnalyticsData, setLocalAnalyticsData] = useState<AnalyticsData | null>(null);

  const downloadTemplate = () => {
    const csvContent = `Student Name,Admission No,Course,School Year,Trade Theory CAT,Trade Theory Exam,Trade Practice CAT,Trade Practice Exam,Communication Skills CAT,Communication Skills Exam,Entrepreneurship CAT,Entrepreneurship Exam,Mathematics CAT,Mathematics Exam,General Science CAT,General Science Exam,Digital Literacy CAT,Digital Literacy Exam,Life Skills CAT,Life Skills Exam
John Doe,ADM001,ELECTRICAL INSTALLATION,2023/2024,25,45,28,52,22,48,26,49,24,46,23,47,27,53,24,46
Jane Smith,ADM002,PLUMBING,2023/2024,28,48,30,55,25,50,29,51,27,49,26,48,30,56,28,50
Mike Johnson,ADM003,CARPENTRY,2023/2024,24,42,26,44,20,45,25,46,23,43,22,44,25,47,23,45
Sarah Wilson,ADM004,ELECTRICAL INSTALLATION,2023/2024,30,50,32,58,28,52,30,54,29,51,27,49,31,57,29,53
David Brown,ADM005,PLUMBING,2023/2024,26,46,29,53,24,48,27,50,25,47,24,46,28,52,26,48
Lisa Taylor,ADM006,CARPENTRY,2023/2024,22,40,25,43,21,44,24,45,22,42,21,43,24,46,22,44
Robert Clark,ADM007,ELECTRICAL INSTALLATION,2023/2024,29,49,31,56,27,51,29,52,28,50,26,48,30,55,28,51
Emily Davis,ADM008,PLUMBING,2023/2024,27,47,30,54,26,49,28,51,26,48,25,47,29,53,27,49
Mark Thompson,ADM009,CARPENTRY,2023/2024,23,41,26,44,22,45,25,46,23,43,22,44,25,47,23,45
Jennifer Lee,ADM010,ELECTRICAL INSTALLATION,2023/2024,31,51,33,59,29,53,31,55,30,52,28,50,32,58,30,54`;

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

        const headers = lines[0].split(',').map(h => h.trim());
        const students: TranscriptData[] = [];

        // Process each student row (starting from line 1)
        lines.slice(1).forEach(line => {
          const cols = line.split(',').map(col => col.trim());
          if (cols.length < 4) return;
          
          const [studentName, admissionNo, course, schoolYear] = cols;
          
          // Standard course units including Life Skills
          const courseUnits = [
            {
              name: "TRADE THEORY",
              cat: Number(cols[4]) || 0,
              exam: Number(cols[5]) || 0,
              total: (Number(cols[4]) || 0) + (Number(cols[5]) || 0),
              grade: calculateGrade((Number(cols[4]) || 0) + (Number(cols[5]) || 0))
            },
            {
              name: "TRADE PRACTICE",
              cat: Number(cols[6]) || 0,
              exam: Number(cols[7]) || 0,
              total: (Number(cols[6]) || 0) + (Number(cols[7]) || 0),
              grade: calculateGrade((Number(cols[6]) || 0) + (Number(cols[7]) || 0))
            },
            {
              name: "COMMUNICATION SKILLS",
              cat: Number(cols[8]) || 0,
              exam: Number(cols[9]) || 0,
              total: (Number(cols[8]) || 0) + (Number(cols[9]) || 0),
              grade: calculateGrade((Number(cols[8]) || 0) + (Number(cols[9]) || 0))
            },
            {
              name: "ENTREPRENEURSHIP",
              cat: Number(cols[10]) || 0,
              exam: Number(cols[11]) || 0,
              total: (Number(cols[10]) || 0) + (Number(cols[11]) || 0),
              grade: calculateGrade((Number(cols[10]) || 0) + (Number(cols[11]) || 0))
            },
            {
              name: "MATHEMATICS",
              cat: Number(cols[12]) || 0,
              exam: Number(cols[13]) || 0,
              total: (Number(cols[12]) || 0) + (Number(cols[13]) || 0),
              grade: calculateGrade((Number(cols[12]) || 0) + (Number(cols[13]) || 0))
            },
            {
              name: "GENERAL SCIENCE",
              cat: Number(cols[14]) || 0,
              exam: Number(cols[15]) || 0,
              total: (Number(cols[14]) || 0) + (Number(cols[15]) || 0),
              grade: calculateGrade((Number(cols[14]) || 0) + (Number(cols[15]) || 0))
            },
            {
              name: "DIGITAL LITERACY",
              cat: Number(cols[16]) || 0,
              exam: Number(cols[17]) || 0,
              total: (Number(cols[16]) || 0) + (Number(cols[17]) || 0),
              grade: calculateGrade((Number(cols[16]) || 0) + (Number(cols[17]) || 0))
            },
            {
              name: "LIFE SKILLS",
              cat: Number(cols[18]) || 0,
              exam: Number(cols[19]) || 0,
              total: (Number(cols[18]) || 0) + (Number(cols[19]) || 0),
              grade: calculateGrade((Number(cols[18]) || 0) + (Number(cols[19]) || 0))
            }
          ];

          students.push({
            studentName,
            admissionNo,
            course,
            schoolYear,
            courseUnits
          });
        });
        
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
        const analytics = generateAnalytics(students);
        setAnalyticsData(analytics);
        setLocalAnalyticsData(analytics);
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

  if (batchData && localAnalyticsData) {
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
            <Analytics data={localAnalyticsData} />
          </TabsContent>
        </Tabs>

        <Button 
          onClick={() => {
            setBatchData(null);
            setLocalAnalyticsData(null);
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
              Upload a CSV file with student data in horizontal format (supports up to 200+ students)
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
              Download our horizontal CSV template with sample data for 10 students
            </p>
          </div>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
        </div>
      </Card>

      <div className="text-sm text-gray-600 space-y-2">
        <h4 className="font-medium">Horizontal Format Requirements:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>CSV format with headers in the first row</li>
          <li>Each row contains data for one complete student</li>
          <li>Headers: Student Name, Admission No, Course, School Year, followed by CAT and Exam scores for each subject</li>
          <li>Standard subjects: Trade Theory, Trade Practice, Communication Skills, Entrepreneurship, Mathematics, General Science, Digital Literacy, Life Skills</li>
          <li>CAT and Exam scores should be numbers (0-100)</li>
          <li>Can handle 200+ students in a single file</li>
          <li>Each student gets one complete row with all their subject scores</li>
        </ul>
      </div>
    </div>
  );
};

export default ExcelUploader;
