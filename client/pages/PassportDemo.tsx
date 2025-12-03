import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DemoLanding from "@/components/passport/DemoLanding";
import PassportRouter from "@/components/passport/PassportRouter";

export default function PassportDemo() {
  const [selectedMode, setSelectedMode] = useState<"creator" | "project" | null>(null);
  const navigate = useNavigate();

  const handleSelectMode = (mode: "creator" | "project") => {
    setSelectedMode(mode);
  };

  if (selectedMode) {
    return <PassportRouter previewMode={selectedMode} />;
  }

  return <DemoLanding onSelectMode={handleSelectMode} />;
}
