"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signupUserAction,
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
  Anchor,
  Box,
  Stack,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { z } from "zod";
import { Stethoscope, UserPlus, ShieldAlert } from "lucide-react";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const dispatch = useDispatch() as AppDispatch;
  const router = useRouter();
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    const result = signupSchema.safeParse(values);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      form.setErrors({
        name: errors.name?.[0],
        email: errors.email?.[0],
        password: errors.password?.[0],
        confirmPassword: errors.confirmPassword?.[0],
      });
      return;
    }
    const { confirmPassword: _, ...signupData } = values;
    try {
      await dispatch(signupUserAction({ ...signupData, role: "admin" }));
      toast.success("Admin account created! Welcome to ClinicAI!");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <Box
      className="min-h-screen flex items-center justify-center p-4 py-12"
      style={{
        background:
          "radial-gradient(circle at center, #0a0f1e 0%, #050811 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
      <Box className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-cyan-600/10 rounded-full blur-[100px]" />

      <Container size={560} className="relative z-10 w-full px-4">
        <Stack align="center" gap="xs" mb={30}>
          <Box className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-500/20 -rotate-3">
            <Stethoscope size={32} color="white" />
          </Box>
          <Title order={1} size="h2" fw={900} className="text-white tracking-tight">
            ClinicAI
          </Title>
          <Text c="gray.5" size="sm">
            Administrator Setup
          </Text>
        </Stack>

        {/* Info banner */}
        <Alert
          icon={<ShieldAlert size={16} />}
          color="yellow"
          variant="light"
          mb="lg"
          radius="md"
          styles={{ root: { backgroundColor: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)" }, message: { color: "#fde047" }, icon: { color: "#fde047" } }}
        >
          <Text size="sm" style={{ color: "#fde047" }} fw={500}>
            This page is for the initial Admin account only.
          </Text>
          <Text size="xs" style={{ color: "#fde047", opacity: 0.8 }} mt={4}>
            Doctor &amp; Receptionist accounts are created by Admin · Patient accounts are added by Receptionist
          </Text>
        </Alert>

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
          <Title order={2} size="h3" fw={700} mb={25} className="text-white">
            Create Admin Account
          </Title>

          {error && (
            <Text
              c="red.4"
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

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label={<Text c="gray.4" size="sm" fw={500}>Full Name</Text>}
                placeholder="Admin Name"
                required
                size="md"
                styles={{
                  input: {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "white",
                  },
                }}
                {...form.getInputProps("name")}
              />

              <TextInput
                label={<Text c="gray.4" size="sm" fw={500}>Email Address</Text>}
                placeholder="admin@clinic.com"
                required
                size="md"
                styles={{
                  input: {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "white",
                  },
                }}
                {...form.getInputProps("email")}
              />

              <PasswordInput
                label={<Text c="gray.4" size="sm" fw={500}>Password</Text>}
                placeholder="Min. 6 characters"
                required
                size="md"
                styles={{
                  input: {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "white",
                  },
                  innerInput: { color: "white" },
                }}
                {...form.getInputProps("password")}
              />

              <PasswordInput
                label={<Text c="gray.4" size="sm" fw={500}>Confirm Password</Text>}
                placeholder="Repeat password"
                required
                size="md"
                styles={{
                  input: {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "white",
                  },
                  innerInput: { color: "white" },
                }}
                {...form.getInputProps("confirmPassword")}
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                radius="md"
                variant="gradient"
                gradient={{ from: "cyan.5", to: "blue.6" }}
                loading={loading}
                leftSection={<UserPlus size={18} />}
                className="mt-4 shadow-lg shadow-cyan-500/20"
              >
                Create Admin Account
              </Button>
            </Stack>
          </form>

          <Text ta="center" mt="xl" size="sm" c="gray.5">
            Already have an account?{" "}
            <Anchor component={Link} href="/login" fw={700} c="cyan.4">
              Sign In
            </Anchor>
          </Text>
        </Paper>
      </Container>
    </Box>
  );
}
