
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
  closingDay?: string;
  openingDay?: string;
  feeBalance?: string;
  overallTotal?: number;
  overallGrade?: string;
  overallRemarks?: string;
}

export interface BatchTranscriptData {
  students: TranscriptData[];
  metadata: {
    schoolYear: string;
    uploadDate: string;
    totalStudents: number;
  };
}

export interface AnalyticsData {
  topStudents: Array<{
    name: string;
    admissionNo: string;
    course: string;
    total: number;
    grade: string;
  }>;
  courseAnalytics: Array<{
    courseName: string;
    studentCount: number;
    averageScore: number;
    topScore: number;
    passRate: number;
  }>;
  overallStats: {
    totalStudents: number;
    overallAverage: number;
    overallPassRate: number;
  };
}

export interface GradeScale {
  grade: string;
  range: string;
}
