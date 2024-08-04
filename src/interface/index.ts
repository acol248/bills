interface ITheme {
  [key: string]: any;
}

const theme = {
  color: {
    common: {
      black: "#292829",
      white: "#F9F6EE",
      grey: "#808080",
    },
    grey: {
      100: "#fafafa",
      200: "#f5f5f5",
      300: "#eeeeee",
      400: "#e0e0e0",
      500: "#bdbdbd",
      600: "#9e9e9e",
      700: "#757575",
      800: "#616161",
      900: "#424242",
    },
    primary: {
      light: "#7c9f58",
      main: "#566e3d",
      dark: "#3c4d2b",
      contrast: "#ffffff",
    },
    secondary: {
      light: "#e1a066",
      main: "#bc6c25",
      dark: "#673b14",
      contrast: "#ffffff",
    },
    error: {
      light: "#e44e4e",
      main: "#bb2124",
      dark: "#9b1818",
      contrast: "#ffffff",
    },
    success: {
      light: "#8fd48a",
      main: "#4BB543",
      dark: "#2c6b27",
      contrast: "#ffffff",
    },
  },
};

const elementsLight = {
  core: {
    text: {
      color: theme.color.common.black,
      inverted: theme.color.common.white,
    },
    content: {
      background: {
        100: theme.color.common.white,
        200: `color-mix(in srgb, ${theme.color.common.white}, ${theme.color.secondary.light} 2.5%)`,
        300: `color-mix(in srgb, ${theme.color.common.white}, ${theme.color.secondary.light} 5%)`,
        400: `color-mix(in srgb, ${theme.color.common.white}, ${theme.color.secondary.light} 10%)`,
        500: `color-mix(in srgb, ${theme.color.common.white}, ${theme.color.secondary.light} 25%)`,
      },
    },
  },
};

const elementsDark = {
  core: {
    text: {
      color: theme.color.common.white,
      inverted: theme.color.common.black,
    },
    content: {
      background: {
        100: theme.color.common.black,
        200: `color-mix(in srgb, ${theme.color.grey[700]}, ${theme.color.secondary.light} 2.5%)`,
        300: `color-mix(in srgb, ${theme.color.grey[700]}, ${theme.color.secondary.light} 5%)`,
        400: `color-mix(in srgb, ${theme.color.grey[700]}, ${theme.color.secondary.light} 10%)`,
        500: `color-mix(in srgb, ${theme.color.grey[700]}, ${theme.color.secondary.light} 25%)`,
      },
    },
  },
};

/**
 * Create a modified version of the existing theme
 *
 * @param input modified theme object
 * @param origin optional origin theme object
 * @returns modified theme object
 */
export function modifyTheme(input: ITheme, origin = theme): ITheme {
  const updatedTheme: ITheme = { ...origin };

  for (const key in input) {
    if (input.hasOwnProperty(key)) {
      if (typeof input[key] === "object" && !Array.isArray(input[key])) {
        updatedTheme[key] = modifyTheme(input[key], updatedTheme[key]);
      } else {
        updatedTheme[key] = input[key];
      }
    }
  }

  return updatedTheme;
}

/**
 * Generate css variables from theme object
 *
 * @param theme theme object
 * @returns css variables as css compatible styles string
 */
export function generateCSSVariables(theme: ITheme): string {
  let cssVariables = "";

  function processThemeObject(obj: ITheme, prefix: string = "") {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const variableName = prefix ? `--${prefix}-${key}` : `--${key}`;

        if (typeof value === "object" && !Array.isArray(value)) {
          processThemeObject(value, prefix ? `${prefix}-${key}` : key);
        } else {
          cssVariables += `${variableName}: ${value};\n`;
        }
      }
    }
  }

  processThemeObject(theme);

  return `html {\n${cssVariables}}`;
}

export { theme, elementsLight, elementsDark };
