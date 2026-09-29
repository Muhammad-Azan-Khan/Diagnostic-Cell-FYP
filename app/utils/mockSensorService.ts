import type {
  CircuitReference,
  DiagnosticMeasurement,
  FaultSimulationOption,
} from '../types/diagnostic'

export interface ScanProgressStep {
  step: number
  totalSteps: number
  label: string
  percent: number
}

export const SCAN_STEPS: string[] = [
  'Initializing ESP32 hardware interface...',
  'Reading bus and line voltage...',
  'Sampling circuit current draw...',
  'Measuring total circuit resistance...',
  'Verifying electrical loop continuity...',
  'Checking branch fuse rating & condition...',
  'Measuring connector junction temperature...',
  'Evaluating parameters against reference model...',
  'Diagnostic scan complete',
]

/**
 * Generates realistic sensor measurements based on circuit reference and simulation mode.
 * Ready to be replaced by actual ESP32 / Serial / WebSocket telemetry in future iterations.
 */
export function generateSensorMeasurement(
  reference: CircuitReference,
  simulationOption: FaultSimulationOption = 'none',
): DiagnosticMeasurement {
  // Small natural variance for normal mode (±1-3%)
  const jitter = (min: number, max: number) => min + Math.random() * (max - min)

  switch (simulationOption) {
    case 'high_current':
      return {
        voltageV: Number((reference.voltageV * jitter(0.95, 0.98)).toFixed(2)),
        currentA: Number((reference.currentA * jitter(1.6, 1.9)).toFixed(2)),
        resistanceOhm: Number((reference.resistanceOhm * jitter(0.55, 0.65)).toFixed(2)),
        continuity: true,
        fuseInstalledA: Number(reference.fuseRatingA.toFixed(1)),
        fuseBlown: false,
        temperatureC: Number(jitter(55, 68).toFixed(1)),
      }

    case 'low_voltage':
      return {
        voltageV: Number(jitter(9.4, 10.1).toFixed(2)),
        currentA: Number((reference.currentA * jitter(0.75, 0.84)).toFixed(2)),
        resistanceOhm: Number((reference.resistanceOhm * jitter(1.0, 1.05)).toFixed(2)),
        continuity: true,
        fuseInstalledA: Number(reference.fuseRatingA.toFixed(1)),
        fuseBlown: false,
        temperatureC: Number(jitter(32, 40).toFixed(1)),
      }

    case 'high_resistance':
      return {
        voltageV: Number((reference.voltageV * jitter(0.96, 1.02)).toFixed(2)),
        currentA: Number((reference.currentA * jitter(0.3, 0.5)).toFixed(2)),
        resistanceOhm: Number((reference.resistanceOhm * jitter(3.0, 5.5)).toFixed(2)),
        continuity: true,
        fuseInstalledA: Number(reference.fuseRatingA.toFixed(1)),
        fuseBlown: false,
        temperatureC: Number(jitter(36, 44).toFixed(1)),
      }

    case 'open_circuit':
      return {
        voltageV: Number((reference.voltageV * jitter(0.98, 1.02)).toFixed(2)),
        currentA: 0.0,
        resistanceOhm: 999.9, // infinite
        continuity: false,
        fuseInstalledA: Number(reference.fuseRatingA.toFixed(1)),
        fuseBlown: false,
        temperatureC: Number(jitter(28, 33).toFixed(1)),
      }

    case 'wrong_fuse':
      return {
        voltageV: Number((reference.voltageV * jitter(0.98, 1.02)).toFixed(2)),
        currentA: Number((reference.currentA * jitter(0.97, 1.03)).toFixed(2)),
        resistanceOhm: Number((reference.resistanceOhm * jitter(0.97, 1.03)).toFixed(2)),
        continuity: true,
        fuseInstalledA: 20.0, // grossly oversized compared to e.g. 2.18A or 6.25A
        fuseBlown: false,
        temperatureC: Number(jitter(38, 44).toFixed(1)),
      }

    case 'high_temperature':
      return {
        voltageV: Number((reference.voltageV * jitter(0.95, 0.99)).toFixed(2)),
        currentA: Number((reference.currentA * jitter(1.15, 1.25)).toFixed(2)),
        resistanceOhm: Number((reference.resistanceOhm * jitter(1.05, 1.15)).toFixed(2)),
        continuity: true,
        fuseInstalledA: Number(reference.fuseRatingA.toFixed(1)),
        fuseBlown: false,
        temperatureC: Number(jitter(74, 86).toFixed(1)),
      }

    case 'short_circuit':
      return {
        voltageV: Number(jitter(11.2, 11.8).toFixed(2)),
        currentA: Number((reference.currentA * jitter(2.5, 3.5)).toFixed(2)),
        resistanceOhm: Number(jitter(0.15, 0.35).toFixed(2)),
        continuity: true,
        fuseInstalledA: Number(reference.fuseRatingA.toFixed(1)),
        fuseBlown: true,
        temperatureC: Number(jitter(65, 78).toFixed(1)),
      }

    case 'none':
    default:
      // Realistic Normal Operation within standard nominal envelope
      return {
        voltageV: Number((reference.voltageV * jitter(0.985, 1.018)).toFixed(2)),
        currentA: Number((reference.currentA * jitter(0.98, 1.025)).toFixed(2)),
        resistanceOhm: Number((reference.resistanceOhm * jitter(0.98, 1.025)).toFixed(2)),
        continuity: true,
        fuseInstalledA: Number(reference.fuseRatingA.toFixed(1)),
        fuseBlown: false,
        temperatureC: Number(jitter(36, 44).toFixed(1)),
      }
  }
}
