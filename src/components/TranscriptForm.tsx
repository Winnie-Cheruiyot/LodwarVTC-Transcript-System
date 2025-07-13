import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { TranscriptData, CourseUnit } from "@/types/transcript";
import { toast } from "sonner";

interface TranscriptFormProps {
  onSubmit: (data: TranscriptData) => void;
}

const TranscriptForm = ({ onSubmit }: TranscriptFormProps) => {
  const [formData, setFormData] = useState({
    studentName: "",
    admissionNo: "",
    course: "",
    schoolYear: "",
  });

  const [courseUnits, setCourseUnits] = useState<CourseUnit[]>([
    { name: "TRADE THEORY", cat: 0, exam: 0, total: 0, grade: "" },
    { name: "TRADE PRACTICE", cat: 0, exam: 0, total: 0, grade: "" },
    { name: "COMMUNICATION SKILLS", cat: 0, exam: 0, total: 0, grade: "" },
    { name: "ENTREPRENEURSHIP", cat: 0, exam: 0, total: 0, grade: "" },
    { name: "MATHEMATICS", cat: 0, exam: 0, total: 0, grade: "" },
    { name: "GENERAL SCIENCE", cat: 0, exam: 0, total: 0, grade: "" },
    { name: "DIGITAL LITERACY", cat: 0, exam: 0, total: 0, grade: "" },
    { name: "LIFE SKILLS", cat: 0, exam: 0, total: 0, grade: "" },
  ]);

  const calculateGrade = (total: number): string => {
    if (total >= 70) return "A";
    if (total >= 60) return "B";
    if (total >= 50) return "C";
    if (total >= 40) return "D";
    return "E";
  };

  const updateCourseUnit = (index: number, field: keyof CourseUnit, value: string | number) => {
    const updated = [...courseUnits];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === "cat" || field === "exam") {
      const total = Number(updated[index].cat) + Number(updated[index].exam);
      updated[index].total = total;
      updated[index].grade = calculateGrade(total);
    }
    
    setCourseUnits(updated);
  };

  const addCourseUnit = () => {
    setCourseUnits([...courseUnits, { name: "", cat: 0, exam: 0, total: 0, grade: "" }]);
  };

  const removeCourseUnit = (index: number) => {
    setCourseUnits(courseUnits.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentName || !formData.admissionNo || !formData.course) {
      toast.error("Please fill in all required student information");
      return;
    }

    const transcriptData: TranscriptData = {
      ...formData,
      courseUnits: courseUnits.filter(unit => unit.name.trim() !== ""),
    };

    onSubmit(transcriptData);
    toast.success("Transcript generated successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="studentName">Student Name *</Label>
          <Input
            id="studentName"
            value={formData.studentName}
            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
            placeholder="Enter student name"
            required
          />
        </div>
        <div>
          <Label htmlFor="admissionNo">Admission No *</Label>
          <Input
            id="admissionNo"
            value={formData.admissionNo}
            onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
            placeholder="Enter admission number"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="course">Course *</Label>
          <Input
            id="course"
            value={formData.course}
            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
            placeholder="Enter course name"
            required
          />
        </div>
        <div>
          <Label htmlFor="schoolYear">School Year</Label>
          <Input
            id="schoolYear"
            value={formData.schoolYear}
            onChange={(e) => setFormData({ ...formData, schoolYear: e.target.value })}
            placeholder="e.g., 2023/2024"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-lg font-semibold">Course Units</Label>
          <Button type="button" onClick={addCourseUnit} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Unit
          </Button>
        </div>

        <div className="space-y-3">
          {courseUnits.map((unit, index) => (
            <Card key={index} className="p-4">
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Input
                    placeholder="Course unit name"
                    value={unit.name}
                    onChange={(e) => updateCourseUnit(index, "name", e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="CAT"
                    min="0"
                    max="100"
                    value={unit.cat || ""}
                    onChange={(e) => updateCourseUnit(index, "cat", Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Exam"
                    min="0"
                    max="100"
                    value={unit.exam || ""}
                    onChange={(e) => updateCourseUnit(index, "exam", Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    placeholder="Total"
                    value={unit.total || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    placeholder="Grade"
                    value={unit.grade}
                    disabled
                    className="bg-gray-50 text-center font-bold"
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeCourseUnit(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800">
        Generate Transcript
      </Button>
    </form>
  );
};

export default TranscriptForm;
