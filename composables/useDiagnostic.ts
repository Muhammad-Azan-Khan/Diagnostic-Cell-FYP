import type {
  AppSettings,
  CircuitType,
  DiagnosticSession,
  HardwareStatus,
  TractorProfile,
} from '~/app/types/diagnostic'
import { INITIAL_SESSIONS, INITIAL_TRACTORS } from '~/app/data/initialHistory'

const STORAGE_KEYS = {
  tractors: 'diagnostic_cell_tractors_v1',
  activeTractor: 'diagnostic_cell_active_tractor_v1',
  sessions: 'diagnostic_cell_sessions_v1',
  settings: 'diagnostic_cell_settings_v1',
} as const

const defaultSettings: AppSettings = {
  theme: 'light',
  technicianName: 'Engr. Ahmad',
  voltageTolerancePercent: 10,
  currentTolerancePercent: 15,
  resistanceTolerancePercent: 15,
  maxNormalTempC: 50,
  measurementUnit: 'metric',
}

const defaultHardware: HardwareStatus = {
  esp32: true,
  voltageSensor: true,
  currentSensor: true,
  tempSensor: true,
  continuityModule: true,
  baudRate: 115200,
  comPort: 'COM3 (USB Serial / ESP32-WROOM)',
}

export const useDiagnostic = () => {
  const tractors = useState<TractorProfile[]>('tractors', () => structuredClone(INITIAL_TRACTORS))
  const activeTractor = useState<TractorProfile>('active-tractor', () =>
    structuredClone(INITIAL_TRACTORS[0]!),
  )
  const sessions = useState<DiagnosticSession[]>('sessions', () =>
    structuredClone(INITIAL_SESSIONS),
  )
  const settings = useState<AppSettings>('settings', () => ({ ...defaultSettings }))
  const selectedCircuitId = useState<CircuitType>('selected-circuit', () => 'horn')
  const selectedSessionForModal = useState<DiagnosticSession | null>('session-modal', () => null)
  const hardwareStatus = useState<HardwareStatus>('hardware-status', () => ({ ...defaultHardware }))
  const hydrated = useState('diagnostic-hydrated', () => false)

  const latestSession = computed(() => sessions.value[0] ?? null)

  function hydrate() {
    if (!import.meta.client || hydrated.value) return
    const load = <T>(key: string, fallback: T): T => {
      try {
        return JSON.parse(localStorage.getItem(key) || '') as T
      } catch {
        return fallback
      }
    }
    tractors.value = load(STORAGE_KEYS.tractors, tractors.value)
    activeTractor.value = load(STORAGE_KEYS.activeTractor, activeTractor.value)
    sessions.value = load(STORAGE_KEYS.sessions, sessions.value)
    settings.value = { ...defaultSettings, ...load(STORAGE_KEYS.settings, settings.value) }
    hydrated.value = true
    applyTheme()
  }

  function persist() {
    if (!import.meta.client || !hydrated.value) return
    localStorage.setItem(STORAGE_KEYS.tractors, JSON.stringify(tractors.value))
    localStorage.setItem(STORAGE_KEYS.activeTractor, JSON.stringify(activeTractor.value))
    localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions.value))
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings.value))
  }

  function applyTheme() {
    if (import.meta.client)
      document.documentElement.classList.toggle('dark', settings.value.theme === 'dark')
  }

  function setActiveTractor(tractor: TractorProfile) {
    activeTractor.value = { ...tractor }
    persist()
  }
  function setSelectedSessionForModal(session: DiagnosticSession | null) {
    selectedSessionForModal.value = session
  }
  function setSelectedCircuitId(id: CircuitType) {
    selectedCircuitId.value = id
  }

  function saveTractor(data: Omit<TractorProfile, 'id' | 'savedAt' | 'totalScans'>) {
    const index = tractors.value.findIndex(
      (t) => t.chassisNumber.trim().toUpperCase() === data.chassisNumber.trim().toUpperCase(),
    )
    const now = new Date()
    const savedAt = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    const tractor: TractorProfile =
      index >= 0
        ? {
            ...tractors.value[index]!,
            ...data,
            chassisNumber: data.chassisNumber.toUpperCase(),
            savedAt,
          }
        : {
            ...data,
            id: `tr-${Date.now()}`,
            chassisNumber: data.chassisNumber.toUpperCase(),
            tractorId: data.tractorId || `TR-${Math.floor(100 + Math.random() * 900)}`,
            technicianName: data.technicianName || settings.value.technicianName,
            savedAt,
            totalScans: 0,
          }
    if (index >= 0) tractors.value[index] = tractor
    else tractors.value.unshift(tractor)
    activeTractor.value = { ...tractor }
    persist()
    return tractor
  }

  function updateTractor(id: string, data: Omit<TractorProfile, 'id' | 'savedAt' | 'totalScans'>) {
    const index = tractors.value.findIndex((tractor) => tractor.id === id)
    if (index < 0) return null
    const duplicateChassis = tractors.value.some(
      (tractor) =>
        tractor.id !== id &&
        tractor.chassisNumber.trim().toUpperCase() === data.chassisNumber.trim().toUpperCase(),
    )
    if (duplicateChassis) return null

    const now = new Date()
    const savedAt = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    const updated: TractorProfile = {
      ...tractors.value[index]!,
      ...data,
      id,
      chassisNumber: data.chassisNumber.toUpperCase(),
      savedAt,
    }
    tractors.value[index] = updated
    if (activeTractor.value.id === id) activeTractor.value = { ...updated }
    persist()
    return updated
  }

  function deleteTractor(id: string) {
    tractors.value = tractors.value.filter((t) => t.id !== id)
    if (activeTractor.value.id === id)
      activeTractor.value = { ...(tractors.value[0] || INITIAL_TRACTORS[0]!) }
    persist()
  }

  function addDiagnosticSession(session: DiagnosticSession) {
    sessions.value.unshift(session)
    tractors.value = tractors.value.map((t) =>
      t.id === activeTractor.value.id ||
      t.chassisNumber.toUpperCase() === session.chassisNumber.toUpperCase()
        ? { ...t, totalScans: (t.totalScans || 0) + 1, lastStatus: session.overallStatus }
        : t,
    )
    activeTractor.value = {
      ...activeTractor.value,
      totalScans: (activeTractor.value.totalScans || 0) + 1,
      lastStatus: session.overallStatus,
    }
    persist()
  }

  function deleteSession(id: string) {
    sessions.value = sessions.value.filter((s) => s.id !== id)
    persist()
  }
  function updateSettings(next: Partial<AppSettings>) {
    settings.value = { ...settings.value, ...next }
    applyTheme()
    persist()
  }
  function toggleHardwareMockState(sensor: keyof Omit<HardwareStatus, 'baudRate' | 'comPort'>) {
    hardwareStatus.value[sensor] = !hardwareStatus.value[sensor]
  }
  function resetDemoData() {
    tractors.value = structuredClone(INITIAL_TRACTORS)
    activeTractor.value = structuredClone(INITIAL_TRACTORS[0]!)
    sessions.value = structuredClone(INITIAL_SESSIONS)
    settings.value = { ...defaultSettings }
    selectedCircuitId.value = 'horn'
    hardwareStatus.value = { ...defaultHardware }
    applyTheme()
    persist()
  }

  return {
    tractors,
    activeTractor,
    sessions,
    latestSession,
    settings,
    selectedCircuitId,
    selectedSessionForModal,
    hardwareStatus,
    hydrate,
    saveTractor,
    updateTractor,
    deleteTractor,
    setActiveTractor,
    addDiagnosticSession,
    deleteSession,
    setSelectedCircuitId,
    setSelectedSessionForModal,
    updateSettings,
    toggleHardwareMockState,
    resetDemoData,
  }
}
