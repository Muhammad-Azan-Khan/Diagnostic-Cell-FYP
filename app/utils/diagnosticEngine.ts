import type {
  CircuitReference,
  DiagnosticFault,
  DiagnosticMeasurement,
  TestMetricResult,
  TestResultStatus,
} from '../types/diagnostic'
import { DEFAULT_TOLERANCES } from '../data/referenceData'

export interface DiagnosticEngineResult {
  overallStatus: TestResultStatus
  testResults: TestMetricResult[]
  faults: DiagnosticFault[]
  summary: string
}

/**
 * Diagnostic Evaluation Algorithm
 * Evaluates measured circuit parameters against engineering reference specifications.
 */
export function evaluateDiagnostic(
  reference: CircuitReference,
  measured: DiagnosticMeasurement,
  tolerances = DEFAULT_TOLERANCES,
): DiagnosticEngineResult {
  const testResults: TestMetricResult[] = []
  const faults: DiagnosticFault[] = []

  // 1. Voltage Evaluation
  const expVoltage = reference.voltageV
  const voltDiff = measured.voltageV - expVoltage
  const voltDiffPercent = (Math.abs(voltDiff) / expVoltage) * 100

  let voltageStatus: TestResultStatus = 'PASS'
  if (
    measured.voltageV < tolerances.voltage.criticalMinV ||
    measured.voltageV > tolerances.voltage.criticalMaxV ||
    voltDiffPercent > tolerances.voltage.maxFailPercent
  ) {
    voltageStatus = 'FAIL'
    faults.push({
      id: 'fault-voltage-fail',
      severity: 'CRITICAL',
      title: 'Abnormal Circuit Voltage',
      description: `Measured voltage of ${measured.voltageV.toFixed(2)}V deviates by ${voltDiffPercent.toFixed(1)}% from reference standard (12.0V).`,
      possibleCauses: [
        'Possible Cause: Battery charge degraded or defective alternator charging regulator',
        'Possible Cause: High resistance corroded ground or terminal contact',
        'Possible Cause: Excessive voltage drop along tractor main wiring harness',
      ],
    })
  } else if (voltDiffPercent > tolerances.voltage.minWarnPercent) {
    voltageStatus = 'WARNING'
    faults.push({
      id: 'fault-voltage-warn',
      severity: 'WARNING',
      title: 'Marginal Circuit Voltage',
      description: `Voltage is ${measured.voltageV.toFixed(2)}V (slightly beyond ideal 12V operating point).`,
      possibleCauses: [
        'Possible Cause: Minor terminal oxidation or loose wire clip',
        'Possible Cause: High electrical load from concurrent accessories',
      ],
    })
  }

  testResults.push({
    testName: 'Voltage',
    expectedValue: `${expVoltage.toFixed(1)} V`,
    measuredValue: `${measured.voltageV.toFixed(2)} V`,
    unit: 'V',
    status: voltageStatus,
    deviationPercent: Number(voltDiffPercent.toFixed(1)),
    notes:
      voltageStatus === 'PASS'
        ? 'Within nominal 12V automotive spec'
        : `Deviation: ${voltDiff >= 0 ? '+' : ''}${voltDiff.toFixed(2)}V`,
  })

  // 2. Continuity Evaluation
  let continuityStatus: TestResultStatus = 'PASS'
  if (!measured.continuity) {
    continuityStatus = 'FAIL'
    faults.push({
      id: 'fault-continuity-fail',
      severity: 'CRITICAL',
      title: 'Open Circuit / No Continuity',
      description: `Electrical continuity broken. Current cannot flow through ${reference.name} loop.`,
      possibleCauses: [
        'Possible Cause: Cut, severed, or disconnected wiring harness',
        'Possible Cause: Burned out filament or defective load element',
        'Possible Cause: Loose or unplugged socket connector',
      ],
    })
  }

  testResults.push({
    testName: 'Continuity',
    expectedValue: 'Connected (Closed)',
    measuredValue: measured.continuity ? 'Connected (Closed)' : 'Open (Broken)',
    unit: 'State',
    status: continuityStatus,
    notes: measured.continuity ? 'Loop continuity verified' : 'No path for electrical current',
  })

  // 3. Current Evaluation
  const expCurrent = reference.currentA
  const currentDiff = measured.currentA - expCurrent
  const currentDiffPercent = (Math.abs(currentDiff) / expCurrent) * 100

  let currentStatus: TestResultStatus = 'PASS'
  if (!measured.continuity || measured.currentA === 0) {
    currentStatus = 'FAIL'
  } else if (currentDiffPercent > tolerances.current.failPercent) {
    currentStatus = 'FAIL'
    if (measured.currentA > expCurrent) {
      faults.push({
        id: 'fault-current-high',
        severity: 'CRITICAL',
        title: 'Excessive Circuit Current Draw',
        description: `Measured current is ${measured.currentA.toFixed(2)}A compared to expected ${expCurrent.toFixed(2)}A (+${currentDiffPercent.toFixed(1)}%).`,
        possibleCauses: [
          'Possible Cause: Partial short circuit in harness wiring',
          'Possible Cause: Incorrect high-wattage bulb or aftermarket accessory fitted',
          'Possible Cause: Seized horn diaphragm or internal component short',
        ],
      })
    } else {
      faults.push({
        id: 'fault-current-low',
        severity: 'CRITICAL',
        title: 'Insufficient Current Flow',
        description: `Current is unusually low (${measured.currentA.toFixed(2)}A vs expected ${expCurrent.toFixed(2)}A).`,
        possibleCauses: [
          'Possible Cause: Undersized or incorrect wattage bulb installed',
          'Possible Cause: High series resistance at connectors or switch contacts',
          'Possible Cause: Weak tractor chassis ground return',
        ],
      })
    }
  } else if (currentDiffPercent > tolerances.current.warnPercent) {
    currentStatus = 'WARNING'
    faults.push({
      id: 'fault-current-warn',
      severity: 'WARNING',
      title: 'Current Draw Minor Deviation',
      description: `Current draw of ${measured.currentA.toFixed(2)}A is outside strict tolerance.`,
      possibleCauses: [
        'Possible Cause: Slight component aging or non-standard replacement bulb',
        'Possible Cause: Minor temperature-induced resistance shift',
      ],
    })
  }

  testResults.push({
    testName: 'Current',
    expectedValue: `${expCurrent.toFixed(2)} A`,
    measuredValue: `${measured.currentA.toFixed(2)} A`,
    unit: 'A',
    status: currentStatus,
    deviationPercent: Number(currentDiffPercent.toFixed(1)),
    notes: `Expected ~${expCurrent}A for ${reference.powerW}W load`,
  })

  // 4. Resistance Evaluation
  const expResistance = reference.resistanceOhm
  const resDiff = measured.resistanceOhm - expResistance
  const resDiffPercent = (Math.abs(resDiff) / expResistance) * 100

  let resistanceStatus: TestResultStatus = 'PASS'
  if (measured.resistanceOhm > 500 || !measured.continuity) {
    resistanceStatus = 'FAIL'
    faults.push({
      id: 'fault-resistance-infinite',
      severity: 'CRITICAL',
      title: 'High / Infinite Circuit Resistance',
      description: `Circuit resistance (${measured.resistanceOhm > 500 ? '>500 Ω' : measured.resistanceOhm.toFixed(2) + ' Ω'}) indicates open line.`,
      possibleCauses: [
        'Possible Cause: Blown bulb filament or unseated lamp socket',
        'Possible Cause: Heavily corroded terminal lugs or disconnected ground strap',
      ],
    })
  } else if (resDiffPercent > tolerances.resistance.failPercent) {
    resistanceStatus = 'FAIL'
    if (measured.resistanceOhm < expResistance) {
      faults.push({
        id: 'fault-resistance-low',
        severity: 'CRITICAL',
        title: 'Abnormally Low Circuit Resistance',
        description: `Measured resistance is only ${measured.resistanceOhm.toFixed(2)} Ω (expected ${expResistance.toFixed(2)} Ω).`,
        possibleCauses: [
          'Possible Cause: Pinched harness insulation shorting conductors',
          'Possible Cause: Incorrect lower-impedance load installed',
        ],
      })
    } else {
      faults.push({
        id: 'fault-resistance-high',
        severity: 'CRITICAL',
        title: 'High Circuit Resistance',
        description: `Resistance is ${measured.resistanceOhm.toFixed(2)} Ω (expected ${expResistance.toFixed(2)} Ω).`,
        possibleCauses: [
          'Possible Cause: Oxidized switch contacts or corroded splice',
          'Possible Cause: Faulty lamp holder spring contact',
        ],
      })
    }
  } else if (resDiffPercent > tolerances.resistance.warnPercent) {
    resistanceStatus = 'WARNING'
    faults.push({
      id: 'fault-resistance-warn',
      severity: 'WARNING',
      title: 'Moderate Resistance Deviation',
      description: `Resistance of ${measured.resistanceOhm.toFixed(2)} Ω deviates by ${resDiffPercent.toFixed(1)}%.`,
      possibleCauses: ['Possible Cause: Warm filament or minor connector wear'],
    })
  }

  testResults.push({
    testName: 'Resistance',
    expectedValue: `${expResistance.toFixed(2)} Ω`,
    measuredValue: `${measured.resistanceOhm.toFixed(2)} Ω`,
    unit: 'Ω',
    status: resistanceStatus,
    deviationPercent: Number(resDiffPercent.toFixed(1)),
    notes: `Calculated from R = V² / P`,
  })

  // 5. Fuse Evaluation
  const expFuse = reference.fuseRatingA
  let fuseStatus: TestResultStatus = 'PASS'

  if (measured.fuseBlown) {
    fuseStatus = 'FAIL'
    faults.push({
      id: 'fault-fuse-blown',
      severity: 'CRITICAL',
      title: 'Circuit Fuse Blown',
      description: `The fuse on the ${reference.name} branch has blown due to overcurrent or a short circuit.`,
      possibleCauses: [
        'Possible Cause: Short circuit in wiring loom touching tractor frame',
        'Possible Cause: Inrush surge from defective component',
        'Possible Cause: Fuse fatigue under sustained high load',
      ],
    })
  } else {
    const fuseDiff = Math.abs(measured.fuseInstalledA - expFuse)
    const fuseDiffPercent = (fuseDiff / expFuse) * 100

    if (fuseDiffPercent > tolerances.fuse.tolerancePercent) {
      if (measured.fuseInstalledA > expFuse * 1.5) {
        fuseStatus = 'WARNING'
        faults.push({
          id: 'fault-fuse-oversized',
          severity: 'WARNING',
          title: 'Oversized Fuse Installed (Fire Risk)',
          description: `Installed fuse is rated at ${measured.fuseInstalledA}A, whereas reference standard is ${expFuse.toFixed(2)}A (1.25 × I_load).`,
          possibleCauses: [
            'Possible Cause: Incorrect replacement fuse inserted by operator',
            'Possible Cause: High risk of harness melting in case of fault before fuse trips',
          ],
        })
      } else if (measured.fuseInstalledA < expFuse * 0.7) {
        fuseStatus = 'WARNING'
        faults.push({
          id: 'fault-fuse-undersized',
          severity: 'WARNING',
          title: 'Undersized Fuse Installed',
          description: `Installed fuse (${measured.fuseInstalledA}A) is below required rating of ${expFuse.toFixed(2)}A.`,
          possibleCauses: ['Possible Cause: Fuse may blow nuisance trips during normal operation'],
        })
      }
    }
  }

  testResults.push({
    testName: 'Fuse',
    expectedValue: `${expFuse.toFixed(2)} A (Intact)`,
    measuredValue: measured.fuseBlown
      ? `Blown (${measured.fuseInstalledA}A)`
      : `${measured.fuseInstalledA.toFixed(1)} A (Intact)`,
    unit: 'A',
    status: fuseStatus,
    notes: `Reference standard: 1.25 × I_load (${expFuse.toFixed(2)}A)`,
  })

  // 6. Temperature Evaluation
  let tempStatus: TestResultStatus = 'PASS'
  if (measured.temperatureC > tolerances.temperature.criticalMaxC) {
    tempStatus = 'FAIL'
    faults.push({
      id: 'fault-temp-critical',
      severity: 'CRITICAL',
      title: 'High Thermal Stress Detected',
      description: `Sensor measured ${measured.temperatureC.toFixed(1)}°C at circuit connector/junction (critical threshold is ${tolerances.temperature.criticalMaxC}°C).`,
      possibleCauses: [
        'Possible Cause: Severe contact resistance generating Joule heating (I²R)',
        'Possible Cause: Overcurrent through undersized conductor gauge',
        'Possible Cause: Proximity to hot tractor engine manifold without heat shield',
      ],
    })
  } else if (measured.temperatureC > tolerances.temperature.warningMaxC) {
    tempStatus = 'WARNING'
    faults.push({
      id: 'fault-temp-warn',
      severity: 'WARNING',
      title: 'Elevated Connector Temperature',
      description: `Operating temperature is ${measured.temperatureC.toFixed(1)}°C (normal range < ${tolerances.temperature.normalMaxC}°C).`,
      possibleCauses: [
        'Possible Cause: Loose terminal crimp causing slight localized heating',
        'Possible Cause: High ambient operating environment',
      ],
    })
  }

  testResults.push({
    testName: 'Temperature',
    expectedValue: `< ${tolerances.temperature.normalMaxC} °C`,
    measuredValue: `${measured.temperatureC.toFixed(1)} °C`,
    unit: '°C',
    status: tempStatus,
    notes:
      tempStatus === 'PASS'
        ? 'Thermal parameters within normal operating envelope'
        : tempStatus === 'WARNING'
          ? 'Elevated junction heat'
          : 'Critical overheating risk',
  })

  // Determine Overall Status
  let overallStatus: TestResultStatus = 'PASS'
  const hasFail = testResults.some((t) => t.status === 'FAIL')
  const hasWarn = testResults.some((t) => t.status === 'WARNING')

  if (hasFail) {
    overallStatus = 'FAIL'
  } else if (hasWarn) {
    overallStatus = 'WARNING'
  }

  let summary = ''
  if (overallStatus === 'PASS') {
    summary = `All 6 electrical parameters for the ${reference.name} circuit conform to standard tractor specifications. Circuit is in healthy operational condition.`
  } else if (overallStatus === 'WARNING') {
    summary = `Circuit demonstrates minor parameter deviations. ${faults.length} warning item(s) detected. Recommend preventive inspection of terminals and harness.`
  } else {
    summary = `Circuit test FAILED. ${faults.length} critical fault(s) identified. Immediate electrical maintenance and repair required prior to tractor field operation.`
  }

  return {
    overallStatus,
    testResults,
    faults,
    summary,
  }
}
