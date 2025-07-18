
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer, Download, Edit } from "lucide-react";
import { BatchTranscriptData, TranscriptData } from "@/types/transcript";
import { toast } from "sonner";
import { useState } from "react";

interface BatchTranscriptPreviewProps {
  data: BatchTranscriptData;
}

const BatchTranscriptPreview = ({ data }: BatchTranscriptPreviewProps) => {
  const [globalFields, setGlobalFields] = useState({
    closingDay: "",
    openingDay: ""
  });

  const [studentFeeBalances, setStudentFeeBalances] = useState<{[key: string]: string}>({});

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

  const enhanceStudentData = (student: TranscriptData): TranscriptData => {
    const overallTotal = student.courseUnits.reduce((sum, unit) => sum + unit.total, 0);
    const studentKey = `${student.admissionNo}-${student.studentName}`;
    
    return {
      ...student,
      overallTotal,
      overallGrade: calculateOverallGrade(overallTotal),
      overallRemarks: calculateOverallRemarks(overallTotal),
      closingDay: globalFields.closingDay,
      openingDay: globalFields.openingDay,
      feeBalance: studentFeeBalances[studentKey] || student.feeBalance || ""
    };
  };

  const updateStudentFeeBalance = (admissionNo: string, studentName: string, feeBalance: string) => {
    const studentKey = `${admissionNo}-${studentName}`;
    setStudentFeeBalances(prev => ({
      ...prev,
      [studentKey]: feeBalance
    }));
  };

  const handlePrintAll = () => {
    const logoUrl = `${window.location.origin}/lovable-uploads/70730614-901e-4508-b88c-1a721ef8e88b.png`;
    console.log('Logo URL being used:', logoUrl);
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const enhancedStudents = data.students.map(enhanceStudentData);
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Batch Transcripts - ${data.metadata.schoolYear}</title>
          <style>
            body { font-family: 'Georgia', serif; margin: 0; background: white; }
            .transcript-page { 
              width: 210mm; 
              min-height: 297mm; 
              margin: 0 auto; 
              padding: 12mm;
              page-break-after: always;
              font-size: 11px;
              line-height: 1.3;
              background: white;
              position: relative;
            }
            .transcript-page:last-child { page-break-after: avoid; }
            .header { text-align: center; margin-bottom: 20px; }
            .logo { 
              width: 60px; 
              height: 60px; 
              margin: 0 auto 10px; 
              border-radius: 50%; 
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
            .logo img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .contact-info { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 15px; 
              font-size: 10px; 
              color: #1e40af;
              font-weight: 500;
            }
            .contact-item { 
              display: flex; 
              align-items: center; 
              gap: 5px; 
              background: rgba(30, 64, 175, 0.1);
              padding: 6px 12px;
              border-radius: 20px;
              border: 1px solid rgba(30, 64, 175, 0.2);
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 15px 0; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              border-radius: 8px;
              overflow: hidden;
            }
            th, td { 
              border: 1px solid #d1d5db; 
              padding: 6px; 
              text-align: left; 
              font-size: 10px; 
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
              gap: 20px; 
              margin-bottom: 15px; 
              background: #f8fafc;
              padding: 15px;
              border-radius: 12px;
              border: 2px solid #e2e8f0;
            }
            .info-field { margin-bottom: 12px; }
            .info-label { 
              font-weight: bold; 
              color: #1e3a8a; 
              font-size: 10px; 
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }
            .info-value { 
              border-bottom: 2px solid #3b82f6; 
              padding-bottom: 4px; 
              margin-top: 2px; 
              font-size: 12px;
              font-weight: 600;
              color: #1f2937;
            }
            .main-content { display: grid; grid-template-columns: 2fr 1fr; gap: 15px; }
            .grade-scale-table { 
              border-radius: 8px; 
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .grade-scale-table th, .grade-scale-table td { 
              padding: 6px; 
              font-size: 10px; 
            }
            .grade-scale-header {
              background: linear-gradient(135deg, #f59e0b, #eab308);
              color: white;
              padding: 8px;
              text-align: center;
              font-weight: bold;
              font-size: 11px;
              letter-spacing: 0.5px;
            }
            .comments-section { 
              display: grid; 
              grid-template-columns: 1fr 1fr 1fr; 
              gap: 12px; 
              margin-top: 15px; 
            }
            .comment-box { 
              background: linear-gradient(135deg, #f0f9ff, #e0f2fe); 
              padding: 10px; 
              border-radius: 12px; 
              font-size: 10px; 
              border: 1px solid #0ea5e9;
              box-shadow: 0 2px 4px rgba(14, 165, 233, 0.1);
            }
            .signature-line { 
              border-top: 2px solid #3b82f6; 
              margin-top: 15px; 
              padding-top: 8px; 
              text-align: center; 
              font-size: 9px; 
              font-weight: bold;
              color: #1e40af;
            }
            .total-row { 
              background: linear-gradient(135deg, #dcfce7, #bbf7d0); 
              font-weight: bold; 
            }
            .course-unit-cell {
              background: linear-gradient(135deg, #dcfce7, #bbf7d0);
              font-weight: 600;
              color: #166534;
            }
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 80px;
              color: rgba(30, 64, 175, 0.05);
              font-weight: bold;
              z-index: -1;
              pointer-events: none;
            }
            .school-title {
              background: linear-gradient(135deg, #1e40af, #3b82f6);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-weight: bold;
              font-size: 18px;
              margin-bottom: 8px;
            }
            .transcript-badge {
              background: linear-gradient(135deg, #1e40af, #3b82f6);
              color: white;
              padding: 10px 20px;
              border-radius: 12px;
              font-size: 16px;
              font-weight: bold;
              letter-spacing: 1px;
              box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
            }
            @media print { 
              body { margin: 0; } 
              .transcript-page { margin: 0; box-shadow: none; }
              .watermark { display: block; }
            }
          </style>
        </head>
        <body>
          ${enhancedStudents.map(student => `
            <div class="transcript-page">
               <!-- Watermark -->
              <div class="watermark">LVTC</div>
              
              <!-- Header -->
              <div class="header">
                <div class="contact-info">
                  <div class="contact-item">📞 0723456899</div>
                  <div class="contact-item">✉ plodwaryouth@yahoo.com</div>
                </div>
                
                <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 15px;">
                   <div class="logo">
                     <img src="${logoUrl}" alt="LVTC Logo" />
                   </div>
                  <div style="text-align: center;">
                    <h1 class="school-title">LODWAR VOCATIONAL TRAINING CENTRE</h1>
                    <div style="height: 3px; width: 80px; background: linear-gradient(135deg, #1e40af, #3b82f6); margin: 0 auto; border-radius: 2px;"></div>
                  </div>
                </div>
                
                <div class="transcript-badge">
                  OFFICIAL TRANSCRIPT
                </div>
              </div>

              <!-- Student Information -->
              <div class="student-info">
                <div>
                  <div class="info-field">
                    <div class="info-label">Name of Student:</div>
                    <div class="info-value">${student.studentName}</div>
                  </div>
                  <div class="info-field">
                    <div class="info-label">COURSE:</div>
                    <div class="info-value">${student.course}</div>
                  </div>
                </div>
                <div>
                  <div class="info-field">
                    <div class="info-label">ADMISSION NO:</div>
                    <div class="info-value">${student.admissionNo}</div>
                  </div>
                  <div class="info-field">
                    <div class="info-label">School Year:</div>
                    <div class="info-value">${student.schoolYear}</div>
                  </div>
                </div>
              </div>

              <!-- Main Content -->
              <div class="main-content">
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th>COURSE UNIT</th>
                        <th>CAT</th>
                        <th>EXAM</th>
                        <th>TOTAL</th>
                        <th>GRADE</th>
                      </tr>
                    </thead>
                    <tbody>
                       ${student.courseUnits.map((unit, index) => `
                         <tr style="${index % 2 === 0 ? 'background: #f9fafb;' : 'background: white;'}">
                           <td class="course-unit-cell">${unit.name}</td>
                           <td style="text-align: center; font-weight: 500;">${unit.cat}</td>
                           <td style="text-align: center; font-weight: 500;">${unit.exam}</td>
                           <td style="text-align: center; font-weight: bold; color: #1e40af;">${unit.total}</td>
                           <td style="text-align: center; font-weight: bold; color: #1e40af;">${unit.grade}</td>
                         </tr>
                       `).join('')}
                      <tr class="total-row">
                        <td><strong>Total</strong></td>
                        <td></td>
                        <td></td>
                        <td style="text-align: center;"><strong>${student.overallTotal}</strong></td>
                        <td style="text-align: center;"><strong>${student.overallGrade}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <div class="grade-scale-header">
                    GRADING SYSTEM
                  </div>
                  <table class="grade-scale-table">
                    <tbody>
                      <tr style="background: #fef3c7;"><td style="text-align: center; font-weight: bold; color: #92400e;">A</td><td style="text-align: center; color: #92400e;">70-100</td></tr>
                      <tr style="background: white;"><td style="text-align: center; font-weight: bold; color: #92400e;">B</td><td style="text-align: center; color: #92400e;">60-69</td></tr>
                      <tr style="background: #fef3c7;"><td style="text-align: center; font-weight: bold; color: #92400e;">C</td><td style="text-align: center; color: #92400e;">50-59</td></tr>
                      <tr style="background: white;"><td style="text-align: center; font-weight: bold; color: #92400e;">D</td><td style="text-align: center; color: #92400e;">40-49</td></tr>
                      <tr style="background: #fef3c7;"><td style="text-align: center; font-weight: bold; color: #92400e;">E</td><td style="text-align: center; color: #92400e;">0-39</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Remarks and Overall Grade -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0;">
                <div>
                  <div class="info-label">REMARKS</div>
                  <div style="border: 1px solid #666; padding: 8px; min-height: 40px; font-size: 12px;">
                    ${student.overallRemarks}
                  </div>
                </div>
                <div>
                  <div class="info-label">GRADE SCALE</div>
                  <div style="font-size: 9px; margin-top: 5px;">
                    <div style="background: #1e3a8a; color: white; padding: 4px; text-align: center; font-weight: bold; margin-bottom: 5px;">GRADE SCALE</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                      <div>
                        <div style="display: flex; justify-content: space-between;"><strong>DISTINCTION</strong><span>451-600</span></div>
                        <div style="display: flex; justify-content: space-between;"><strong>PASS</strong><span>200-300</span></div>
                      </div>
                      <div>
                        <div style="display: flex; justify-content: space-between;"><strong>CREDIT</strong><span>301-450</span></div>
                        <div style="display: flex; justify-content: space-between;"><strong>FAIL</strong><span>0-199</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Comments Section -->
              <div class="comments-section">
                <div class="comment-box">
                  <div class="info-label">MANAGER COMMENTS AND FEEDBACK:</div>
                  <p style="margin: 8px 0; font-size: 14px;">Student has demonstrated strong performance across ${student.courseUnits.length} course units with a total score of ${student.overallTotal}. ${student.overallRemarks}</p>
                  <div class="signature-line">MANAGER LVTC</div>
                </div>
                
                <div class="comment-box">
                  <div style="text-align: center; font-size: 9px;">
                    <div style="margin-bottom: 8px;">
                      <div class="info-label">Closing Day:</div>
                      <div style="border-bottom: 1px solid #666; padding-bottom: 2px;">${student.closingDay || ''}</div>
                    </div>
                    <div style="margin-bottom: 8px;">
                      <div class="info-label">Opening Day:</div>
                      <div style="border-bottom: 1px solid #666; padding-bottom: 2px;">${student.openingDay || ''}</div>
                    </div>
                    <div>
                      <div class="info-label">Fee Balance:</div>
                      <div style="border-bottom: 1px solid #666; padding-bottom: 2px;">${student.feeBalance || ''}</div>
                    </div>
                  </div>
                </div>
                
                <div class="comment-box">
                  <div class="info-label">H.O.D COMMENTS AND FEEDBACK:</div>
                  <p style="margin: 8px 0; font-size: 14px;">Academic performance reflects ${student.overallGrade.toLowerCase()} level competency. Student shows consistent progress across practical and theoretical components.</p>
                  <div class="signature-line">H.O.D</div>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc; color: #666; font-size: 12px;">
                @LVTC 2025
              </div>
            </div>
          `).join('')}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    toast.success(`Printing ${data.students.length} transcripts`);
  };

  const handleDownloadAll = () => {
    handlePrintAll();
    toast.success(`Download initiated for ${data.students.length} transcripts`);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-blue-900">Batch Transcript Preview</h2>
            <p className="text-gray-600">{data.students.length} students ready for printing</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePrintAll} variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print All
            </Button>
            <Button onClick={handleDownloadAll} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>

        {/* Global Fields */}
        <Card className="p-4 bg-blue-50">
          <h3 className="font-medium text-blue-900 mb-3">Global Settings (applies to all transcripts)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="closingDay">Closing Day</Label>
              <Input
                id="closingDay"
                value={globalFields.closingDay}
                onChange={(e) => setGlobalFields({...globalFields, closingDay: e.target.value})}
                placeholder="e.g., 15th December 2024"
              />
            </div>
            <div>
              <Label htmlFor="openingDay">Opening Day</Label>
              <Input
                id="openingDay"
                value={globalFields.openingDay}
                onChange={(e) => setGlobalFields({...globalFields, openingDay: e.target.value})}
                placeholder="e.g., 8th January 2025"
              />
            </div>
          </div>
        </Card>

        {/* Individual Student Fee Balances */}
        <Card className="p-4 bg-green-50">
          <h3 className="font-medium text-green-900 mb-3 flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Individual Fee Balances
          </h3>
          <div className="max-h-80 overflow-y-auto">
            <div className="grid gap-3">
              {data.students.map((student, index) => {
                const studentKey = `${student.admissionNo}-${student.studentName}`;
                const enhancedStudent = enhanceStudentData(student);
                return (
                  <div key={index} className="grid grid-cols-4 gap-3 items-center p-3 bg-white rounded border">
                    <div className="text-sm font-medium">{student.studentName}</div>
                    <div className="text-sm text-gray-600">{student.admissionNo}</div>
                    <div className="text-sm text-gray-600">{student.course}</div>
                    <div>
                      <Input
                        value={studentFeeBalances[studentKey] || student.feeBalance || ""}
                        onChange={(e) => updateStudentFeeBalance(student.admissionNo, student.studentName, e.target.value)}
                        placeholder="e.g., KSH 0"
                        className="text-sm"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Student List Preview */}
        <div>
          <h3 className="font-medium text-blue-900 mb-3">Students Summary:</h3>
          <div className="max-h-60 overflow-y-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="border border-gray-300 p-2 text-left">Name</th>
                  <th className="border border-gray-300 p-2 text-left">Admission No</th>
                  <th className="border border-gray-300 p-2 text-left">Course</th>
                  <th className="border border-gray-300 p-2 text-center">Total Score</th>
                  <th className="border border-gray-300 p-2 text-center">Grade</th>
                  <th className="border border-gray-300 p-2 text-center">Fee Balance</th>
                </tr>
              </thead>
              <tbody>
                {data.students.map((student, index) => {
                  const enhancedStudent = enhanceStudentData(student);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">{student.studentName}</td>
                      <td className="border border-gray-300 p-2">{student.admissionNo}</td>
                      <td className="border border-gray-300 p-2">{student.course}</td>
                      <td className="border border-gray-300 p-2 text-center font-bold">{enhancedStudent.overallTotal}</td>
                      <td className="border border-gray-300 p-2 text-center font-bold">{enhancedStudent.overallGrade}</td>
                      <td className="border border-gray-300 p-2 text-center text-sm">{enhancedStudent.feeBalance || 'Not set'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BatchTranscriptPreview;
