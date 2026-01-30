import { Routes, Route, Navigate } from "react-router-dom";
import EducationLanding from "@/pages/EducationLanding";
import EducationCourses from "@/pages/education/EducationCourses";
import EducationPrograms from "@/pages/education/EducationPrograms";
import EducationAbout from "@/pages/education/EducationAbout";
import EducationEnroll from "@/pages/education/EducationEnroll";
import EducationContact from "@/pages/education/EducationContact";

export default function EducationRouter() {
  return (
    <Routes>
      {/* Education Home */}
      <Route path="/" element={<EducationLanding />} />

      {/* Education Pages */}
      <Route path="/courses" element={<EducationCourses />} />
      <Route path="/programs" element={<EducationPrograms />} />
      <Route path="/about" element={<EducationAbout />} />
      <Route path="/enroll" element={<EducationEnroll />} />
      <Route path="/contact" element={<EducationContact />} />

      {/* Privacy & Terms (can create these later or redirect to foundation) */}
      <Route path="/privacy" element={<Navigate to="/about" replace />} />
      <Route path="/terms" element={<Navigate to="/about" replace />} />

      {/* Catch-all: redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
