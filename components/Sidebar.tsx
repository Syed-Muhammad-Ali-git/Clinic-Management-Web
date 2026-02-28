"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserAction } from "@/redux/actions/auth-action/auth-action";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  Box,
  Stack,
  Text,
  UnstyledButton,
  Group,
  ThemeIcon,
  Divider,
  ScrollArea,
  Badge,
  Transition,
  rem,
  MantineTheme,
} from "@mantine/core";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Pill,
  LogOut,
  Stethoscope,
  UserCircle,
  ChevronRight,
  BrainCircuit,
} from "lucide-react";

const NAV: Record<string, { label: string; icon: any; href: string }[]> = {
  admin: [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Patients", icon: Users, href: "/patients" },
    { label: "Appointments", icon: Calendar, href: "/appointments" },
    { label: "Prescriptions", icon: Pill, href: "/prescriptions" },
    { label: "AI Diagnostic", icon: BrainCircuit, href: "/ai" },
  ],
  doctor: [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Patients", icon: Users, href: "/patients" },
    { label: "Appointments", icon: Calendar, href: "/appointments" },
    { label: "Prescriptions", icon: Pill, href: "/prescriptions" },
    { label: "AI Diagnostic", icon: BrainCircuit, href: "/ai" },
  ],
  receptionist: [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Patients", icon: Users, href: "/patients" },
    { label: "Appointments", icon: Calendar, href: "/appointments" },
  ],
  patient: [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "My Appointments", icon: Calendar, href: "/appointments" },
    { label: "My Prescriptions", icon: Pill, href: "/prescriptions" },
  ],
};

const ROLE_CONFIG: Record<string, { color: string; label: string }> = {
  admin: { color: "red.6", label: "Administrator" },
  doctor: { color: "cyan.6", label: "Doctor" },
  receptionist: { color: "grape.6", label: "Receptionist" },
  patient: { color: "teal.6", label: "Patient" },
};

interface SidebarProps {
  role: string;
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ role, open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useDispatch() as AppDispatch;
  const router = useRouter();
  const userData = useSelector((state: RootState) => state.user.userData);
  const loginData = useSelector((state: RootState) => state.auth.loginData);

  const navItems = NAV[role] || NAV.patient;
  const roleInfo = ROLE_CONFIG[role] || ROLE_CONFIG.patient;

  const displayName =
    userData?.name || loginData?.displayName || loginData?.email || "User";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUserAction());
      router.push("/login");
    } catch (err) {}
  };

  const links = navItems.map((item) => {
    const isActive =
      pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(item.href));
    return (
      <UnstyledButton
        key={item.label}
        component={Link}
        href={item.href}
        onClick={onClose}
        style={(theme: MantineTheme) => ({
          display: "block",
          width: "100%",
          padding: `${rem(10)} ${rem(12)}`,
          borderRadius: theme.radius.md,
          color: isActive ? theme.white : theme.colors.gray[5],
          backgroundColor: isActive ? theme.colors.cyan[6] : "transparent",
          transition: "all 0.2s ease",

          "&:hover": {
            backgroundColor: isActive
              ? theme.colors.cyan[7]
              : "rgba(255, 255, 255, 0.05)",
            color: theme.white,
            transform: "translateX(4px)",
          },
        })}
      >
        <Group justify="space-between" wrap="nowrap">
          <Group gap="sm">
            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <Text size="sm" fw={isActive ? 600 : 500}>
              {item.label}
            </Text>
          </Group>
          {isActive && <ChevronRight size={14} />}
        </Group>
      </UnstyledButton>
    );
  });

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <Box
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <Box
        component="aside"
        style={(theme: MantineTheme) => ({
          width: rem(280),
          height: "100vh",
          backgroundColor: "#0a0f1e",
          borderRight: "1px solid rgba(255, 255, 255, 0.05)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 50,
          transition: "transform 0.3s ease",
          transform: open ? "translateX(0)" : "translateX(-100%)",

          "@media (min-width: 768px)": {
            position: "static",
            transform: "none",
          },
        })}
      >
        {/* Header */}
        <Box p="xl" pb="lg">
          <Group gap="md">
            <ThemeIcon
              size={42}
              radius="lg"
              variant="gradient"
              gradient={{ from: "cyan.5", to: "blue.6" }}
              style={{ boxShadow: "0 8px 20px -5px rgba(6, 182, 212, 0.5)" }}
            >
              <Stethoscope size={24} />
            </ThemeIcon>
            <Box>
              <Text
                fw={800}
                size="xl"
                color="white"
                style={{ letterSpacing: "-0.5px", lineHeight: 1 }}
              >
                ClinicAI
              </Text>
              <Text
                size="xs"
                color="gray.6"
                fw={600}
                mt={4}
                style={{ letterSpacing: "1px", textTransform: "uppercase" }}
              >
                Health System
              </Text>
            </Box>
          </Group>
        </Box>

        <Divider mx="lg" color="rgba(255, 255, 255, 0.05)" />

        {/* Navigation */}
        <ScrollArea flex={1} px="md" py="xl">
          <Stack gap={4}>
            <Text
              size="xs"
              fw={700}
              color="gray.7"
              px="sm"
              mb={8}
              style={{ textTransform: "uppercase", letterSpacing: "1px" }}
            >
              Main Menu
            </Text>
            {links}
          </Stack>
        </ScrollArea>

        {/* Footer */}
        <Box
          p="lg"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <Group gap="sm" mb="md" wrap="nowrap">
            <Box
              style={(theme: MantineTheme) => ({
                width: rem(42),
                height: rem(42),
                borderRadius: theme.radius.md,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              })}
            >
              <Text fw={700} color="white">
                {initials}
              </Text>
            </Box>
            <Box style={{ flex: 1, minWidth: 0 }}>
              <Text size="sm" fw={600} color="white" truncate>
                {displayName}
              </Text>
              <Badge
                size="xs"
                variant="filled"
                color={roleInfo.color}
                radius="sm"
                style={{ textTransform: "capitalize" }}
              >
                {roleInfo.label}
              </Badge>
            </Box>
          </Group>

          <UnstyledButton
            onClick={handleLogout}
            style={(theme: MantineTheme) => ({
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
              width: "100%",
              padding: `${rem(8)} ${rem(12)}`,
              borderRadius: theme.radius.md,
              color: theme.colors.gray[6],
              "&:hover": {
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: theme.colors.red[5],
              },
            })}
          >
            <LogOut size={18} />
            <Text size="sm" fw={600}>
              Sign Out
            </Text>
          </UnstyledButton>
        </Box>
      </Box>
    </>
  );
}
