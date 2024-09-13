import { BrowserRouter } from "react-router-dom";

// hooks
import useData, { DataContext } from "./hooks/useData";
import useSettings, { SettingsContext } from "./hooks/useSettings";

// components
import AnimationRouter from "./components/AnimationRouter";
import BaseNavigation from "./components/BaseNavigation";

// parts
import WhatsNew from "./parts/WhatsNew";
import AddItem from "./parts/AddItem";

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
          <AnimationRouter />

          <AddItem />

          <WhatsNew />
          <BaseNavigation />
        </BrowserRouter>
      </DataContext.Provider>
    </SettingsContext.Provider>
  );
}
