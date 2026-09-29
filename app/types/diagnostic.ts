export type CircuitType =
  | 'horn'
  | 'headLampLow'
  | 'headLampHigh'
  | 'indicator'
  | 'brakeLight'
  | 'ploughLamp'
  | 'numberPlateLight'
  | 'gaugeBulb'
  | 'nightLamp'

export interface CircuitReference {
  id: CircuitType
  name: string
  powerW: number
  voltageV: number
  currentA: number
  resistanceOhm: number
  fuseRatingA: number // calculated as 1.25 * currentA
  description: string
  nominalWireColor?: string
  fuseType: string
}

export type TestResultStatus = 'PASS' | 'WARNING' | 'FAIL'

export interface TestMetricResult {
  testName: string
  expectedValue: string
  measuredValue: string
  unit: string
  status: TestResultStatus
  deviationPercent?: number
  notes?: string
}

export interface DiagnosticMeasurement {
  voltageV: number
  currentA: number
  resistanceOhm: number
  continuity: boolean
  fuseInstalledA: number
  fuseBlown: boolean
  temperatureC: number
}

export interface DiagnosticFault {
  id: string
  severity: 'CRITICAL' | 'WARNING' | 'INFO'
  title: string
  description: string
  possibleCauses: string[]
}

export interface DiagnosticSession {
  id: string
  date: string // ISO string
  formattedDate: string
  tractorModel: string
  chassisNumber: string
  tractorId: string
  technicianName: string
  circuitId: CircuitType
  circuitName: string
  measurements: DiagnosticMeasurement
  reference: CircuitReference
  testResults: TestMetricResult[]
  overallStatus: TestResultStatus
  faults: DiagnosticFault[]
  diagnosticMode: 'normal' | 'fault_simulation'
  simulatedFaultType?: string
  notes?: string
}

export interface TractorProfile {
  id: string
  model: string
  chassisNumber: string
  tractorId: string
  technicianName: string
  savedAt: string
  totalScans: number
  lastStatus?: TestResultStatus
}

export type FaultSimulationOption =
  | 'none'
  | 'high_current'
  | 'low_voltage'
  | 'high_resistance'
  | 'open_circuit'
  | 'wrong_fuse'
  | 'high_temperature'
  | 'short_circuit'

export interface HardwareStatus {
  esp32: boolean
  voltageSensor: boolean
  currentSensor: boolean
  tempSensor: boolean
  continuityModule: boolean
  baudRate: number
  comPort: string
}

export interface AppSettings {
  theme: 'light' | 'dark'
  technicianName: string
  voltageTolerancePercent: number
  currentTolerancePercent: number
  resistanceTolerancePercent: number
  maxNormalTempC: number
  measurementUnit: 'metric'
}
