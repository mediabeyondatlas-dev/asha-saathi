// ---------------------------------------------------------------------------
// ASHA Saathi — local data store. Everything lives in localStorage on the
// worker's phone: no account, no server, no data leaves the device.
// ---------------------------------------------------------------------------

export interface Person {
  id: string
  name: string
  sex: 'F' | 'M'
  /** YYYY-MM-DD, empty when unknown */
  dob: string
  pregnant: boolean
  demo?: boolean
}

export interface Household {
  id: string
  head: string
  village: string
  members: Person[]
  demo?: boolean
}

export interface Visit {
  id: string
  householdId: string
  personId: string
  date: string // YYYY-MM-DD
  kind: 'routine' | 'triage' | 'immunization'
  notes: string
  outcome: 'ok' | 'refer' | 'followup'
  demo?: boolean
}

export interface VaccineGiven {
  childId: string
  vaccineId: string
  date: string // YYYY-MM-DD
}

export interface Referral {
  id: string
  householdId: string
  personName: string
  reason: string
  facility: string
  date: string
  demo?: boolean
}

export interface DB {
  households: Household[]
  visits: Visit[]
  vaccinesGiven: VaccineGiven[]
  referrals: Referral[]
  seeded: boolean
}

const KEY = 'asha-saathi-db-v1'

function uid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4)
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function seedDB(): DB {
  // Demo village: clearly flagged demo:true everywhere.
  const h1: Household = {
    id: uid(), head: 'Sunita Devi', village: 'Rampur', demo: true,
    members: [
      { id: uid(), name: 'Sunita Devi', sex: 'F', dob: '1998-04-12', pregnant: true, demo: true },
      { id: uid(), name: 'Aarav', sex: 'M', dob: daysAgo(72), pregnant: false, demo: true },
    ],
  }
  const h2: Household = {
    id: uid(), head: 'Ramesh Kumar', village: 'Rampur', demo: true,
    members: [
      { id: uid(), name: 'Meena Kumari', sex: 'F', dob: '2001-09-03', pregnant: false, demo: true },
      { id: uid(), name: 'Priya', sex: 'F', dob: daysAgo(290), pregnant: false, demo: true },
    ],
  }
  const h3: Household = {
    id: uid(), head: 'Geeta Yadav', village: 'Rampur', demo: true,
    members: [
      { id: uid(), name: 'Geeta Yadav', sex: 'F', dob: '1995-01-20', pregnant: false, demo: true },
      { id: uid(), name: 'Rohan', sex: 'M', dob: daysAgo(12), pregnant: false, demo: true },
    ],
  }
  const visits: Visit[] = [
    {
      id: uid(), householdId: h1.id, personId: h1.members[0].id, date: daysAgo(2),
      kind: 'routine', notes: 'ANC check-up: BP normal, IFA given, next visit in 2 weeks.', outcome: 'ok', demo: true,
    },
    {
      id: uid(), householdId: h2.id, personId: h2.members[1].id, date: daysAgo(5),
      kind: 'immunization', notes: 'MR-1 due at 9 months — counselled mother, session on Friday.', outcome: 'followup', demo: true,
    },
  ]
  return {
    households: [h1, h2, h3],
    visits,
    vaccinesGiven: [
      { childId: h1.members[1].id, vaccineId: 'bcg', date: daysAgo(72) },
      { childId: h1.members[1].id, vaccineId: 'opv0', date: daysAgo(72) },
      { childId: h1.members[1].id, vaccineId: 'penta1', date: daysAgo(30) },
      { childId: h1.members[1].id, vaccineId: 'opv1', date: daysAgo(30) },
    ],
    referrals: [],
    seeded: true,
  }
}

export function loadDB(): DB {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as DB
  } catch {
    // fall through to seed
  }
  const db = seedDB()
  saveDB(db)
  return db
}

export function saveDB(db: DB): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(db))
  } catch {
    // storage full / private mode — app keeps working in memory
  }
}

export function clearDemo(db: DB): DB {
  return {
    households: db.households.filter((h) => !h.demo),
    visits: db.visits.filter((v) => !v.demo),
    vaccinesGiven: db.vaccinesGiven.filter((v) => {
      const child = db.households.flatMap((h) => h.members).find((m) => m.id === v.childId)
      return child ? !child.demo : true
    }),
    referrals: db.referrals.filter((r) => !r.demo),
    seeded: false,
  }
}

export function ageInDays(dob: string): number {
  if (!dob) return -1
  const birth = new Date(dob + 'T00:00:00')
  return Math.floor((Date.now() - birth.getTime()) / 86400000)
}

export function ageLabel(dob: string): string {
  const days = ageInDays(dob)
  if (days < 0) return '—'
  if (days < 30) return `${days}d`
  if (days < 365) return `${Math.floor(days / 30)}mo`
  const y = Math.floor(days / 365)
  const m = Math.floor((days % 365) / 30)
  return m > 0 ? `${y}y ${m}mo` : `${y}y`
}

export interface Stats {
  households: number
  people: number
  pregnantWomen: number
  childrenUnder5: number
  visits: number
  redFlags: number
  referrals: number
  vaccinesDue: number
  vaccinesOverdue: number
  realVisits: number // non-demo visits = field evidence
}

export function computeStats(db: DB, vaccinesDue: number, vaccinesOverdue: number): Stats {
  const people = db.households.flatMap((h) => h.members)
  return {
    households: db.households.length,
    people: people.length,
    pregnantWomen: people.filter((p) => p.pregnant).length,
    childrenUnder5: people.filter((p) => ageInDays(p.dob) >= 0 && ageInDays(p.dob) < 1825).length,
    visits: db.visits.length,
    redFlags: db.visits.filter((v) => v.outcome === 'refer').length,
    referrals: db.referrals.length,
    vaccinesDue,
    vaccinesOverdue,
    realVisits: db.visits.filter((v) => !v.demo).length,
  }
}

export { uid, today, daysAgo }
