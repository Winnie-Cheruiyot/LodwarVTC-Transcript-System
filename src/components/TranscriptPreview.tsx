
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Print, Download } from "lucide-react";
import { TranscriptData } from "@/types/transcript";
import { toast } from "sonner";

interface TranscriptPreviewProps {
  data: TranscriptData;
}

const TranscriptPreview = ({ data }: TranscriptPreviewProps) => {
  const gradeScale = [
    { grade: "A", range: "70-100" },
    { grade: "B", range: "60-69" },
    { grade: "C", range: "50-59" },
    { grade: "D", range: "40-49" },
    { grade: "E", range: "0-39" },
  ];

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
      managerComments: `Student has demonstrated ${performance} performance across ${totalUnits} course units. Passed ${passedUnits} out of ${totalUnits} units with an average score of ${averageScore.toFixed(1)}%. Recommended for progression to the next level.`,
      hodComments: `Academic performance reflects ${performance} understanding of core competencies. Student shows ${averageScore >= 60 ? 'strong' : averageScore >= 40 ? 'adequate' : 'limited'} grasp of practical and theoretical aspects. Continue monitoring progress.`
    };
  };

  const { managerComments, hodComments } = generateAutomaticComments();

  const handlePrint = () => {
    window.print();
    toast.success("Print dialog opened");
  };

  const handleDownload = () => {
    // Create a new window with the transcript content for PDF generation
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Transcript - ${data.studentName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .transcript { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { width: 80px; height: 80px; margin: 0 auto 10px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #333; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .grade-scale { display: inline-block; margin: 20px; }
            .comments { margin: 20px 0; }
            .signature-section { display: flex; justify-content: space-between; margin-top: 40px; }
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
            <Print className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div id="transcript-content" className="bg-white p-8 rounded-lg border transcript-content">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">📞</span>
              </div>
              <span className="text-sm">0723456899</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✉</span>
              </div>
              <span className="text-sm">plodwaryouth@yahoo.com</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-900 font-bold text-xs">LVTC</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-900 mb-1">
                LODWAR VOCATIONAL TRAINING CENTRE
              </h1>
            </div>
          </div>
          
          <div className="bg-blue-900 text-white py-3 px-6 rounded">
            <h2 className="text-xl font-bold">TRANSCRIPT</h2>
          </div>
        </div>

        {/* Student Information */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <div className="mb-4">
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
            <div className="mb-4">
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
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2">
            <table className="w-full border-collapse border border-gray-400">
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
                <tr className="bg-green-200">
                  <td className="border border-gray-400 p-2 font-bold">Total</td>
                  <td className="border border-gray-400 p-2"></td>
                  <td className="border border-gray-400 p-2"></td>
                  <td className="border border-gray-400 p-2"></td>
                  <td className="border border-gray-400 p-2"></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div>
            <div className="bg-blue-900 text-white p-2 text-center font-bold mb-2">
              GRADING SYSTEM
            </div>
            <table className="w-full border-collapse border border-gray-400">
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
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <strong className="text-blue-900">REMARKS</strong>
            <div className="border border-gray-300 p-2 mt-1 min-h-[60px]">
              {data.remarks || ""}
            </div>
          </div>
          <div>
            <strong className="text-blue-900">GRADE SCALE</strong>
            <div className="mt-1">
              <div className="bg-blue-900 text-white p-2 text-center font-bold mb-2">
                GRADE SCALE
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
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
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-green-100 p-4 rounded">
            <strong className="text-blue-900 text-sm">MANAGER COMMENTS AND FEEDBACK:</strong>
            <p className="text-xs mt-2">{managerComments}</p>
            <div className="mt-8 text-center">
              <div className="border-t border-gray-400 pt-2">
                <strong className="text-xs">MANAGER LVTC</strong>
              </div>
            </div>
          </div>
          
          <div className="bg-green-100 p-4 rounded">
            <div className="text-center space-y-4">
              <div>
                <strong className="text-blue-900 text-sm">Closing Day:</strong>
                <div className="border-b border-gray-300 mt-1"></div>
              </div>
              <div>
                <strong className="text-blue-900 text-sm">Opening Day:</strong>
                <div className="border-b border-gray-300 mt-1"></div>
              </div>
              <div>
                <strong className="text-blue-900 text-sm">Fee Balance:</strong>
                <div className="border-b border-gray-300 mt-1"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-100 p-4 rounded">
            <strong className="text-blue-900 text-sm">H.O.D COMMENTS AND FEEDBACK:</strong>
            <p className="text-xs mt-2">{hodComments}</p>
            <div className="mt-8 text-center">
              <div className="border-t border-gray-400 pt-2">
                <strong className="text-xs">H.O.D ELECTRICAL</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .transcript-content {
            box-shadow: none !important;
            border: none !important;
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
          }
        }
      `}</style>
    </Card>
  );
};

export default TranscriptPreview;
