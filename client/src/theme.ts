import { ButtonStylesParams, MantineThemeOverride } from "@mantine/core";

declare module "@mantine/core" {
  export interface MantineThemeOther {
    gradientTakoyaki: string;
    gradientUmeshu: string;
  }
}

const theme: MantineThemeOverride = {
  other: {
    gradientTakoyaki:
      "linear-gradient(267.6deg, #8D70EE 28.69%, #2F84C3 62.88%)",
    gradientUmeshu: "linear-gradient(180deg, #FEB43A 30.95%, #E8590C 100%)",
  },
  primaryShade: 5,
  primaryColor: "yellow",
  fontFamily: "Nunito, sans-serif",
  fontFamilyMonospace: "Monaco, Courier, monospace",
  headings: { fontFamily: "Nunito, sans-serif" },
  colors: {
    dark: [
      "#C1C2C5",
      "#A6A7AB",
      "#909296",
      "#5C5F66",
      "#373A40",
      "#2C2E33",
      "#25262B",
      "#1A1B1E",
      "#141517",
      "#101113",
    ],
    yellow: [
      "#fff8da",
      "#ffe9ad",
      "#ffdb7d",
      "#ffcc4b",
      "#ffbd1a",
      "#e6a400",
      "#b37f00",
      "#805b00",
      "#4e3700",
      "#1e1100",
    ],
    teal: [
      "#E6FCF5",
      "#C3FAE8",
      "#96F2D7",
      "#63E6BE",
      "#38D9A9",
      "#20C997",
      "#12B886",
      "#0CA678",
      "#099268",
      "#087F5B",
    ],
    blue: [
      "#E7F5FF",
      "#D0EBFF",
      "#A5D8FF",
      "#74C0FC",
      "#4DABF7",
      "#339AF0",
      "#228BE6",
      "#1C7ED6",
      "#1971C2",
      "#1864AB",
    ],
    red: [
      "#FFF5F5",
      "#FFE3E3",
      "#FFC9C9",
      "#FFA8A8",
      "#FF8787",
      "#FF6B6B",
      "#FA5252",
      "#F03E3E",
      "#E03131",
      "#C92A2A",
    ],
    orange: [
      "#FFF4E6",
      "#FFE8CC",
      "#FFD8A8",
      "#FFC078",
      "#FFA94D",
      "#FF922B",
      "#FD7E14",
      "#F76707",
      "#E8590C",
      "#D9480F",
    ],
  },
  components: {
    Button: {
      styles: (theme, params: ButtonStylesParams) => ({
        label: {
          color: ["white", "black"].includes(params.color)
            ? theme[params.color as "white" | "black"]
            : params.color,
        },
      }),
    },
    InputWrapper: {
      styles: (theme) => ({
        label: {
          marginBottom: theme.spacing.xs,
        },
      }),
    },
    Tabs: {
      styles: (theme) => ({
        tab: {
          ...theme.fn.focusStyles(),
          padding: "16px 40px",
          marginRight: "8px",
          background: "rgba(255, 255, 255, 0.1)",
          borderColor: "transparent",
          borderRadius: "10px 10px 0 0",
          fontWeight: 700,
          color: "#C1C2C5",

          "&[data-active]": {
            borderTop: `5px solid ${theme.colors.yellow[5]}`,
            color: theme.colors.yellow[5],
          },
          "&[data-active]:before": {
            background: "transparent",
          },
          "&:hover": {
            cursor: "pointer",
          },
        },
        panel: {
          background:
            "radial-gradient(89.99% 235.3% at 72.36% 103.1%, #1F272F 0%, #474B53 100%)",
          borderRadius: "0 0 10px 10px",
        },
      }),
    },
  },
  colorScheme: "dark",
};

export default theme;
