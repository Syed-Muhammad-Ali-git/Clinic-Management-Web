"use client";

import { MantineProvider, createTheme } from "@mantine/core";
import { ToastContainer } from "react-toastify";
import "@mantine/core/styles.css";
import "react-toastify/dist/ReactToastify.css";

const theme = createTheme({
  primaryColor: "cyan",
  colors: {
    // Custom medical blue-teal palette can be added here
  },
  components: {
    TextInput: {
      styles: {
        input: { color: "#1e293b", backgroundColor: "#ffffff" },
      },
    },
    Textarea: {
      styles: {
        input: { color: "#1e293b", backgroundColor: "#ffffff" },
      },
    },
    Select: {
      styles: {
        input: { color: "#1e293b", backgroundColor: "#ffffff" },
      },
    },
    NumberInput: {
      styles: {
        input: { color: "#1e293b", backgroundColor: "#ffffff" },
      },
    },
  },
});

import { ReduxProvider } from "@/redux/Provider";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <MantineProvider theme={theme}>
        <ToastContainer position="top-right" autoClose={3000} />
        {children}
      </MantineProvider>
    </ReduxProvider>
  );
}
