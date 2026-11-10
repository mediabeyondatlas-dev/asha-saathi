import { useState } from 'react'
import { TRIAGE_MODULES, type I18nKey, type Lang, type TriageModule } from './data'
import { today, uid, type DB, type Referral, type Visit } from './store'

export default function Triage({ db, setDb, t, lang }: {
  db: DB
  setDb: (d: DB) => void
  t: (k: I18nKey) => string
  lang: Lang
}) {
  const [moduleId, setModuleId] = useState<string | null>(null)
  const [householdId, setHouseholdId] = useState(db.households[0]?.id ?? '')
  const [personId, setPersonId] = useState('')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [done, setDone] = useState(false)
  const [copied, setCopied] = useState(false)

  const mod: TriageModule | undefined = TRIAGE_MODULES.find((m) => m.id === moduleId)
  const household = db.households.find((h) => h.id === householdId)
  const person = household?.members.find((m) => m.id === personId) ?? household?.members[0]

  const redFlags = mod ? mod.questions.filter((q) => answers[q.id] === true && q.redFlag) : []

  function reset() {
    setModuleId(null); setStep(0); setAnswers({}); setDone(false); setCopied(false)
  }

  function answer(yes: boolean) {
    if (!mod) return
    const q = mod.questions[step]
    const next = { ...answers, [q.id]: yes }
    setAnswers(next)
    if (step + 1 < mod.questions.length) {
      setStep(step + 1)
    } else {
      finish(next)
    }
  }

  function finish(finalAnswers: Record<string, boolean>) {
    if (!mod || !household || !person) return
    const flags = mod.questions.filter((q) => finalAnswers[q.id] === true && q.redFlag)
    const outcome: Visit['outcome'] = flags.length > 0 ? 'refer' : 'ok'
    const visit: Visit = {
      id: uid(), householdId: household.id, personId: person.id, date: today(),
      kind: 'triage',
      notes: `${lang === 'hi' ? mod.hi : mod.en}: ${flags.length > 0
        ? `${flags.length} red flag(s): ${flags.map((f) => (lang === 'hi' ? f.hi : f.en)).join('; ')}`
        : 'no danger sign'}`,
      outcome,
    }
    let referrals = db.referrals
    if (flags.length > 0) {
      const ref: Referral = {
        id: uid(), householdId: household.id, personName: person.name,
        reason: flags.map((f) => (lang === 'hi' ? f.hi : f.en)).join('; '),
        facility: lang === 'hi' ? mod.referFacilityHi : mod.referFacilityEn,
        date: today(),
      }
      referrals = [ref, ...db.referrals]
    }
    setDb({ ...db, visits: [visit, ...db.visits], referrals })
    setDone(true)
  }

  function slipText(): string {
    if (!mod || !household || !person) return ''
    const lines = [
      '— ASHA SAATHI · REFERRAL SLIP —',
      `Date: ${today()}`,
      `Patient: ${person.name} (${household.head} family, ${household.village})`,
      `Assessment: ${lang === 'hi' ? mod.hi : mod.en}`,
      `Danger signs found: ${redFlags.map((f) => (lang === 'hi' ? f.hi : f.en)).join('; ')}`,
      `Action: ${lang === 'hi' ? mod.referFacilityHi : mod.referFacilityEn}`,
      'Referred by: ASHA worker (ASHA Saathi app)',
      'Note: Decision support only — not a diagnosis. When in doubt, refer.',
    ]
    return lines.join('\n')
  }

  if (db.households.length === 0) {
    return <div className="card"><p className="muted">Add a household first, then run a triage.</p></div>
  }

  if (!mod) {
    return (
      <div className="card">
        <h2>{t('triage')}</h2>
        <p className="muted">Pick a checklist. The agent asks one question at a time — any YES to a danger sign means refer today.</p>
        {TRIAGE_MODULES.map((m) => (
          <div key={m.id} className="q">
            <p>{lang === 'hi' ? m.hi : m.en}</p>
            <p className="muted">{lang === 'hi' ? m.introHi : m.introEn}</p>
            <button className="btn" onClick={() => { setModuleId(m.id); setStep(0); setAnswers({}); setDone(false) }}>
              {t('startTriage')}
            </button>
          </div>
        ))}
      </div>
    )
  }

  if (done) {
    const isRefer = redFlags.length > 0
    return (
      <div className="card">
        <h2>{lang === 'hi' ? mod.hi : mod.en}</h2>
        {isRefer ? (
          <div className="banner red" style={{ marginTop: 10 }}>
            <b>🚨 {t('referNow')}</b>
            <p style={{ margin: '6px 0 0' }}>{redFlags.length} danger sign(s): {redFlags.map((f) => (lang === 'hi' ? f.hi : f.en)).join('; ')}</p>
            <p style={{ margin: '6px 0 0' }}>{lang === 'hi' ? mod.referFacilityHi : mod.referFacilityEn}</p>
          </div>
        ) : (
          <div className="banner green" style={{ marginTop: 10 }}>
            <b>✅ {t('noDanger')}</b>
            <p style={{ margin: '6px 0 0' }}>{lang === 'hi' ? mod.routineAdviceHi : mod.routineAdviceEn}</p>
          </div>
        )}
        <p className="muted">Visit saved to the log{isRefer ? ' and a referral was created.' : '.'}</p>
        {isRefer && (
          <>
            <h3>{t('referralSlip')}</h3>
            <pre className="slip">{slipText()}</pre>
            <button
              className="btn secondary"
              onClick={() => { navigator.clipboard?.writeText(slipText()).catch(() => undefined); setCopied(true) }}
            >
              {copied ? t('copied') : t('copySlip')}
            </button>
          </>
        )}
        <div style={{ marginTop: 14 }}>
          <button className="btn" onClick={reset}>{t('triage')} — {lang === 'hi' ? 'फिर से' : 'again'}</button>
        </div>
      </div>
    )
  }

  const q = mod.questions[step]
  return (
    <div className="card">
      <div className="row space">
        <h2 style={{ margin: 0 }}>{lang === 'hi' ? mod.hi : mod.en}</h2>
        <button className="btn secondary" onClick={reset}>{t('cancel')}</button>
      </div>
      <p className="muted">{lang === 'hi' ? mod.introHi : mod.introEn}</p>

      <div className="row">
        <label className="field" style={{ flex: 1 }}><span>{t('household')}</span>
          <select value={householdId} onChange={(e) => { setHouseholdId(e.target.value); setPersonId('') }}>
            {db.households.map((h) => <option key={h.id} value={h.id}>{h.head} · {h.village}</option>)}
          </select>
        </label>
        <label className="field" style={{ flex: 1 }}><span>{t('members')}</span>
          <select value={person?.id ?? ''} onChange={(e) => setPersonId(e.target.value)}>
            {household?.members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </label>
      </div>

      <p className="muted">Question {step + 1} of {mod.questions.length}</p>
      <div className="q">
        <p>{lang === 'hi' ? q.hi : q.en}</p>
        <div className="row">
          <button className="btn warn" onClick={() => answer(true)} style={{ flex: 1 }}>✓ {lang === 'hi' ? 'हाँ' : 'Yes'}</button>
          <button className="btn secondary" onClick={() => answer(false)} style={{ flex: 1 }}>{lang === 'hi' ? 'नहीं' : 'No'}</button>
        </div>
      </div>
      {step > 0 && (
        <button className="btn secondary" onClick={() => setStep(step - 1)}>← {lang === 'hi' ? 'वापस' : 'Back'}</button>
      )}
    </div>
  )
}
