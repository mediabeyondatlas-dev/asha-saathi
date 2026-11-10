import { useEffect, useMemo, useState } from 'react'
import { STRINGS, VACCINES, type I18nKey, type Lang } from './data'
import {
  ageInDays, ageLabel, clearDemo, computeStats, loadDB, saveDB, today, uid,
  type DB, type Household, type Person, type Visit,
} from './store'
import Triage from './Triage'

type View = 'dashboard' | 'households' | 'visits' | 'triage' | 'vaccines' | 'referrals'

interface DueVaccine {
  child: Person
  household: Household
  vaccineId: string
  vaccineName: string
  ageLabel: string
  overdue: boolean
  dueDays: number
}

export default function App() {
  const [lang, setLang] = useState<Lang>('en')
  const [db, setDb] = useState<DB>(() => loadDB())
  const [view, setView] = useState<View>('dashboard')

  const t = (k: I18nKey) => STRINGS[k][lang]

  useEffect(() => { saveDB(db) }, [db])

  const dueVaccines = useMemo<DueVaccine[]>(() => {
    const out: DueVaccine[] = []
    for (const h of db.households) {
      for (const p of h.members) {
        const age = ageInDays(p.dob)
        if (age < 0 || age > 5840 + 365) continue
        for (const v of VACCINES) {
          if (age < v.days) continue
          const given = db.vaccinesGiven.some((g) => g.childId === p.id && g.vaccineId === v.id)
          if (given) continue
          out.push({
            child: p, household: h, vaccineId: v.id,
            vaccineName: lang === 'hi' ? v.nameHi : v.nameEn,
            ageLabel: lang === 'hi' ? v.ageLabelHi : v.ageLabelEn,
            overdue: age > v.days + v.windowDays,
            dueDays: age - v.days,
          })
        }
      }
    }
    return out.sort((a, b) => (b.overdue ? 1 : 0) - (a.overdue ? 1 : 0) || b.dueDays - a.dueDays)
  }, [db, lang])

  const stats = useMemo(
    () => computeStats(
      db,
      dueVaccines.filter((d) => !d.overdue).length,
      dueVaccines.filter((d) => d.overdue).length,
    ),
    [db, dueVaccines],
  )

  const hasDemo = db.households.some((h) => h.demo)

  function exportStats() {
    const payload = {
      app: 'ASHA Saathi',
      exportedAt: new Date().toISOString(),
      stats,
      counts: {
        households: db.households.length,
        visits: db.visits.length,
        referrals: db.referrals.length,
        vaccinesGiven: db.vaccinesGiven.length,
      },
      note: 'Counts include demo data where flagged demo:true. Real field evidence = visits with demo:false.',
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `asha-saathi-stats-${today()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const tabs: { id: View; label: string }[] = [
    { id: 'dashboard', label: t('dashboard') },
    { id: 'households', label: t('households') },
    { id: 'visits', label: t('visits') },
    { id: 'triage', label: t('triage') },
    { id: 'vaccines', label: t('vaccines') },
    { id: 'referrals', label: t('referrals') },
  ]

  return (
    <div className="app">
      <header className="top">
        <div>
          <h1>ASHA <span>Saathi</span> 🇮🇳</h1>
          <p>{t('tagline')}</p>
        </div>
        <button className="lang-toggle" onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}>
          {lang === 'en' ? 'हिन्दी' : 'English'}
        </button>
      </header>

      <nav className="tabs">
        {tabs.map((tab) => (
          <button key={tab.id} className={view === tab.id ? 'active' : ''} onClick={() => setView(tab.id)}>
            {tab.label}
          </button>
        ))}
      </nav>

      {hasDemo && (
        <div className="banner amber">
          {t('demoData')}{' '}
          <button className="btn secondary" style={{ marginLeft: 8, padding: '6px 12px' }} onClick={() => setDb(clearDemo(db))}>
            {t('clearDemo')}
          </button>
        </div>
      )}

      {view === 'dashboard' && (
        <Dashboard db={db} stats={stats} dueVaccines={dueVaccines} t={t} onExport={exportStats} onGo={setView} />
      )}
      {view === 'households' && <Households db={db} setDb={setDb} t={t} lang={lang} />}
      {view === 'visits' && <Visits db={db} setDb={setDb} t={t} />}
      {view === 'triage' && <Triage db={db} setDb={setDb} t={t} lang={lang} />}
      {view === 'vaccines' && <Vaccines db={db} setDb={setDb} dueVaccines={dueVaccines} t={t} />}
      {view === 'referrals' && <Referrals db={db} t={t} />}

      <footer>
        <p>{t('offlineNote')}</p>
        <p>{t('disclaimer')}</p>
        <p>ASHA Saathi · Track 06 Health · Code for a Billion 2026 · MIT License</p>
      </footer>
    </div>
  )
}

// --- Dashboard -------------------------------------------------------------

function Dashboard({ db, stats, dueVaccines, t, onExport, onGo }: {
  db: DB
  stats: ReturnType<typeof computeStats>
  dueVaccines: DueVaccine[]
  t: (k: I18nKey) => string
  onExport: () => void
  onGo: (v: View) => void
}) {
  const pregnant = db.households.flatMap((h) => h.members.map((m) => ({ h, m }))).filter((x) => x.m.pregnant)
  const followups = db.visits.filter((v) => v.outcome === 'followup')

  return (
    <>
      <div className="stats">
        <div className="stat"><b>{stats.households}</b><span>{t('households')}</span></div>
        <div className="stat"><b>{stats.people}</b><span>{t('members')}</span></div>
        <div className="stat"><b>{stats.pregnantWomen}</b><span>{t('pregnant')}</span></div>
        <div className="stat"><b>{stats.visits}</b><span>{t('visitsLogged')}</span></div>
        <div className="stat alert"><b>{stats.redFlags}</b><span>{t('redFlags')}</span></div>
        <div className="stat"><b>{stats.referrals}</b><span>{t('referralsMade')}</span></div>
        <div className="stat alert"><b>{stats.vaccinesDue + stats.vaccinesOverdue}</b><span>{t('vaccinesDue')}</span></div>
        <div className="stat"><b>{stats.realVisits}</b><span>Real visits (non-demo)</span></div>
      </div>

      <div className="card">
        <h2>{t('todayPlan')}</h2>
        {dueVaccines.length === 0 && pregnant.length === 0 && followups.length === 0 && (
          <p className="muted">Nothing pending today. Add households and children to build the plan.</p>
        )}
        {dueVaccines.length > 0 && (
          <>
            <h3>💉 {t('vaccinesDue')} ({dueVaccines.length})</h3>
            <table>
              <tbody>
                {dueVaccines.slice(0, 8).map((d) => (
                  <tr key={d.child.id + d.vaccineId}>
                    <td>{d.child.name} <span className="muted">({d.household.head}, {d.household.village})</span></td>
                    <td>{d.vaccineName} · {d.ageLabel}</td>
                    <td>{d.overdue
                      ? <span className="pill red">{t('overdue')}</span>
                      : <span className="pill amber">{t('dueNow')}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {dueVaccines.length > 8 && <p className="muted">+ {dueVaccines.length - 8} more — see the Vaccines tab.</p>}
          </>
        )}
        {pregnant.length > 0 && (
          <>
            <h3>🤰 {t('pregnant')} ({pregnant.length})</h3>
            <ul>
              {pregnant.map(({ h, m }) => (
                <li key={m.id}>{m.name} <span className="muted">— {h.head}, {h.village}</span></li>
              ))}
            </ul>
          </>
        )}
        {followups.length > 0 && (
          <>
            <h3>🔁 {t('followUp')} ({followups.length})</h3>
            <ul>
              {followups.map((v) => {
                const h = db.households.find((x) => x.id === v.householdId)
                const p = h?.members.find((m) => m.id === v.personId)
                return <li key={v.id}>{p?.name ?? '?'} <span className="muted">— {v.date} · {v.notes}</span></li>
              })}
            </ul>
          </>
        )}
        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn" onClick={() => onGo('triage')}>{t('startTriage')}</button>
          <button className="btn secondary" onClick={onExport}>{t('exportStats')}</button>
        </div>
      </div>
    </>
  )
}

// --- Households ------------------------------------------------------------

function Households({ db, setDb, t, lang }: { db: DB; setDb: (d: DB) => void; t: (k: I18nKey) => string; lang: Lang }) {
  const [head, setHead] = useState('')
  const [village, setVillage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [memberForm, setMemberForm] = useState<string | null>(null)
  const [mName, setMName] = useState('')
  const [mSex, setMSex] = useState<'F' | 'M'>('F')
  const [mDob, setMDob] = useState('')
  const [mPreg, setMPreg] = useState(false)

  function addHousehold() {
    if (!head.trim() || !village.trim()) return
    const h: Household = {
      id: uid(), head: head.trim(), village: village.trim(), members: [],
    }
    setDb({ ...db, households: [...db.households, h] })
    setHead(''); setVillage(''); setShowForm(false)
  }

  function addMember(householdId: string) {
    if (!mName.trim()) return
    const person: Person = { id: uid(), name: mName.trim(), sex: mSex, dob: mDob, pregnant: mSex === 'F' && mPreg }
    setDb({
      ...db,
      households: db.households.map((h) => h.id === householdId ? { ...h, members: [...h.members, person] } : h),
    })
    setMName(''); setMDob(''); setMPreg(false); setMemberForm(null)
  }

  return (
    <>
      <div className="card">
        <div className="row space">
          <h2 style={{ margin: 0 }}>{t('households')} ({db.households.length})</h2>
          <button className="btn" onClick={() => setShowForm(!showForm)}>{t('addHousehold')}</button>
        </div>
        {showForm && (
          <div style={{ marginTop: 12 }}>
            <label className="field"><span>{t('headOfFamily')}</span>
              <input type="text" value={head} onChange={(e) => setHead(e.target.value)} placeholder="e.g. Sunita Devi" />
            </label>
            <label className="field"><span>{t('village')}</span>
              <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} placeholder="e.g. Rampur" />
            </label>
            <button className="btn" onClick={addHousehold}>{t('save')}</button>
          </div>
        )}
      </div>

      {db.households.map((h) => (
        <div className="card" key={h.id}>
          <div className="row space">
            <h2 style={{ margin: 0 }}>{h.head} <span className="muted">· {h.village}</span></h2>
            <button className="btn secondary" onClick={() => setMemberForm(memberForm === h.id ? null : h.id)}>+ {t('members')}</button>
          </div>
          {memberForm === h.id && (
            <div style={{ marginTop: 10 }}>
              <label className="field"><span>{t('name')}</span>
                <input type="text" value={mName} onChange={(e) => setMName(e.target.value)} />
              </label>
              <div className="row">
                <label className="field" style={{ flex: 1 }}><span>Sex</span>
                  <select value={mSex} onChange={(e) => setMSex(e.target.value as 'F' | 'M')}>
                    <option value="F">Female</option>
                    <option value="M">Male</option>
                  </select>
                </label>
                <label className="field" style={{ flex: 2 }}><span>{t('dob')}</span>
                  <input type="date" value={mDob} onChange={(e) => setMDob(e.target.value)} />
                </label>
              </div>
              {mSex === 'F' && (
                <label className="field">
                  <input type="checkbox" checked={mPreg} onChange={(e) => setMPreg(e.target.checked)} /> {t('pregnant')}
                </label>
              )}
              <button className="btn" onClick={() => addMember(h.id)}>{t('save')}</button>
            </div>
          )}
          {h.members.length === 0 && <p className="muted">No members yet — add the family members.</p>}
          <table>
            <tbody>
              {h.members.map((m) => (
                <tr key={m.id}>
                  <td>{m.name} {m.demo && <span className="pill grey">demo</span>}</td>
                  <td>{m.sex === 'F' ? '♀' : '♂'} · {t('age')}: {ageLabel(m.dob)}</td>
                  <td>{m.pregnant && <span className="pill amber">{lang === 'hi' ? 'गर्भवती' : 'Pregnant'}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  )
}

// --- Visits ----------------------------------------------------------------

function Visits({ db, setDb, t }: { db: DB; setDb: (d: DB) => void; t: (k: I18nKey) => string }) {
  const [householdId, setHouseholdId] = useState(db.households[0]?.id ?? '')
  const [personId, setPersonId] = useState('')
  const [kind, setKind] = useState<Visit['kind']>('routine')
  const [outcome, setOutcome] = useState<Visit['outcome']>('ok')
  const [notes, setNotes] = useState('')

  const household = db.households.find((h) => h.id === householdId)
  const person = household?.members.find((m) => m.id === personId) ?? household?.members[0]

  function logVisit() {
    if (!household || !person) return
    const v: Visit = {
      id: uid(), householdId: household.id, personId: person.id,
      date: today(), kind, notes: notes.trim(), outcome,
    }
    setDb({ ...db, visits: [v, ...db.visits] })
    setNotes('')
  }

  return (
    <>
      <div className="card">
        <h2>{t('logVisit')}</h2>
        {db.households.length === 0 && <p className="muted">Add a household first.</p>}
        {db.households.length > 0 && (
          <>
            <label className="field"><span>{t('household')}</span>
              <select value={householdId} onChange={(e) => { setHouseholdId(e.target.value); setPersonId('') }}>
                {db.households.map((h) => <option key={h.id} value={h.id}>{h.head} · {h.village}</option>)}
              </select>
            </label>
            <label className="field"><span>{t('members')}</span>
              <select value={person?.id ?? ''} onChange={(e) => setPersonId(e.target.value)}>
                {household?.members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </label>
            <div className="row">
              <label className="field" style={{ flex: 1 }}><span>Type</span>
                <select value={kind} onChange={(e) => setKind(e.target.value as Visit['kind'])}>
                  <option value="routine">{t('routine')}</option>
                  <option value="triage">{t('triage')}</option>
                  <option value="immunization">{t('vaccines')}</option>
                </select>
              </label>
              <label className="field" style={{ flex: 1 }}><span>{t('outcome')}</span>
                <select value={outcome} onChange={(e) => setOutcome(e.target.value as Visit['outcome'])}>
                  <option value="ok">{t('routine')}</option>
                  <option value="followup">{t('followUp')}</option>
                  <option value="refer">{t('referrals')}</option>
                </select>
              </label>
            </div>
            <label className="field"><span>{t('notes')}</span>
              <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>
            <button className="btn" onClick={logVisit} disabled={!person}>{t('save')}</button>
          </>
        )}
      </div>

      {db.visits.map((v) => {
        const h = db.households.find((x) => x.id === v.householdId)
        const p = h?.members.find((m) => m.id === v.personId)
        return (
          <div className="card" key={v.id}>
            <div className="row space">
              <b>{p?.name ?? '?'} <span className="muted">· {h?.head}, {h?.village}</span></b>
              <span className="muted">{v.date}</span>
            </div>
            <p>
              <span className={`pill ${v.outcome === 'refer' ? 'red' : v.outcome === 'followup' ? 'amber' : 'green'}`}>
                {v.outcome === 'refer' ? t('referrals') : v.outcome === 'followup' ? t('followUp') : t('routine')}
              </span>{' '}
              <span className="pill grey">{v.kind}</span>{' '}
              {v.demo && <span className="pill grey">demo</span>}
            </p>
            {v.notes && <p>{v.notes}</p>}
          </div>
        )
      })}
    </>
  )
}

// --- Vaccines --------------------------------------------------------------

function Vaccines({ db, setDb, dueVaccines, t }: {
  db: DB
  setDb: (d: DB) => void
  dueVaccines: DueVaccine[]
  t: (k: I18nKey) => string
}) {
  function markGiven(childId: string, vaccineId: string) {
    setDb({
      ...db,
      vaccinesGiven: [...db.vaccinesGiven, { childId, vaccineId, date: today() }],
    })
  }

  const byChild = new Map<string, DueVaccine[]>()
  for (const d of dueVaccines) {
    const list = byChild.get(d.child.id) ?? []
    list.push(d)
    byChild.set(d.child.id, list)
  }

  return (
    <>
      <div className="card">
        <h2>{t('vaccinesDue')} ({dueVaccines.length})</h2>
        <p className="muted">Universal Immunisation Programme (India). * JE only in endemic districts.</p>
      </div>
      {dueVaccines.length === 0 && (
        <div className="banner green">All recorded children are up to date on vaccines. 🎉</div>
      )}
      {[...byChild.entries()].map(([childId, list]) => {
        const child = db.households.flatMap((h) => h.members).find((m) => m.id === childId)!
        const household = db.households.find((h) => h.members.some((m) => m.id === childId))!
        return (
          <div className="card" key={childId}>
            <h2 style={{ margin: 0 }}>{child.name} <span className="muted">· {t('age')}: {ageLabel(child.dob)} · {household.head}, {household.village}</span></h2>
            <table>
              <tbody>
                {list.map((d) => (
                  <tr key={d.vaccineId}>
                    <td>{d.vaccineName}</td>
                    <td>{d.ageLabel}</td>
                    <td>{d.overdue ? <span className="pill red">{t('overdue')}</span> : <span className="pill amber">{t('dueNow')}</span>}</td>
                    <td><button className="btn secondary" style={{ padding: '6px 12px' }} onClick={() => markGiven(childId, d.vaccineId)}>{t('markGiven')}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </>
  )
}

// --- Referrals -------------------------------------------------------------

function Referrals({ db, t }: { db: DB; t: (k: I18nKey) => string }) {
  return (
    <>
      <div className="card">
        <h2>{t('referrals')} ({db.referrals.length})</h2>
        <p className="muted">Referrals created from triage. Each slip can be copied as text to share on WhatsApp or print.</p>
      </div>
      {db.referrals.length === 0 && <p className="muted">No referrals yet — run a triage and a red flag will create one.</p>}
      {db.referrals.map((r) => (
        <div className="card" key={r.id}>
          <div className="row space">
            <b>{r.personName}</b>
            <span className="muted">{r.date}</span>
          </div>
          <p>{t('reason')}: {r.reason}</p>
          <p>{t('facility')}: {r.facility}</p>
          {r.demo && <span className="pill grey">demo</span>}
        </div>
      ))}
    </>
  )
}
