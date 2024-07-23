import { RouterProvider, createBrowserRouter } from "react-router-dom";

// hooks
import useData, { DataContext } from "./hooks/useData";
import useSettings, { SettingsContext } from "./hooks/useSettings";

// components
import BaseNavigation from "./components/BaseNavigation";

// parts
import UpComing from "./parts/UpComing";

// styles
import "./App.module.scss";
import Settings from "./parts/Settings";
import {
  generateCSSVariables,
  elementsDark,
  elementsLight,
  theme,
} from "./interface";
import AddItem from "./parts/AddItem";

export default function App() {
  const data = useData();
  const settings = useSettings();

  const router = createBrowserRouter([
    { path: "/", element: <UpComing /> },
    { path: "/settings", element: <Settings /> },
  ]);

  const themeStyles = generateCSSVariables(theme);
  const elementsTheme = generateCSSVariables(
    settings.theme === "light" ? elementsLight : elementsDark
  );

  return (
    <SettingsContext.Provider value={settings}>
      <DataContext.Provider value={data}>
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <style dangerouslySetInnerHTML={{ __html: elementsTheme }} />

        <RouterProvider router={router} />

        <AddItem />

        <BaseNavigation />
      </DataContext.Provider>
    </SettingsContext.Provider>
  );
}
