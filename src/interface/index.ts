interface ITheme {
  [key: string]: any;
}

const theme = {
  color: {
    common: {
      black: "#181818",
      white: "#ffffff",
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
      light: "#85aca2",
      main: "#52796F",
      dark: "#293c37",
    },
    secondary: {
      light: "#587483",
      main: "#2F3E46",
      dark: "#060809",
    },
    error: {
      light: "#ff3333",
      main: "#cc0000",
      dark: "#660000",
    },
    success: {
      light: "#8fd48a",
      main: "#4BB543",
      dark: "#2c6b27",
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
        200: theme.color.grey[100],
        300: theme.color.grey[200],
        400: theme.color.grey[300],
        500: theme.color.grey[400],
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
        200: theme.color.grey[900],
        300: theme.color.grey[800],
        400: theme.color.grey[700],
        500: theme.color.grey[600],
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
