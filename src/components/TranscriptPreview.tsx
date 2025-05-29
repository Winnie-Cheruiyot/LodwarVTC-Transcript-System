
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer, Download } from "lucide-react";
import { TranscriptData } from "@/types/transcript";
import { toast } from "sonner";
import { useState } from "react";

interface TranscriptPreviewProps {
  data: TranscriptData;
}

const TranscriptPreview = ({ data }: TranscriptPreviewProps) => {
  const [editableFields, setEditableFields] = useState({
    closingDay: "",
    openingDay: "",
    feeBalance: ""
  });

  const gradeScale = [
    { grade: "A", range: "70-100" },
    { grade: "B", range: "60-69" },
    { grade: "C", range: "50-59" },
    { grade: "D", range: "40-49" },
    { grade: "E", range: "0-39" },
  ];

  // Calculate overall totals and remarks
  const overallTotal = data.courseUnits.reduce((sum, unit) => sum + unit.total, 0);
  
  const calculateOverallGrade = (total: number): string => {
    if (total >= 420) return "DISTINCTION";
    if (total >= 301) return "CREDIT";
    if (total >= 200) return "PASS";
    return "FAIL";
  };

  const calculateOverallRemarks = (total: number): string => {
    if (total >= 420) return "Excellent performance with distinction.";
    if (total >= 301) return "Good performance with credit.";
    if (total >= 200) return "Satisfactory performance, passed.";
    return "Performance needs improvement.";
  };

  const overallGrade = calculateOverallGrade(overallTotal);
  const overallRemarks = calculateOverallRemarks(overallTotal);

  const generateAutomaticComments = () => {
    const totalUnits = data.courseUnits.length;
    const passedUnits = data.courseUnits.filter(unit => unit.total >= 40).length;
    const averageScore = data.courseUnits.reduce((sum, unit) => sum + unit.total, 0) / totalUnits;
    
    let performance = "";
    if (averageScore >= 70) performance = "excellent";
    else if (averageScore >= 60) performance = "good";
    else if (averageScore >= 50) performance = "satisfactory";
    else if (averageScore >= 40) performance = "fair";
    else performance = "needs improvement";

    return {
      managerComments: `Student has demonstrated ${performance} performance across ${totalUnits} course units with a total score of ${overallTotal}. ${overallRemarks}`,
      hodComments: `Academic performance reflects ${overallGrade.toLowerCase()} level competency. Student shows ${averageScore >= 60 ? 'strong' : averageScore >= 40 ? 'adequate' : 'limited'} grasp of practical and theoretical aspects.`
    };
  };

  const { managerComments, hodComments } = generateAutomaticComments();

  const handlePrint = () => {
    window.print();
    toast.success("Print dialog opened");
  };

  const handleDownload = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Transcript - ${data.studentName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; }
            .transcript { 
              width: 210mm; 
              min-height: 297mm; 
              margin: 0 auto; 
              padding: 10mm;
              font-size: 12px;
            }
            .header { text-align: center; margin-bottom: 20px; }
            .logo { width: 60px; height: 60px; margin: 0 auto 10px; background: #1e3a8a; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; }
            .contact-info { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 10px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { border: 1px solid #333; padding: 6px; text-align: left; font-size: 10px; }
            th { background-color: #1e3a8a; color: white; }
            .student-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px; }
            .main-content { display: grid; grid-template-columns: 2fr 1fr; gap: 15px; }
            .comments-section { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-top: 15px; }
            .comment-box { background: #f0f9ff; padding: 8px; border-radius: 5px; font-size: 9px; }
            .total-row { background-color: #dcfce7; font-weight: bold; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${document.getElementById('transcript-content')?.innerHTML}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    toast.success("Download initiated");
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-blue-900">Transcript Preview</h2>
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Editable Fields */}
      <Card className="p-4 bg-blue-50 mb-6">
        <h3 className="font-medium text-blue-900 mb-3">Editable Fields</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="closingDay">Closing Day</Label>
            <Input
              id="closingDay"
              value={editableFields.closingDay}
              onChange={(e) => setEditableFields({...editableFields, closingDay: e.target.value})}
              placeholder="e.g., 15th December 2024"
            />
          </div>
          <div>
            <Label htmlFor="openingDay">Opening Day</Label>
            <Input
              id="openingDay"
              value={editableFields.openingDay}
              onChange={(e) => setEditableFields({...editableFields, openingDay: e.target.value})}
              placeholder="e.g., 8th January 2025"
            />
          </div>
          <div>
            <Label htmlFor="feeBalance">Fee Balance</Label>
            <Input
              id="feeBalance"
              value={editableFields.feeBalance}
              onChange={(e) => setEditableFields({...editableFields, feeBalance: e.target.value})}
              placeholder="e.g., KSH 0"
            />
          </div>
        </div>
      </Card>

      <div id="transcript-content" className="bg-white p-6 rounded-lg border transcript-content" style={{ fontSize: '11px' }}>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">📞</span>
              </div>
              <span>0723456899</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✉</span>
              </div>
              <span>plodwaryouth@yahoo.com</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-900 font-bold text-xs">LVTC</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-blue-900 mb-1">
                LODWAR VOCATIONAL TRAINING CENTRE
              </h1>
            </div>
          </div>
          
          <div className="bg-blue-900 text-white py-2 px-4 rounded">
            <h2 className="text-lg font-bold">TRANSCRIPT</h2>
          </div>
        </div>

        {/* Student Information */}
        <div className="grid grid-cols-2 gap-6 mb-4 text-xs">
          <div>
            <div className="mb-3">
              <strong className="text-blue-900">Name of Student:</strong>
              <div className="border-b border-gray-300 pb-1 mt-1">
                {data.studentName}
              </div>
            </div>
            <div>
              <strong className="text-blue-900">COURSE:</strong>
              <div className="border-b border-gray-300 pb-1 mt-1">
                {data.course}
              </div>
            </div>
          </div>
          <div>
            <div className="mb-3">
              <strong className="text-blue-900">ADMISSION NO:</strong>
              <div className="border-b border-gray-300 pb-1 mt-1">
                {data.admissionNo}
              </div>
            </div>
            <div>
              <strong className="text-blue-900">School Year:</strong>
              <div className="border-b border-gray-300 pb-1 mt-1">
                {data.schoolYear}
              </div>
            </div>
          </div>
        </div>

        {/* Course Units Table and Grading System */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="col-span-2">
            <table className="w-full border-collapse border border-gray-400 text-xs">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="border border-gray-400 p-2 text-left">COURSE UNIT</th>
                  <th className="border border-gray-400 p-2 text-center">CAT</th>
                  <th className="border border-gray-400 p-2 text-center">EXAM</th>
                  <th className="border border-gray-400 p-2 text-center">TOTAL</th>
                  <th className="border border-gray-400 p-2 text-center">GRADE</th>
                </tr>
              </thead>
              <tbody>
                {data.courseUnits.map((unit, index) => (
                  <tr key={index} className="even:bg-green-50">
                    <td className="border border-gray-400 p-2 bg-green-100">{unit.name}</td>
                    <td className="border border-gray-400 p-2 text-center">{unit.cat}</td>
                    <td className="border border-gray-400 p-2 text-center">{unit.exam}</td>
                    <td className="border border-gray-400 p-2 text-center font-bold">{unit.total}</td>
                    <td className="border border-gray-400 p-2 text-center font-bold">{unit.grade}</td>
                  </tr>
                ))}
                <tr className="bg-green-200 total-row">
                  <td className="border border-gray-400 p-2 font-bold">Total</td>
                  <td className="border border-gray-400 p-2"></td>
                  <td className="border border-gray-400 p-2"></td>
                  <td className="border border-gray-400 p-2 text-center font-bold">{overallTotal}</td>
                  <td className="border border-gray-400 p-2 text-center font-bold">{overallGrade}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div>
            <div className="bg-blue-900 text-white p-2 text-center font-bold mb-2 text-xs">
              GRADING SYSTEM
            </div>
            <table className="w-full border-collapse border border-gray-400 text-xs">
              <tbody>
                {gradeScale.map((scale, index) => (
                  <tr key={index}>
                    <td className="border border-gray-400 p-2 text-center font-bold">
                      {scale.grade}
                    </td>
                    <td className="border border-gray-400 p-2 text-center">
                      {scale.range}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Remarks and Grade Scale */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
          <div>
            <strong className="text-blue-900">REMARKS</strong>
            <div className="border border-gray-300 p-2 mt-1 min-h-[40px]">
              {overallRemarks}
            </div>
          </div>
          <div>
            <strong className="text-blue-900">GRADE SCALE</strong>
            <div className="mt-1">
              <div className="bg-blue-900 text-white p-2 text-center font-bold mb-2 text-xs">
                GRADE SCALE
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="flex justify-between">
                    <strong>DISTINCTION</strong>
                    <span>451-600</span>
                  </div>
                  <div className="flex justify-between">
                    <strong>PASS</strong>
                    <span>200-300</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <strong>CREDIT</strong>
                    <span>301-450</span>
                  </div>
                  <div className="flex justify-between">
                    <strong>FAIL</strong>
                    <span>0-199</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-green-100 p-3 rounded text-xs">
            <strong className="text-blue-900">MANAGER COMMENTS AND FEEDBACK:</strong>
            <p className="mt-2 text-xs">{managerComments}</p>
            <div className="mt-6 text-center">
              <div className="border-t border-gray-400 pt-2">
                <strong className="text-xs">MANAGER LVTC</strong>
              </div>
            </div>
          </div>
          
          <div className="bg-green-100 p-3 rounded text-xs">
            <div className="text-center space-y-3">
              <div>
                <strong className="text-blue-900">Closing Day:</strong>
                <div className="border-b border-gray-300 mt-1 pb-1">{editableFields.closingDay}</div>
              </div>
              <div>
                <strong className="text-blue-900">Opening Day:</strong>
                <div className="border-b border-gray-300 mt-1 pb-1">{editableFields.openingDay}</div>
              </div>
              <div>
                <strong className="text-blue-900">Fee Balance:</strong>
                <div className="border-b border-gray-300 mt-1 pb-1">{editableFields.feeBalance}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-100 p-3 rounded text-xs">
            <strong className="text-blue-900">H.O.D COMMENTS AND FEEDBACK:</strong>
            <p className="mt-2 text-xs">{hodComments}</p>
            <div className="mt-6 text-center">
              <div className="border-t border-gray-400 pt-2">
                <strong className="text-xs">H.O.D</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .transcript-content {
            box-shadow: none !important;
            border: none !important;
            font-size: 10px !important;
          }
          
          body * {
            visibility: hidden;
          }
          
          #transcript-content, #transcript-content * {
            visibility: visible;
          }
          
          #transcript-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 5mm;
          }
        }
      `}</style>
    </Card>
  );
};

export default TranscriptPreview;
