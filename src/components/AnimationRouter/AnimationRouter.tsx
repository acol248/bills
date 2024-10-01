import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// parts
import Settings from "../../parts/Settings";
import Authentication from "../../parts/Authentication";
import UpComing from "../../parts/UpComing";
import ManagePin from "../../parts/ManagePin";
import RemovePin from "../../parts/RemovePin";

export default function AnimationRouter() {
  const location = useLocation();

  return (
    <AnimatePresence initial={false} mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index element={<Authentication />} />
        <Route path="up-coming" element={<UpComing />} />
        <Route path="settings" element={<Settings />} />
        <Route path="settings/manage-pin" element={<ManagePin />} />
        <Route path="settings/remove-pin" element={<RemovePin />} />
      </Routes>
    </AnimatePresence>
  );
}
