"use client";

import { MantineProvider, createTheme } from "@mantine/core";
import { ToastContainer } from "react-toastify";
import "@mantine/core/styles.css";
import "react-toastify/dist/ReactToastify.css";

const theme = createTheme({
  primaryColor: "cyan",
  black: "#111827",
  white: "#ffffff",
  colors: {},
  components: {
    Text: {
      defaultProps: { c: "#111827" },
    },
    Title: {
      defaultProps: { c: "#111827" },
    },
    TextInput: {
      styles: {
        input: { color: "#111827", backgroundColor: "#ffffff" },
        label: { color: "#374151", fontWeight: 500 },
      },
    },
    PasswordInput: {
      styles: {
        input: { color: "#111827", backgroundColor: "#ffffff" },
        innerInput: { color: "#111827" },
        label: { color: "#374151", fontWeight: 500 },
      },
    },
    Textarea: {
      styles: {
        input: { color: "#111827", backgroundColor: "#ffffff" },
        label: { color: "#374151", fontWeight: 500 },
      },
    },
    Select: {
      styles: {
        input: { color: "#111827", backgroundColor: "#ffffff" },
        label: { color: "#374151", fontWeight: 500 },
      },
    },
    NumberInput: {
      styles: {
        input: { color: "#111827", backgroundColor: "#ffffff" },
        label: { color: "#374151", fontWeight: 500 },
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
