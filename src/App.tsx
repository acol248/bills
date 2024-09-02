import { BrowserRouter, Route, Routes } from "react-router-dom";

// hooks
import useData, { DataContext } from "./hooks/useData";
import useSettings, { SettingsContext } from "./hooks/useSettings";

// components
import BaseNavigation from "./components/BaseNavigation";

// parts
import UpComing from "./parts/UpComing";
import AddItem from "./parts/AddItem";
import Settings from "./parts/Settings";
import Authentication from "./parts/Authentication";
import WhatsNew from "./parts/WhatsNew";
import ManagePin from "./parts/ManagePin";
import RemovePin from "./parts/RemovePin";

// helpers
import { generateCSSVariables, elementsDark, elementsLight, theme } from "./interface";

// styles
import "./App.module.scss";

export default function App() {
  const data = useData();
  const settings = useSettings();

  const themeStyles = generateCSSVariables(theme);
  const elementsTheme = generateCSSVariables(settings.theme === "light" ? elementsLight : elementsDark);

  return (
    <SettingsContext.Provider value={settings}>
      <DataContext.Provider value={data}>
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <style dangerouslySetInnerHTML={{ __html: elementsTheme }} />

        <BrowserRouter basename={import.meta.env.VITE_BASENAME}>
          <Routes>
            <Route index element={<Authentication />} />
            <Route path="up-coming" element={<UpComing />} />
            <Route path="settings" element={<Settings />} />
            <Route path="settings/manage-pin" element={<ManagePin />} />
            <Route path="settings/remove-pin" element={<RemovePin />} />
          </Routes>

          <AddItem />

          <WhatsNew />
          <BaseNavigation />
        </BrowserRouter>
      </DataContext.Provider>
    </SettingsContext.Provider>
  );
}
