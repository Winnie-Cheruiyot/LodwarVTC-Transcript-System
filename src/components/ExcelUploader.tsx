
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Download, FileSpreadsheet } from "lucide-react";
import { TranscriptData } from "@/types/transcript";
import { toast } from "sonner";

interface ExcelUploaderProps {
  onDataParsed: (data: TranscriptData) => void;
}

const ExcelUploader = ({ onDataParsed }: ExcelUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const csvContent = `Student Name,Admission No,Course,School Year,Unit Name,CAT Score,Exam Score
John Doe,ADM001,ELECTRICAL INSTALLATION,2023/2024,TRADE THEORY,25,45
John Doe,ADM001,ELECTRICAL INSTALLATION,2023/2024,TRADE PRACTICE,28,52
John Doe,ADM001,ELECTRICAL INSTALLATION,2023/2024,COMMUNICATION SKILLS,22,48
John Doe,ADM001,ELECTRICAL INSTALLATION,2023/2024,ENTREPRENEURSHIP,26,49
John Doe,ADM001,ELECTRICAL INSTALLATION,2023/2024,MATHEMATICS,24,46
John Doe,ADM001,ELECTRICAL INSTALLATION,2023/2024,GENERAL SCIENCE,23,47
John Doe,ADM001,ELECTRICAL INSTALLATION,2023/2024,DIGITAL LITERACY,27,53`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("Template downloaded successfully!");
  };

  const calculateGrade = (total: number): string => {
    if (total >= 70) return "A";
    if (total >= 60) return "B";
    if (total >= 50) return "C";
    if (total >= 40) return "D";
    return "E";
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        if (lines.length < 2) {
          toast.error("Please provide at least one data row");
          return;
        }

        const firstDataLine = lines[1].split(',');
        const studentName = firstDataLine[0]?.trim();
        const admissionNo = firstDataLine[1]?.trim();
        const course = firstDataLine[2]?.trim();
        const schoolYear = firstDataLine[3]?.trim();

        if (!studentName || !admissionNo || !course) {
          toast.error("Missing required student information in the file");
          return;
        }

        const courseUnits = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const cols = line.split(',');
            const unitName = cols[4]?.trim() || '';
            const cat = Number(cols[5]?.trim()) || 0;
            const exam = Number(cols[6]?.trim()) || 0;
            const total = cat + exam;
            const grade = calculateGrade(total);

            return {
              name: unitName,
              cat,
              exam,
              total,
              grade
            };
          })
          .filter(unit => unit.name);

        const transcriptData: TranscriptData = {
          studentName,
          admissionNo,
          course,
          schoolYear,
          courseUnits
        };

        onDataParsed(transcriptData);
        toast.success("Excel file processed successfully!");
        
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
              Upload a CSV file with student data and course units
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
              Download our CSV template to get started
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
          <li>Each row should contain data for one course unit</li>
          <li>CAT and Exam scores should be numbers (0-100)</li>
          <li>Multiple units for the same student should have identical student information</li>
        </ul>
      </div>
    </div>
  );
};

export default ExcelUploader;
