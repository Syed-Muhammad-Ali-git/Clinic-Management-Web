"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "@/components/Sidebar";
import GlobalLoader from "@/components/GlobalLoader";
import type { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import {
  Box,
  Group,
  Text,
  ActionIcon,
  Avatar,
  Menu,
  UnstyledButton,
  rem,
  Tooltip,
  Badge,
  Paper,
  MantineTheme,
} from "@mantine/core";
import {
  Menu as MenuIcon,
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutUserAction } from "@/redux/actions/auth-action/auth-action";
import { useRouter } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const userData = useSelector((state: RootState) => state.user.userData);
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const role = userData?.role || "patient";
  const roleLabels: Record<string, string> = {
    admin: "Administrator",
    doctor: "Medical Doctor",
    receptionist: "Reception Staff",
    patient: "Clinic Patient",
  };

  const displayName =
    userData?.name || loginData?.displayName || loginData?.email || "User";

  const handleLogout = async () => {
    try {
      await (dispatch as any)(logoutUserAction());
      toast.success("Signed out successfully!");
      router.push("/login");
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <Box
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#f8fafc",
      }}
    >
      <GlobalLoader />
      <Sidebar
        role={role}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <Box
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {/* Top Header */}
        <Paper
          component="header"
          shadow="sm"
          p="md"
          radius={0}
          style={{
            height: rem(70),
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e2e8f0",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Group gap="lg">
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              hiddenFrom="md"
              size="lg"
            >
              <MenuIcon size={24} />
            </ActionIcon>

            <Group gap="xs" hiddenFrom="md">
              <Stethoscope size={24} color="#06b6d4" />
              <Text fw={800} size="lg" c="dark">
                ClinicAI
              </Text>
            </Group>

            {/* Role indicator in header */}
            <Group gap="xs" visibleFrom="md">
              <Badge
                variant="dot"
                color="cyan"
                size="lg"
                p="md"
                style={{
                  backgroundColor: "rgba(6, 182, 212, 0.05)",
                  border: "1px solid rgba(6, 182, 212, 0.1)",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                <Group gap={6}>
                  <ShieldCheck size={14} />
                  <Text size="sm" span>
                    {roleLabels[role] || role}
                  </Text>
                </Group>
              </Badge>
            </Group>
          </Group>

          <Group gap="md">
            <Group gap={rem(8)} visibleFrom="sm">
              <Tooltip label="Search Records">
                <ActionIcon variant="subtle" color="gray" size="lg" radius="md">
                  <Search size={20} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Notifications">
                <ActionIcon variant="subtle" color="gray" size="lg" radius="md">
                  <Bell size={20} />
                </ActionIcon>
              </Tooltip>
            </Group>

            <Box
              style={{
                width: "1px",
                height: "24px",
                backgroundColor: "#e2e8f0",
              }}
              visibleFrom="sm"
            />

            <Menu shadow="md" width={220} radius="md" position="bottom-end">
              <Menu.Target>
                <UnstyledButton
                  style={(theme: MantineTheme) => ({
                    padding: `${rem(4)} ${rem(8)}`,
                    borderRadius: theme.radius.md,
                    transition: "background 0.2s ease",
                    "&:hover": { backgroundColor: theme.colors.gray[0] },
                  })}
                >
                  <Group gap="sm">
                    <Avatar
                      color="cyan"
                      radius="md"
                      size="md"
                      style={{
                        boxShadow: "0 4px 10px -2px rgba(6, 182, 212, 0.3)",
                      }}
                    >
                      {displayName[0].toUpperCase()}
                    </Avatar>
                    <Box visibleFrom="sm" style={{ textAlign: "left" }}>
                      <Text size="sm" fw={700} c="dark" lh={1}>
                        {displayName}
                      </Text>
                      <Text size="xs" c="gray.6" mt={2} fw={500}>
                        {roleLabels[role]}
                      </Text>
                    </Box>
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown p="xs">
                <Menu.Label>Personal Account</Menu.Label>
                <Menu.Item leftSection={<User size={16} />}>
                  My Profile
                </Menu.Item>
                <Menu.Item leftSection={<Settings size={16} />}>
                  Account Settings
                </Menu.Item>

                <Menu.Divider />

                <Menu.Label>System</Menu.Label>
                <Menu.Item
                  color="red"
                  leftSection={<LogOut size={16} />}
                  onClick={handleLogout}
                >
                  Sign Out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Paper>

        {/* Main Content Area */}
        <Box
          component="main"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: rem(30),
            "@media (max-width: 768px)": {
              padding: rem(15),
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
