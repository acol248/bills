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

// styles
import "./App.module.scss";
import { generateCSSVariables, elementsDark, elementsLight, theme } from "./interface";

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
            <Route index element={<UpComing />} />
            <Route path="settings" element={<Settings />} />
          </Routes>

          <AddItem />

          <BaseNavigation />
        </BrowserRouter>
      </DataContext.Provider>
    </SettingsContext.Provider>
  );
}
