'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPrescriptionsAction } from '@/redux/actions/prescription-action/prescription-action';
import type { AppDispatch, RootState } from '@/redux/store';
import useRequireAuth from '@/lib/hooks/useRequireAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';
import {
  Box,
  Text,
  Title,
  Button,
  Loader,
  Center,
  Badge,
  Stack,
  Group,
  TextInput,
  Modal,
  ScrollArea,
  Divider,
  rem,
} from '@mantine/core';
import type { Prescription } from '@/app/types/prescription';

// ------------ AI Explain Modal ------------
interface AiExplainModalProps {
  prescription: Prescription | null;
  opened: boolean;
  onClose: () => void;
}

function AiExplainModal({ prescription, opened, onClose }: AiExplainModalProps) {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!opened || !prescription) return;
    setExplanation('');
    setLoading(true);
    fetch('/api/ai/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prescription }),
    })
      .then((r) => r.json())
      .then((data) => {
        setExplanation(data.explanation ?? data.error ?? 'No response from AI.');
        setLoading(false);
      })
      .catch(() => {
        setExplanation('Failed to get AI explanation.');
        setLoading(false);
        toast.error('AI explanation failed.');
      });
  }, [opened, prescription]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="AI Prescription Explanation"
      size="lg"
      styles={{
        header: { backgroundColor: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.08)' },
        body: { backgroundColor: '#0f172a' },
        content: { backgroundColor: '#0f172a' },
        title: { color: '#e2e8f0', fontWeight: 600 },
        close: { color: '#94a3b8' },
      }}
    >
      {loading ? (
        <Center py="xl">
          <Stack align="center" gap="sm">
            <Loader color="cyan" size="md" />
            <Text c="dimmed" size="sm">Analyzing prescription...</Text>
          </Stack>
        </Center>
      ) : (
        <ScrollArea h={380}>
          <Text size="sm" style={{ color: '#cbd5e1', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {explanation}
          </Text>
        </ScrollArea>
      )}
    </Modal>
  );
}

// ------------ Main Page ------------
export default function PrescriptionsPage() {
  const { user } = useRequireAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { prescriptions, loading, error } = useSelector((s: RootState) => s.prescription);

  const [search, setSearch] = useState('');
  const [aiPrescription, setAiPrescription] = useState<Prescription | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const role = user?.role ?? '';
  const canCreate = ['admin', 'doctor'].includes(role);
  const isPatient = role === 'patient';

  useEffect(() => {
    if (!user) return;
    if (isPatient) {
      dispatch(fetchPrescriptionsAction({ patientId: user.uid }));
    } else if (role === 'doctor') {
      dispatch(fetchPrescriptionsAction({ doctorId: user.uid }));
    } else {
      dispatch(fetchPrescriptionsAction());
    }
  }, [user, dispatch, isPatient, role]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const filtered = prescriptions.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.patientName?.toLowerCase().includes(q) ||
      p.doctorName?.toLowerCase().includes(q) ||
      p.diagnosis?.toLowerCase().includes(q)
    );
  });

  const openAi = (p: Prescription) => {
    setAiPrescription(p);
    setAiModalOpen(true);
  };

  return (
    <Box style={{ padding: rem(24) }}>
      {/* Header */}
      <Group justify="space-between" mb="lg" wrap="wrap" gap="sm">
        <div>
          <Title order={2} style={{ color: '#e2e8f0' }}>Prescriptions</Title>
          <Text size="sm" c="dimmed" mt={4}>
            {isPatient ? 'Your prescription history' : 'Manage patient prescriptions'}
          </Text>
        </div>
        {canCreate && (
          <Button
            component={Link}
            href="/prescriptions/create"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
          >
            + New Prescription
          </Button>
        )}
      </Group>

      {/* Search */}
      <TextInput
        placeholder="Search by patient, doctor, or diagnosis..."
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        mb="lg"
        styles={{
          input: {
            backgroundColor: '#1e293b',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#e2e8f0',
          },
        }}
      />

      {/* Loading */}
      {loading && (
        <Center py="xl">
          <Loader color="cyan" size="md" />
        </Center>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <Center py="xl">
          <Stack align="center" gap="sm">
            <Text size="xl" style={{ fontSize: rem(40) }}>Rx</Text>
            <Text c="dimmed">No prescriptions found</Text>
            {canCreate && (
              <Button
                component={Link}
                href="/prescriptions/create"
                variant="outline"
                color="cyan"
                size="sm"
              >
                Create first prescription
              </Button>
            )}
          </Stack>
        </Center>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: rem(16),
          }}
        >
          {filtered.map((p) => (
            <Box
              key={p.id}
              style={{
                backgroundColor: '#1e293b',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: rem(12),
                padding: rem(20),
              }}
            >
              {/* Card Header */}
              <Group justify="space-between" mb="sm">
                <Badge color="cyan" variant="light">Rx</Badge>
                <Text size="xs" c="dimmed">
                  {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}
                </Text>
              </Group>

              {/* Patient / Doctor */}
              <Text fw={600} style={{ color: '#e2e8f0' }} mb={4}>{p.patientName}</Text>
              <Text size="sm" c="dimmed" mb={4}>Dr. {p.doctorName}</Text>
              <Text size="sm" style={{ color: '#94a3b8' }} mb="sm">
                Diagnosis: {p.diagnosis}
              </Text>

              <Divider color="rgba(255,255,255,0.06)" mb="sm" />

              {/* Medications */}
              <Text size="xs" fw={600} style={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }} mb={6}>
                Medications ({p.medications?.length ?? 0})
              </Text>
              <Stack gap={4} mb="sm">
                {(p.medications ?? []).slice(0, 3).map((m, i) => (
                  <Text key={i} size="sm" style={{ color: '#cbd5e1' }}>
                    {m.name} — {m.dosage}, {m.frequency}
                  </Text>
                ))}
                {(p.medications?.length ?? 0) > 3 && (
                  <Text size="xs" c="dimmed">+{p.medications.length - 3} more</Text>
                )}
              </Stack>

              {/* Notes */}
              {p.notes && (
                <Text size="xs" c="dimmed" mb="sm" style={{ fontStyle: 'italic' }}>
                  Note: {p.notes}
                </Text>
              )}

              {/* Actions */}
              <Group gap="sm" mt="sm">
                {p.pdfUrl && (
                  <Button
                    component="a"
                    href={p.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="xs"
                    variant="outline"
                    color="gray"
                  >
                    View PDF
                  </Button>
                )}
                <Button
                  size="xs"
                  variant="light"
                  color="violet"
                  onClick={() => openAi(p)}
                >
                  AI Explain
                </Button>
              </Group>
            </Box>
          ))}
        </Box>
      )}

      {/* AI Modal */}
      <AiExplainModal
        prescription={aiPrescription}
        opened={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />
    </Box>
  );
}
