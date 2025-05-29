
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
            body { font-family: 'Georgia', serif; margin: 0; background: white; }
            .transcript { 
              width: 210mm; 
              min-height: 297mm; 
              margin: 0 auto; 
              padding: 15mm;
              font-size: 14px;
              line-height: 1.4;
              background: white;
            }
            .header { text-align: center; margin-bottom: 25px; }
            .logo { 
              width: 80px; 
              height: 80px; 
              margin: 0 auto 15px; 
              background: linear-gradient(135deg, #1e40af, #3b82f6); 
              border-radius: 50%; 
              color: white; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-weight: bold; 
              font-size: 18px;
              box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
            }
            .contact-info { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 20px; 
              font-size: 13px; 
              color: #1e40af;
              font-weight: 500;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              border-radius: 8px;
              overflow: hidden;
            }
            th, td { 
              border: 1px solid #e5e7eb; 
              padding: 12px; 
              text-align: left; 
              font-size: 13px; 
            }
            th { 
              background: linear-gradient(135deg, #1e40af, #3b82f6); 
              color: white; 
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .student-info { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 30px; 
              margin-bottom: 20px; 
              background: #f8fafc;
              padding: 20px;
              border-radius: 12px;
              border: 2px solid #e2e8f0;
            }
            .comments-section { 
              display: grid; 
              grid-template-columns: 1fr 1fr 1fr; 
              gap: 15px; 
              margin-top: 20px; 
            }
            .comment-box { 
              background: linear-gradient(135deg, #f0f9ff, #e0f2fe); 
              padding: 15px; 
              border-radius: 12px; 
              font-size: 12px; 
              border: 1px solid #0ea5e9;
              box-shadow: 0 2px 4px rgba(14, 165, 233, 0.1);
            }
            .total-row { 
              background: linear-gradient(135deg, #dcfce7, #bbf7d0); 
              font-weight: bold; 
            }
            .grade-system {
              background: linear-gradient(135deg, #fef3c7, #fde68a);
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 120px;
              color: rgba(30, 64, 175, 0.05);
              font-weight: bold;
              z-index: -1;
              pointer-events: none;
            }
            @media print { 
              body { margin: 0; } 
              .watermark { display: block; }
            }
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
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">📜</span>
          </div>
          Transcript Preview
        </h2>
        <div className="flex gap-3">
          <Button onClick={handlePrint} variant="outline" size="sm" className="hover:bg-blue-50">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Enhanced Editable Fields */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-6">
        <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">✏</span>
          Editable Fields
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="closingDay" className="text-blue-800 font-medium">Closing Day</Label>
            <Input
              id="closingDay"
              value={editableFields.closingDay}
              onChange={(e) => setEditableFields({...editableFields, closingDay: e.target.value})}
              placeholder="e.g., 15th December 2024"
              className="border-blue-200 focus:border-blue-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="openingDay" className="text-blue-800 font-medium">Opening Day</Label>
            <Input
              id="openingDay"
              value={editableFields.openingDay}
              onChange={(e) => setEditableFields({...editableFields, openingDay: e.target.value})}
              placeholder="e.g., 8th January 2025"
              className="border-blue-200 focus:border-blue-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="feeBalance" className="text-blue-800 font-medium">Fee Balance</Label>
            <Input
              id="feeBalance"
              value={editableFields.feeBalance}
              onChange={(e) => setEditableFields({...editableFields, feeBalance: e.target.value})}
              placeholder="e.g., KSH 0"
              className="border-blue-200 focus:border-blue-400"
            />
          </div>
        </div>
      </Card>

      <div id="transcript-content" className="bg-white p-8 rounded-xl border-2 border-blue-100 transcript-content shadow-xl relative overflow-hidden" style={{ fontSize: '15px', fontFamily: 'Georgia, serif' }}>
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <span className="text-8xl font-bold text-blue-900 transform rotate-45">LVTC</span>
        </div>

        {/* Enhanced Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="flex items-center justify-between mb-4 text-sm">
            <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm">📞</span>
              </div>
              <span className="font-semibold text-blue-800">0723456899</span>
            </div>
            <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm">✉</span>
              </div>
              <span className="font-semibold text-blue-800">plodwaryouth@yahoo.com</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-lg">LVTC</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2 tracking-wide">
                LODWAR VOCATIONAL TRAINING CENTRE
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto rounded-full"></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-4 px-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold tracking-widest">OFFICIAL TRANSCRIPT</h2>
          </div>
        </div>

        {/* Enhanced Student Information */}
        <div className="grid grid-cols-2 gap-8 mb-6 text-base relative z-10">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <div className="mb-4">
              <strong className="text-blue-900 text-sm uppercase tracking-wide">Name of Student:</strong>
              <div className="border-b-2 border-blue-300 pb-2 mt-2 text-lg font-semibold text-gray-800">
                {data.studentName}
              </div>
            </div>
            <div>
              <strong className="text-blue-900 text-sm uppercase tracking-wide">Course:</strong>
              <div className="border-b-2 border-blue-300 pb-2 mt-2 text-lg font-semibold text-gray-800">
                {data.course}
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <div className="mb-4">
              <strong className="text-blue-900 text-sm uppercase tracking-wide">Admission No:</strong>
              <div className="border-b-2 border-blue-300 pb-2 mt-2 text-lg font-semibold text-gray-800">
                {data.admissionNo}
              </div>
            </div>
            <div>
              <strong className="text-blue-900 text-sm uppercase tracking-wide">School Year:</strong>
              <div className="border-b-2 border-blue-300 pb-2 mt-2 text-lg font-semibold text-gray-800">
                {data.schoolYear}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Course Units Table and Grading System */}
        <div className="grid grid-cols-3 gap-6 mb-6 relative z-10">
          <div className="col-span-2">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-800 to-blue-900 text-white">
                    <th className="p-4 text-left font-semibold tracking-wide">COURSE UNIT</th>
                    <th className="p-4 text-center font-semibold tracking-wide">CAT</th>
                    <th className="p-4 text-center font-semibold tracking-wide">EXAM</th>
                    <th className="p-4 text-center font-semibold tracking-wide">TOTAL</th>
                    <th className="p-4 text-center font-semibold tracking-wide">GRADE</th>
                  </tr>
                </thead>
                <tbody>
                  {data.courseUnits.map((unit, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                      <td className="p-4 bg-gradient-to-r from-green-100 to-green-50 font-medium text-gray-800">{unit.name}</td>
                      <td className="p-4 text-center font-medium">{unit.cat}</td>
                      <td className="p-4 text-center font-medium">{unit.exam}</td>
                      <td className="p-4 text-center font-bold text-blue-900">{unit.total}</td>
                      <td className="p-4 text-center font-bold text-blue-900">{unit.grade}</td>
                    </tr>
                  ))}
                  <tr className="bg-gradient-to-r from-green-200 to-green-300 border-t-2 border-green-400">
                    <td className="p-4 font-bold text-green-900">TOTAL</td>
                    <td className="p-4"></td>
                    <td className="p-4"></td>
                    <td className="p-4 text-center font-bold text-green-900 text-lg">{overallTotal}</td>
                    <td className="p-4 text-center font-bold text-green-900 text-lg">{overallGrade}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl overflow-hidden shadow-lg border border-amber-200">
              <div className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white p-4 text-center font-bold tracking-wide">
                GRADING SYSTEM
              </div>
              <table className="w-full">
                <tbody>
                  {gradeScale.map((scale, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-amber-50" : "bg-white"}>
                      <td className="p-3 text-center font-bold text-amber-800">
                        {scale.grade}
                      </td>
                      <td className="p-3 text-center font-semibold text-amber-700">
                        {scale.range}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Enhanced Remarks and Grade Scale */}
        <div className="grid grid-cols-2 gap-6 mb-6 relative z-10">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
            <strong className="text-purple-900 text-sm uppercase tracking-wide">Academic Remarks</strong>
            <div className="border border-purple-200 p-4 mt-3 min-h-[80px] rounded-lg bg-white">
              <p className="text-gray-800 font-medium leading-relaxed">{overallRemarks}</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200">
            <strong className="text-emerald-900 text-sm uppercase tracking-wide">Overall Grade Scale</strong>
            <div className="mt-3">
              <div className="bg-gradient-to-r from-emerald-700 to-green-700 text-white p-3 text-center font-bold mb-3 rounded-lg tracking-wide">
                PERFORMANCE SCALE
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between bg-emerald-100 p-2 rounded">
                    <strong className="text-emerald-800">DISTINCTION</strong>
                    <span className="text-emerald-700">451-600</span>
                  </div>
                  <div className="flex justify-between bg-emerald-100 p-2 rounded">
                    <strong className="text-emerald-800">PASS</strong>
                    <span className="text-emerald-700">200-300</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between bg-emerald-100 p-2 rounded">
                    <strong className="text-emerald-800">CREDIT</strong>
                    <span className="text-emerald-700">301-450</span>
                  </div>
                  <div className="flex justify-between bg-emerald-100 p-2 rounded">
                    <strong className="text-emerald-800">FAIL</strong>
                    <span className="text-emerald-700">0-199</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Comments Section */}
        <div className="grid grid-cols-3 gap-4 mt-8 relative z-10">
          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-5 rounded-xl border border-blue-200 shadow-md">
            <strong className="text-blue-900 text-sm uppercase tracking-wide">Manager Comments & Feedback:</strong>
            <p className="mt-3 text-sm text-gray-700 leading-relaxed">{managerComments}</p>
            <div className="mt-6 text-center">
              <div className="border-t-2 border-blue-300 pt-3">
                <strong className="text-sm text-blue-900 uppercase tracking-wide">Manager LVTC</strong>
                <div className="w-24 h-0.5 bg-blue-600 mx-auto mt-2"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-5 rounded-xl border border-green-200 shadow-md">
            <div className="text-center space-y-4">
              <div>
                <strong className="text-green-900 text-sm uppercase tracking-wide">Closing Day:</strong>
                <div className="border-b-2 border-green-300 mt-2 pb-1 font-semibold text-gray-800">{editableFields.closingDay}</div>
              </div>
              <div>
                <strong className="text-green-900 text-sm uppercase tracking-wide">Opening Day:</strong>
                <div className="border-b-2 border-green-300 mt-2 pb-1 font-semibold text-gray-800">{editableFields.openingDay}</div>
              </div>
              <div>
                <strong className="text-green-900 text-sm uppercase tracking-wide">Fee Balance:</strong>
                <div className="border-b-2 border-green-300 mt-2 pb-1 font-semibold text-gray-800">{editableFields.feeBalance}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-5 rounded-xl border border-purple-200 shadow-md">
            <strong className="text-purple-900 text-sm uppercase tracking-wide">H.O.D Comments & Feedback:</strong>
            <p className="mt-3 text-sm text-gray-700 leading-relaxed">{hodComments}</p>
            <div className="mt-6 text-center">
              <div className="border-t-2 border-purple-300 pt-3">
                <strong className="text-sm text-purple-900 uppercase tracking-wide">Head of Department</strong>
                <div className="w-24 h-0.5 bg-purple-600 mx-auto mt-2"></div>
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
            font-size: 13px !important;
            margin: 0;
            padding: 10mm;
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
            padding: 10mm;
          }
          
          .watermark {
            display: block;
          }
        }
      `}</style>
    </Card>
  );
};

export default TranscriptPreview;
