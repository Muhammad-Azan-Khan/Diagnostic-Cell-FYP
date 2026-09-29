import type { DiagnosticSession, TractorProfile } from '../types/diagnostic'
import { CIRCUITS_REFERENCE_DATA } from './referenceData'
import { evaluateDiagnostic } from '../utils/diagnosticEngine'

export const INITIAL_TRACTORS: TractorProfile[] = [
  {
    id: 'tr-1',
    model: 'MTL 385 4WD (Millat Tractors)',
    chassisNumber: 'MTL-385-2024-8841',
    tractorId: 'TR-081',
    technicianName: 'Engr. Ahmad',
    savedAt: '2026-08-14 09:30 AM',
    totalScans: 3,
    lastStatus: 'PASS',
  },
  {
    id: 'tr-2',
    model: 'MTL 240 (Millat Tractors)',
    chassisNumber: 'MTL-240-2023-4512',
    tractorId: 'TR-042',
    technicianName: 'Technician Ali',
    savedAt: '2026-08-15 11:15 AM',
    totalScans: 2,
    lastStatus: 'FAIL',
  },
  {
    id: 'tr-3',
    model: 'Massey Ferguson MF-240',
    chassisNumber: 'MF-240-2022-7729',
    tractorId: 'TR-109',
    technicianName: 'Engr. Ahmad',
    savedAt: '2026-08-16 08:45 AM',
    totalScans: 1,
    lastStatus: 'WARNING',
  },
]

// Helper to construct a complete session
function buildInitialSession(
  id: string,
  date: string,
  formattedDate: string,
  tractor: { model: string; chassis: string; tractorId: string; tech: string },
  circuitKey: keyof typeof CIRCUITS_REFERENCE_DATA,
  measurements: {
    voltageV: number
    currentA: number
    resistanceOhm: number
    continuity: boolean
    fuseInstalledA: number
    fuseBlown: boolean
    temperatureC: number
  },
  mode: 'normal' | 'fault_simulation' = 'normal',
  simulatedFault?: string,
): DiagnosticSession {
  const ref = CIRCUITS_REFERENCE_DATA[circuitKey]
  const evalResult = evaluateDiagnostic(ref, measurements)

  return {
    id,
    date,
    formattedDate,
    tractorModel: tractor.model,
    chassisNumber: tractor.chassis,
    tractorId: tractor.tractorId,
    technicianName: tractor.tech,
    circuitId: circuitKey,
    circuitName: ref.name,
    measurements,
    reference: ref,
    testResults: evalResult.testResults,
    overallStatus: evalResult.overallStatus,
    faults: evalResult.faults,
    diagnosticMode: mode,
    simulatedFaultType: simulatedFault,
    notes: evalResult.summary,
  }
}

export const INITIAL_SESSIONS: DiagnosticSession[] = [
  buildInitialSession(
    'sess-101',
    '2026-08-16T08:30:00.000Z',
    '16 Aug 2026, 08:30 AM',
    {
      model: 'MTL 385 4WD (Millat Tractors)',
      chassis: 'MTL-385-2024-8841',
      tractorId: 'TR-081',
      tech: 'Engr. Ahmad',
    },
    'horn',
    {
      voltageV: 12.1,
      currentA: 4.98,
      resistanceOhm: 2.42,
      continuity: true,
      fuseInstalledA: 6.25,
      fuseBlown: false,
      temperatureC: 41.5,
    },
  ),
  buildInitialSession(
    'sess-102',
    '2026-08-15T14:20:00.000Z',
    '15 Aug 2026, 02:20 PM',
    {
      model: 'MTL 240 (Millat Tractors)',
      chassis: 'MTL-240-2023-4512',
      tractorId: 'TR-042',
      tech: 'Technician Ali',
    },
    'headLampLow',
    {
      voltageV: 11.9,
      currentA: 8.2, // high current fault!
      resistanceOhm: 1.45,
      continuity: true,
      fuseInstalledA: 5.7,
      fuseBlown: false,
      temperatureC: 58.2,
    },
    'fault_simulation',
    'High Current Draw',
  ),
  buildInitialSession(
    'sess-103',
    '2026-08-15T10:15:00.000Z',
    '15 Aug 2026, 10:15 AM',
    {
      model: 'Massey Ferguson MF-240',
      chassis: 'MF-240-2022-7729',
      tractorId: 'TR-109',
      tech: 'Engr. Ahmad',
    },
    'indicator',
    {
      voltageV: 11.4, // slight warn
      currentA: 1.72,
      resistanceOhm: 6.95,
      continuity: true,
      fuseInstalledA: 2.2,
      fuseBlown: false,
      temperatureC: 48.0,
    },
  ),
  buildInitialSession(
    'sess-104',
    '2026-08-14T16:45:00.000Z',
    '14 Aug 2026, 04:45 PM',
    {
      model: 'MTL 385 4WD (Millat Tractors)',
      chassis: 'MTL-385-2024-8841',
      tractorId: 'TR-081',
      tech: 'Engr. Ahmad',
    },
    'brakeLight',
    {
      voltageV: 12.05,
      currentA: 1.76,
      resistanceOhm: 6.84,
      continuity: true,
      fuseInstalledA: 2.18,
      fuseBlown: false,
      temperatureC: 39.0,
    },
  ),
]
