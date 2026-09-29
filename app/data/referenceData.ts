import type { CircuitReference, CircuitType } from '../types/diagnostic'

/**
 * Diagnostic Cell - Central Reference Data
 * Contains reference specifications for tractor electrical circuits.
 * Fuse Calculation Principle: I_fuse = 1.25 * I_load
 */

export const CIRCUITS_REFERENCE_DATA: Record<CircuitType, CircuitReference> = {
  horn: {
    id: 'horn',
    name: 'Horn',
    powerW: 60,
    voltageV: 12,
    currentA: 5.0,
    resistanceOhm: 2.4,
    fuseRatingA: 6.25, // 1.25 * 5.0
    description: 'Electric dual/single acoustic signaling horn circuit',
    nominalWireColor: 'Brown / Yellow',
    fuseType: 'Blade Fuse (ATO/ATC)',
  },
  headLampLow: {
    id: 'headLampLow',
    name: 'Head Lamp Low',
    powerW: 55,
    voltageV: 12,
    currentA: 4.58,
    resistanceOhm: 2.62,
    fuseRatingA: 5.725, // 1.25 * 4.58
    description: 'Low-beam front road illumination headlamp circuit',
    nominalWireColor: 'Blue / Red',
    fuseType: 'Blade Fuse (ATO/ATC)',
  },
  headLampHigh: {
    id: 'headLampHigh',
    name: 'Head Lamp High',
    powerW: 60,
    voltageV: 12,
    currentA: 5.0,
    resistanceOhm: 2.4,
    fuseRatingA: 6.25, // 1.25 * 5.0
    description: 'High-beam front distance illumination headlamp circuit',
    nominalWireColor: 'Blue / White',
    fuseType: 'Blade Fuse (ATO/ATC)',
  },
  indicator: {
    id: 'indicator',
    name: 'Indicator Lamp',
    powerW: 21,
    voltageV: 12,
    currentA: 1.75,
    resistanceOhm: 6.86,
    fuseRatingA: 2.1875, // 1.25 * 1.75
    description: 'Turn indicator and hazard warning flasher lamp circuit',
    nominalWireColor: 'Green / White',
    fuseType: 'Blade Fuse (ATO/ATC)',
  },
  brakeLight: {
    id: 'brakeLight',
    name: 'Brake Light',
    powerW: 21,
    voltageV: 12,
    currentA: 1.75,
    resistanceOhm: 6.86,
    fuseRatingA: 2.1875, // 1.25 * 1.75
    description: 'Pedal-actuated rear stop warning lamp circuit',
    nominalWireColor: 'Green / Purple',
    fuseType: 'Blade Fuse (ATO/ATC)',
  },
  ploughLamp: {
    id: 'ploughLamp',
    name: 'Plough Lamp',
    powerW: 55,
    voltageV: 12,
    currentA: 4.58,
    resistanceOhm: 2.62,
    fuseRatingA: 5.725, // 1.25 * 4.58
    description: 'Rear agricultural work/plough auxiliary illumination lamp',
    nominalWireColor: 'Yellow / Green',
    fuseType: 'Blade Fuse (ATO/ATC)',
  },
  numberPlateLight: {
    id: 'numberPlateLight',
    name: 'Number Plate Light',
    powerW: 10,
    voltageV: 12,
    currentA: 0.83,
    resistanceOhm: 14.4,
    fuseRatingA: 1.04, // 1.25 * 0.83
    description: 'Rear registration license plate illumination circuit',
    nominalWireColor: 'Red / Black',
    fuseType: 'Blade Fuse (Mini/ATO)',
  },
  gaugeBulb: {
    id: 'gaugeBulb',
    name: 'Gauge / Panel Bulb',
    powerW: 5,
    voltageV: 12,
    currentA: 0.42,
    resistanceOhm: 28.8,
    fuseRatingA: 0.525, // 1.25 * 0.42
    description: 'Instrument cluster and gauge backlight illumination',
    nominalWireColor: 'Red / White',
    fuseType: 'Mini Blade Fuse',
  },
  nightLamp: {
    id: 'nightLamp',
    name: 'Night Lamp',
    powerW: 15,
    voltageV: 12,
    currentA: 1.25,
    resistanceOhm: 9.6,
    fuseRatingA: 1.56, // 1.25 * 1.25
    description: 'Front and rear night marker / clearance parking lamp',
    nominalWireColor: 'Red',
    fuseType: 'Blade Fuse (ATO/ATC)',
  },
}

export const CIRCUIT_OPTIONS = Object.values(CIRCUITS_REFERENCE_DATA)

/**
 * Standard engineering diagnostic tolerances for university prototype.
 * Can be calibrated/updated based on instructor or MTL specifications.
 */
export const DEFAULT_TOLERANCES = {
  voltage: {
    minWarnPercent: 8, // ±8% to 15% is warning
    maxFailPercent: 15, // >15% is failure
    nominalV: 12.0,
    criticalMinV: 10.2,
    criticalMaxV: 14.8,
  },
  current: {
    warnPercent: 15, // ±15% is warning
    failPercent: 25, // >25% is failure
  },
  resistance: {
    warnPercent: 15, // ±15% is warning
    failPercent: 30, // >30% is failure
  },
  temperature: {
    normalMaxC: 50,
    warningMaxC: 65,
    criticalMaxC: 80,
  },
  fuse: {
    tolerancePercent: 20,
  },
}

export const POPULAR_TRACTOR_MODELS = [
  'MTL 240 (Millat Tractors)',
  'MTL 260 (Millat Tractors)',
  'MTL 375 (Millat Tractors)',
  'MTL 385 2WD (Millat Tractors)',
  'MTL 385 4WD (Millat Tractors)',
  'Massey Ferguson MF-240',
  'Massey Ferguson MF-385',
  'Fiat / New Holland 480',
  'Fiat / New Holland 640',
  'Al-Ghazi NH-480',
]
