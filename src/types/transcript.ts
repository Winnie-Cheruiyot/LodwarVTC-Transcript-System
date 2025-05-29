
export interface CourseUnit {
  name: string;
  cat: number;
  exam: number;
  total: number;
  grade: string;
}

export interface TranscriptData {
  studentName: string;
  admissionNo: string;
  course: string;
  schoolYear: string;
  courseUnits: CourseUnit[];
  remarks?: string;
}

export interface GradeScale {
  grade: string;
  range: string;
}
