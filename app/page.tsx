"use client";

import Link from 'next/link';
import { Button, Container, Group, Text, Title, SimpleGrid, Card, Box, Stack } from '@mantine/core';
import { Activity, Calendar, Pill, Brain, Heart, Stethoscope, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <Box className="min-h-screen bg-[#0a0f1e] text-white selection:bg-cyan-500/30 overflow-hidden font-sans">
      {/* Background Orbs */}
      <Box className="fixed inset-0 overflow-hidden pointer-events-none">
        <Box className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-cyan-600/20 blur-[120px] rounded-full animate-pulse" />
        <Box className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] bg-blue-600/10 blur-[100px] rounded-full" />
      </Box>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-xl">
        <Container size="lg" className="h-20 flex items-center justify-between">
          <Group gap="xs">
            <Box className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 transition-transform hover:scale-105">
              <Stethoscope size={22} color="white" />
            </Box>
            <Text fw={800} size="xl" className="tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              ClinicAI
            </Text>
          </Group>
          <Group gap="md">
             <Link href="/login">
               <Button variant="subtle" color="gray" className="text-gray-300 hover:text-white">Sign In</Button>
             </Link>
             <Link href="/signup">
               <Button 
                variant="gradient" 
                gradient={{ from: 'cyan', to: 'blue' }} 
                radius="xl"
                className="shadow-lg shadow-cyan-500/20 px-6"
               >
                 Get Started
               </Button>
             </Link>
          </Group>
        </Container>
      </nav>

      {/* Hero Section */}
      <Container size="lg" className="relative z-10 pt-24 pb-32">
        <Stack align="center" gap="xl" className="text-center">
          <Box className="px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-md animate-fade-in">
            <Text size="xs" fw={600} className="uppercase tracking-widest text-cyan-400">
              Intelligent Clinic Management
            </Text>
          </Box>
          
          <Title className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1]">
            Your Practice, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 animate-gradient-x">
              Supercharged.
            </span>
          </Title>
          
          <Text size="lg" className="text-gray-400 max-w-2xl leading-relaxed">
            Experience the future of healthcare with ClinicAI. A premium ecosystem designed for 
            seamless patient care, automated scheduling, and AI-driven insights.
          </Text>

          <Group gap="lg" mt="xl">
            <Link href="/signup">
              <Button 
                size="xl" 
                radius="md" 
                variant="gradient" 
                gradient={{ from: 'cyan', to: 'indigo' }}
                className="shadow-2xl shadow-cyan-500/40 px-10 hover:scale-[1.02] transition-all"
                rightSection={<ArrowRight size={20} />}
              >
                Launch Dashboard
              </Button>
            </Link>
            <Link href="#features">
              <Button 
                size="xl" 
                radius="md" 
                variant="outline" 
                color="cyan" 
                className="px-10 border-2 hover:bg-cyan-500/5"
              >
                Explore Demo
              </Button>
            </Link>
          </Group>

          {/* Floating Icons Placeholder for Animation */}
          <Box className="relative mt-20 w-full max-w-3xl aspect-[16/9] rounded-3xl border border-white/10 bg-gradient-to-tr from-white/5 to-transparent backdrop-blur-sm overflow-hidden flex items-center justify-center shadow-2xl">
              <Box className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              <Group gap={60} className="animate-float">
                 <Stack align="center" className="opacity-40"><Activity size={48} className="text-cyan-400" /><Text size="xs">Vitals</Text></Stack>
                 <Stack align="center" className="opacity-80 scale-125"><Heart size={48} className="text-pink-500" /><Text size="xs">Cardiac</Text></Stack>
                 <Stack align="center" className="opacity-40"><Pill size={48} className="text-blue-400" /><Text size="xs">Meds</Text></Stack>
              </Group>
          </Box>
        </Stack>
      </Container>

      {/* Features Grid */}
      <Box id="features" className="bg-white/5 py-32 backdrop-blur-xl relative z-10 border-y border-white/5">
        <Container size="lg">
          <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="xl">
            <FeatureCard 
              icon={<Heart className="text-cyan-400" />} 
              title="Patient Management" 
              desc="Comprehensive EMR system for tracking history and vitals."
            />
            <FeatureCard 
              icon={<Calendar className="text-blue-400" />} 
              title="Smart Appointments" 
              desc="AI-optimized scheduling slots for maximum efficiency."
            />
            <FeatureCard 
              icon={<Pill className="text-indigo-400" />} 
              title="Digital Prescriptions" 
              desc="Generate secure, professional PDFs in one click."
            />
            <FeatureCard 
              icon={<Brain className="text-purple-400" />} 
              title="AI Diagnosis Assistant" 
              desc="Advanced symptom checking and risk assessment tools."
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Stats Bar */}
      <Container size="lg" className="py-24 relative z-10">
        <Group justify="space-around" className="text-center gap-y-12">
          <StatBox value="500+" label="Patients Served" />
          <StatBox value="50+" label="Specialist Doctors" />
          <StatBox value="1000+" label="Digital Rx Generated" />
          <StatBox value="99.9%" label="System Uptime" />
        </Group>
      </Container>

      {/* CTA Section */}
      <Box className="py-32 relative z-10 overflow-hidden">
        <Box className="absolute top-0 right-0 w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full" />
        <Container size="sm" className="text-center">
          <Stack gap="xl">
            <Title size="h1" className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Ready to modernize your clinic?
            </Title>
            <Text size="lg" className="text-gray-400">
              Join the new era of healthcare management. Secure, fast, and intelligent.
            </Text>
            <Link href="/login">
              <Button 
                size="xl" 
                radius="md" 
                variant="gradient" 
                gradient={{ from: 'cyan', to: 'blue' }}
                className="shadow-xl shadow-cyan-500/20 px-12"
              >
                Enter System Now
              </Button>
            </Link>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-black/20">
        <Container size="lg">
          <Group justify="space-between" className="text-gray-500">
            <Group gap="xs">
              <Stethoscope size={20} />
              <Text fw={700}>ClinicAI</Text>
            </Group>
            <Text size="xs">© 2024 ClinicAI. Built for excellence in healthcare.</Text>
            <Group gap="xl">
              <Text size="xs" className="cursor-pointer hover:text-white">Privacy</Text>
              <Text size="xs" className="cursor-pointer hover:text-white">Terms</Text>
            </Group>
          </Group>
        </Container>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-gradient-x {
           background-size: 200% 200%;
           animation: gradient-x 15s ease infinite;
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </Box>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <Card className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all hover:-translate-y-2 group backdrop-blur-md">
      <Box className="mb-6 group-hover:scale-110 transition-transform">{icon}</Box>
      <Title order={3} size="h4" className="text-white mb-3 tracking-tight">{title}</Title>
      <Text size="sm" className="text-gray-400 leading-relaxed">{desc}</Text>
    </Card>
  );
}

function StatBox({ value, label }: { value: string, label: string }) {
  return (
    <Stack gap={4}>
      <Text className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
        {value}
      </Text>
      <Text size="xs" fw={700} className="uppercase tracking-widest text-cyan-500">
        {label}
      </Text>
    </Stack>
  );
}
