import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1E3A8A", // Deep Royal Navy Blue
      light: "#2563EB",
      dark: "#0F172A",
      contrastText: "#FFFFFF"
    },
    secondary: {
      main: "#0284C7", // Steel Blue
      light: "#38BDF8",
      dark: "#0369A1",
      contrastText: "#FFFFFF"
    },
    background: {
      default: "#F8FAFC", // Professional Slate Background
      paper: "#FFFFFF"
    },
    success: {
      main: "#10B981"
    },
    warning: {
      main: "#D97706"
    },
    info: {
      main: "#0284C7"
    },
    text: {
      primary: "#0F172A",
      secondary: "#64748B"
    }
  },
  typography: {
    fontFamily: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"].join(","),
    h3: {
      fontWeight: 800,
      letterSpacing: "-1px"
    },
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.5px"
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.3px"
    },
    h6: {
      fontWeight: 700
    },
    subtitle1: {
      fontWeight: 600
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.2px"
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: "8px 18px",
          boxShadow: "none",
          transition: "all 0.15s ease-in-out",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(37, 99, 235, 0.2)"
          }
        },
        containedPrimary: {
          background: "#1E3A8A",
          "&:hover": {
            background: "#1D4ED8"
          }
        },
        containedSecondary: {
          background: "#0F172A",
          "&:hover": {
            background: "#1E293B"
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0 1px 3px rgba(15, 23, 42, 0.05)",
          border: "1px solid #E2E8F0",
          transition: "all 0.15s ease-in-out",
          "&:hover": {
            borderColor: "#CBD5E1",
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)"
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 8
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          borderRadius: 6
        }
      }
    }
  }
});
