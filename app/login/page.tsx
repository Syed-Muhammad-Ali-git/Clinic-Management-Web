"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUserAction,
  googleSignInAction,
  sendPasswordResetAction,
} from "@/redux/actions/auth-action/auth-action";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AppDispatch, RootState } from "@/redux/store";
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
import { Stethoscope, LogIn, Mail } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [showForgot, setShowForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const dispatch: AppDispatch = useDispatch();
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
    await dispatch(loginUserAction(values) as any);
    router.push("/dashboard");
  };

  const handleGoogle = async () => {
    await dispatch(googleSignInAction() as any);
    router.push("/dashboard");
  };

  const handleForgot = async (values: typeof forgotForm.values) => {
    await dispatch(sendPasswordResetAction(values.email) as any);
    setResetSent(true);
  };

  return (
    <Box className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Container size={420} my={40}>
        <Stack align="center" gap="xs" mb={30}>
          <Box className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Stethoscope size={32} color="white" />
          </Box>
          <Title
            order={1}
            size="h2"
            fw={900}
            className="tracking-tight text-gray-900"
          >
            ClinicAI
          </Title>
          <Text color="dimmed" size="sm">
            Medical Management System
          </Text>
        </Stack>

        <Paper
          withBorder
          shadow="0 4px 24px rgba(6, 182, 212, 0.08)"
          p={30}
          radius="md"
        >
          {!showForgot ? (
            <>
              <Title
                order={2}
                size="h3"
                fw={700}
                mb={20}
                className="text-gray-800"
              >
                Welcome back
              </Title>

              {error && (
                <Text
                  color="red"
                  size="sm"
                  mb={15}
                  p="xs"
                  className="bg-red-50 border border-red-100 rounded"
                >
                  {error}
                </Text>
              )}

              <form onSubmit={form.onSubmit(handleLogin)}>
                <Stack gap="md">
                  <TextInput
                    label="Email address"
                    placeholder="doctor@clinic.com"
                    required
                    size="md"
                    radius="md"
                    {...form.getInputProps("email")}
                  />

                  <Stack gap={5}>
                    <PasswordInput
                      label="Password"
                      placeholder="Enter your password"
                      required
                      size="md"
                      radius="md"
                      {...form.getInputProps("password")}
                    />
                    <Group justify="flex-end">
                      <Anchor
                        component="button"
                        type="button"
                        size="xs"
                        fw={600}
                        color="cyan"
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
                    gradient={{ from: "cyan.6", to: "blue.7" }}
                    loading={loading}
                    leftSection={<LogIn size={18} />}
                  >
                    Sign in
                  </Button>
                </Stack>
              </form>

              <Divider label="OR" labelPosition="center" my="lg" />

              <Button
                variant="default"
                fullWidth
                size="md"
                radius="md"
                onClick={handleGoogle}
                disabled={loading}
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

              <Text ta="center" mt="xl" size="sm">
                Don&apos;t have an account?{" "}
                <Anchor component={Link} href="/signup" fw={700} color="cyan">
                  Create account
                </Anchor>
              </Text>
            </>
          ) : (
            <Stack>
              <Anchor
                component="button"
                size="sm"
                color="gray"
                onClick={() => {
                  setShowForgot(false);
                  setResetSent(false);
                }}
                className="flex items-center gap-1 self-start"
              >
                ← Back to login
              </Anchor>
              <Title order={2} size="h3" fw={700} className="text-gray-800">
                Reset password
              </Title>
              <Text size="sm" color="dimmed">
                Enter your email and we&apos;ll send a reset link.
              </Text>

              {resetSent ? (
                <Text
                  ta="center"
                  py="lg"
                  size="sm"
                  className="bg-green-50 text-green-700 border border-green-100 rounded-md"
                >
                  ✅ Reset link sent! Check your inbox.
                </Text>
              ) : (
                <form onSubmit={forgotForm.onSubmit(handleForgot)}>
                  <Stack gap="md">
                    <TextInput
                      label="Email address"
                      placeholder="your@email.com"
                      required
                      size="md"
                      radius="md"
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
                    >
                      Send reset link
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
