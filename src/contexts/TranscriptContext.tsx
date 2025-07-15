import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnalyticsData, TranscriptData, BatchTranscriptData } from '@/types/transcript';

interface TranscriptContextType {
  analyticsData: AnalyticsData | null;
  setAnalyticsData: (data: AnalyticsData | null) => void;
  transcriptData: TranscriptData | null;
  setTranscriptData: (data: TranscriptData | null) => void;
  batchData: BatchTranscriptData | null;
  setBatchData: (data: BatchTranscriptData | null) => void;
  addTranscriptData: (data: TranscriptData) => void;
}

const TranscriptContext = createContext<TranscriptContextType | undefined>(undefined);

export const useTranscript = () => {
  const context = useContext(TranscriptContext);
  if (context === undefined) {
    throw new Error('useTranscript must be used within a TranscriptProvider');
  }
  return context;
};

interface TranscriptProviderProps {
  children: ReactNode;
}

export const TranscriptProvider: React.FC<TranscriptProviderProps> = ({ children }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [transcriptData, setTranscriptData] = useState<TranscriptData | null>(null);
  const [batchData, setBatchData] = useState<BatchTranscriptData | null>(null);

  const addTranscriptData = (data: TranscriptData) => {
    setTranscriptData(data);
    
    // Add to existing analytics or create new analytics
    const studentTotal = data.courseUnits.reduce((sum, unit) => sum + unit.total, 0);
    const grade = studentTotal >= 420 ? "DISTINCTION" : studentTotal >= 301 ? "CREDIT" : studentTotal >= 200 ? "PASS" : "FAIL";
    
    const newStudent = {
      name: data.studentName,
      admissionNo: data.admissionNo,
      course: data.course,
      total: studentTotal,
      grade
    };

    setAnalyticsData(prevData => {
      if (!prevData) {
        // Create new analytics with this single student
        return {
          topStudents: [newStudent],
          courseAnalytics: [{
            courseName: data.course,
            studentCount: 1,
            averageScore: studentTotal,
            topScore: studentTotal,
            passRate: studentTotal >= 200 ? 100 : 0
          }],
          overallStats: {
            totalStudents: 1,
            overallAverage: studentTotal,
            overallPassRate: studentTotal >= 200 ? 100 : 0
          }
        };
      }

      // Update existing analytics
      const updatedTopStudents = [...prevData.topStudents, newStudent]
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);

      const courseExists = prevData.courseAnalytics.find(c => c.courseName === data.course);
      let updatedCourseAnalytics;

      if (courseExists) {
        updatedCourseAnalytics = prevData.courseAnalytics.map(course => {
          if (course.courseName === data.course) {
            const newStudentCount = course.studentCount + 1;
            const newAverageScore = (course.averageScore * course.studentCount + studentTotal) / newStudentCount;
            const newTopScore = Math.max(course.topScore, studentTotal);
            const newPassRate = studentTotal >= 200 ? 
              ((course.passRate * course.studentCount / 100) + 1) / newStudentCount * 100 :
              (course.passRate * course.studentCount / 100) / newStudentCount * 100;

            return {
              ...course,
              studentCount: newStudentCount,
              averageScore: newAverageScore,
              topScore: newTopScore,
              passRate: newPassRate
            };
          }
          return course;
        });
      } else {
        updatedCourseAnalytics = [...prevData.courseAnalytics, {
          courseName: data.course,
          studentCount: 1,
          averageScore: studentTotal,
          topScore: studentTotal,
          passRate: studentTotal >= 200 ? 100 : 0
        }];
      }

      const newTotalStudents = prevData.overallStats.totalStudents + 1;
      const newOverallAverage = (prevData.overallStats.overallAverage * prevData.overallStats.totalStudents + studentTotal) / newTotalStudents;
      const newPassedCount = studentTotal >= 200 ? 
        (prevData.overallStats.overallPassRate * prevData.overallStats.totalStudents / 100) + 1 :
        (prevData.overallStats.overallPassRate * prevData.overallStats.totalStudents / 100);
      const newOverallPassRate = (newPassedCount / newTotalStudents) * 100;

      return {
        topStudents: updatedTopStudents,
        courseAnalytics: updatedCourseAnalytics,
        overallStats: {
          totalStudents: newTotalStudents,
          overallAverage: newOverallAverage,
          overallPassRate: newOverallPassRate
        }
      };
    });
  };

  const value = {
    analyticsData,
    setAnalyticsData,
    transcriptData,
    setTranscriptData,
    batchData,
    setBatchData,
    addTranscriptData
  };

  return (
    <TranscriptContext.Provider value={value}>
      {children}
    </TranscriptContext.Provider>
  );
};