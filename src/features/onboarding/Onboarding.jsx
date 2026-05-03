import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Seo from '../../components/Seo'
import StepProfile from './steps/StepProfile'
import StepGoals from './steps/StepGoals'
import StepIntegrations from './steps/StepIntegrations'
import StepFirstScript from './steps/StepFirstScript'
import StepComplete from './steps/StepComplete'

const STEPS = [
  { id: 'profile', label: 'Qui es-tu ?' },
  { id: 'goals', label: 'Ton objectif' },
  { id: 'integrations', label: 'Tes outils' },
  { id: 'first-script', label: 'Premier script' },
  { id: 'complete', label: 'C\'est parti !' },
]

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState({
    fullName: '',
    jobRole: '',
    sector: '',
    goals: [],
    integrationsSkipped: false,
  })
  const navigate = useNavigate()

  function next() {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1)
    }
  }

  function prev() {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1)
    }
  }

  function skip() {
    next()
  }

  function updateData(partial) {
    setData(d => ({ ...d, ...partial }))
  }

  function finish() {
    navigate('/dashboard', { replace: true })
  }

  const stepProps = { data, updateData, next, prev, skip, finish }

  return (
    <div className="onboarding">
      <Seo title="Onboarding" noindex />

      {/* Barre de progression */}
      <div className="onboarding-progress">
        <div className="onboarding-progress-bar">
          {STEPS.map((step, i) => (
            <div
              key={step.id}
              className={`onboarding-progress-block ${i <= currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}`}
            />
          ))}
        </div>
        <div className="onboarding-progress-label">
          Étape {currentStep + 1} sur {STEPS.length} — {STEPS[currentStep].label}
        </div>
      </div>

      {/* Contenu de l'étape */}
      <div className="onboarding-content">
        <div
          className="onboarding-slider"
          style={{ transform: `translateX(-${currentStep * 100}%)` }}
        >
          <div className="onboarding-slide"><StepProfile {...stepProps} /></div>
          <div className="onboarding-slide"><StepGoals {...stepProps} /></div>
          <div className="onboarding-slide"><StepIntegrations {...stepProps} /></div>
          <div className="onboarding-slide"><StepFirstScript {...stepProps} /></div>
          <div className="onboarding-slide"><StepComplete {...stepProps} /></div>
        </div>
      </div>

      {/* Navigation */}
      {currentStep < STEPS.length - 1 && (
        <div className="onboarding-nav">
          {currentStep > 0 ? (
            <button className="onboarding-btn-back" onClick={prev}>← Retour</button>
          ) : <span />}
          <button className="onboarding-btn-skip" onClick={skip}>Passer cette étape</button>
        </div>
      )}
    </div>
  )
}
