"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUserAction,
  googleSignInAction,
  sendPasswordResetAction,
} from "@/redux/actions/auth-action/auth-action";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppDispatch, RootState } from "@/redux/store";
import { toast } from "react-toastify";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Anchor,
  Divider,
  Box,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { z } from "zod";
import { Stethoscope, LogIn, Mail, ChevronLeft } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [showForgot, setShowForgot] = React.useState(false);
  const [resetSent, setResetSent] = React.useState(false);
  const dispatch = useDispatch() as AppDispatch;
  const router = useRouter();
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  const forgotForm = useForm({
    initialValues: {
      email: "",
    },
  });

  const handleLogin = async (values: typeof form.values) => {
    const result = loginSchema.safeParse(values);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      form.setErrors({
        email: errors.email?.[0],
        password: errors.password?.[0],
      });
      return;
    }
    try {
      await dispatch(loginUserAction(values));
      toast.success("Welcome back! Redirecting...");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Login failed. Check your credentials.");
    }
  };

  const handleGoogle = async () => {
    try {
      await dispatch(googleSignInAction());
      toast.success("Signed in with Google!");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  const handleForgot = async (values: typeof forgotForm.values) => {
    try {
      await dispatch(sendPasswordResetAction(values.email));
      toast.success("Password reset email sent! Check your inbox.");
      setResetSent(true);
    } catch (err) {
      toast.error("Failed to send reset email. Please try again.");
    }
  };

  return (
    <Box
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(circle at center, #0a0f1e 0%, #050811 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <Box className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
      <Box className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]" />

      <Container size={600} className="relative z-10 w-full px-4">
        <Stack align="center" gap="xs" mb={30}>
          <Box className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-500/20 rotate-3">
            <Stethoscope size={32} color="white" />
          </Box>
          <Title
            order={1}
            size="h2"
            fw={900}
            className="text-white tracking-tight"
          >
            ClinicAI
          </Title>
          <Text color="gray.5" size="sm">
            Intelligent Clinic Management
          </Text>
        </Stack>

        <Paper
          radius="lg"
          p={35}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          {!showForgot ? (
            <>
              <Title
                order={2}
                size="h3"
                fw={700}
                mb={25}
                className="text-white"
              >
                Sign In
              </Title>

              {error && (
                <Text
                  color="red.4"
                  size="sm"
                  mb={20}
                  p="md"
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    borderRadius: "8px",
                  }}
                >
                  {error}
                </Text>
              )}

              <form onSubmit={form.onSubmit(handleLogin)}>
                <Stack gap="md">
                  <TextInput
                    label={
                      <Text color="gray.4" size="sm" fw={500}>
                        Email Address
                      </Text>
                    }
                    placeholder="doctor@clinic.com"
                    required
                    size="md"
                    styles={{
                      input: {
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "white",
                        "&:focus": { borderColor: "#06b6d4" },
                      },
                    }}
                    {...form.getInputProps("email")}
                  />

                  <Stack gap={5}>
                    <PasswordInput
                      label={
                        <Text color="gray.4" size="sm" fw={500}>
                          Password
                        </Text>
                      }
                      placeholder="Enter your password"
                      required
                      size="md"
                      styles={{
                        input: {
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          color: "white",
                          "&:focus": { borderColor: "#06b6d4" },
                        },
                        innerInput: { color: "white" },
                      }}
                      {...form.getInputProps("password")}
                    />
                    <Group justify="flex-end">
                      <Anchor
                        component="button"
                        type="button"
                        size="xs"
                        fw={600}
                        color="cyan.4"
                        onClick={() => setShowForgot(true)}
                      >
                        Forgot password?
                      </Anchor>
                    </Group>
                  </Stack>

                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    radius="md"
                    variant="gradient"
                    gradient={{ from: "cyan.5", to: "blue.6" }}
                    loading={loading}
                    leftSection={<LogIn size={18} />}
                    className="mt-4 shadow-lg shadow-cyan-500/20"
                  >
                    Enter System
                  </Button>
                </Stack>
              </form>

              <Divider
                label="OR"
                labelPosition="center"
                my="xl"
                styles={{
                  label: { color: "rgba(255, 255, 255, 0.3)" },
                }}
              />

              <Button
                variant="outline"
                color="gray.4"
                fullWidth
                size="md"
                radius="md"
                onClick={handleGoogle}
                disabled={loading}
                styles={{
                  root: {
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.05)" },
                  },
                }}
                leftSection={
                  <Box className="w-5 h-5 flex items-center">
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </Box>
                }
              >
                Continue with Google
              </Button>

              <Text ta="center" mt="xl" size="sm" color="gray.5">
                New to ClinicAI?{" "}
                <Anchor component={Link} href="/signup" fw={700} color="cyan.4">
                  Register Account
                </Anchor>
              </Text>
            </>
          ) : (
            <Stack>
              <Anchor
                component="button"
                size="sm"
                color="gray.5"
                onClick={() => {
                  setShowForgot(false);
                  setResetSent(false);
                }}
                className="flex items-center gap-1 self-start hover:text-white transition"
              >
                <ChevronLeft size={16} /> <div>Back to Sign in</div>
              </Anchor>
              <Title
                order={2}
                size="h3"
                fw={700}
                mt="lg"
                className="text-white"
              >
                Reset Password
              </Title>
              <Text size="sm" color="gray.5">
                Enter your email and we'll send a recovery link.
              </Text>

              {resetSent ? (
                <Text
                  ta="center"
                  py="xl"
                  size="sm"
                  style={{
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    border: "1px solid rgba(34, 197, 94, 0.2)",
                    borderRadius: "8px",
                    color: "#4ade80",
                  }}
                >
                  ✅ Recovery email sent! Check your inbox.
                </Text>
              ) : (
                <form onSubmit={forgotForm.onSubmit(handleForgot)}>
                  <Stack gap="md">
                    <TextInput
                      label={
                        <Text color="gray.4" size="sm" fw={500}>
                          Email Address
                        </Text>
                      }
                      placeholder="your@email.com"
                      required
                      size="md"
                      styles={{
                        input: {
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          color: "white",
                          "&:focus": { borderColor: "#06b6d4" },
                        },
                      }}
                      {...forgotForm.getInputProps("email")}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      size="lg"
                      radius="md"
                      color="cyan"
                      loading={loading}
                      leftSection={<Mail size={18} />}
                      className="mt-4"
                    >
                      Send Reset Link
                    </Button>
                  </Stack>
                </form>
              )}
            </Stack>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
