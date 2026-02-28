"use client";

import React from "react";
import Link from "next/link";
import {
  Title,
  Text,
  Button,
  Container,
  Stack,
  Box,
  Group,
} from "@mantine/core";
import { Stethoscope, Home, ChevronLeft, Map } from "lucide-react";

export default function NotFound() {
  return (
    <Box
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "radial-gradient(circle at top right, #0a0f1e, #050811)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background Orbs */}
      <Box className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
      <Box className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]" />

      <Container size={500} className="relative z-10 w-full">
        <Stack align="center" gap="xl">
          <Box className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/20 rotate-12">
            <Stethoscope size={48} color="white" />
          </Box>

          <Stack align="center" gap={0}>
            <Title className="text-[120px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 select-none">
              404
            </Title>
            <Title
              order={2}
              className="text-3xl font-bold text-white mt-[-20px]"
            >
              Page Not Found
            </Title>
          </Stack>

          <Text className="text-gray-400 text-center max-w-md text-lg">
            The page you're looking for was moved, removed, or never existed in
            the ClinicAI system.
          </Text>

          <Group gap="md">
            <Button
              component={Link}
              href="/"
              size="lg"
              variant="gradient"
              gradient={{ from: "cyan.5", to: "blue.6" }}
              radius="md"
              leftSection={<Home size={20} />}
              className="px-8 shadow-lg shadow-cyan-500/10"
            >
              Go Home
            </Button>
            <Button
              onClick={() => window.history.back()}
              size="lg"
              variant="outline"
              color="cyan"
              radius="md"
              leftSection={<ChevronLeft size={20} />}
              className="px-8 border-white/10 hover:bg-white/5"
            >
              Go Back
            </Button>
          </Group>

          <Group gap="xs" className="mt-12 opacity-50">
            <Map size={16} color="#06b6d4" />
            <Text
              size="xs"
              c="dimmed"
              className="tracking-widest uppercase"
            >
              Lost in ClinicAI Ecosystem
            </Text>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}
