import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import Chip from '../components/Chip'
import Text from '../components/Text'
import { GlobeIcon } from '../components/Icons'
import { useLanguage } from '../hooks/useLanguage'

export function Apply() {
  const navigate = useNavigate()
  const { toggleLanguage, isRtl, t } = useLanguage()

  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated submission delay for premium feel
    navigate('/success')
  }

  return (
    <Card hoverable={true}>
      {/* Top Header Row */}
      <div className={`flex items-center justify-between mb-8 pb-4 border-b border-slate-100/50 dark:border-white/5 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
        <Chip dot={true} dotColor="teal">
          {t('i18n_1')}
        </Chip>

        {/* Elegant Language Switcher Button */}
        <Button 
          variant="secondary" 
          onClick={toggleLanguage}
          className="py-1.5 px-4 text-xs rounded-xl font-bold flex items-center gap-1.5 transition-all active:scale-95"
          aria-label="Toggle Language"
        >
          <GlobeIcon size={14} />
          {isRtl ? 'English' : 'العربية'}
        </Button>
      </div>

      {/* Page Header */}
      <Text variant="h1">
        {t('i18n_12')}
      </Text>
      
      <Text variant="body">
        {t('i18n_13')}
      </Text>

      {/* Tactile Support Form */}
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5 text-left">
        {/* Name Input */}
        <div className="flex flex-col gap-1.5">
          <label 
            htmlFor="fullname"
            className={`text-xs font-semibold tracking-wide text-slate-400 dark:text-slate-500 uppercase ${isRtl ? 'text-right' : 'text-left'}`}
          >
            {t('i18n_14')}
          </label>
          <input
            id="fullname"
            type="text"
            required
            placeholder={isRtl ? 'أدخل اسمك الكامل' : 'John Doe'}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`bg-slate-500/5 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all duration-300 w-full text-slate-800 dark:text-white placeholder:text-slate-400/50 ${isRtl ? 'text-right' : 'text-left'}`}
          />
        </div>

        {/* Email Input */}
        <div className="flex flex-col gap-1.5">
          <label 
            htmlFor="email"
            className={`text-xs font-semibold tracking-wide text-slate-400 dark:text-slate-500 uppercase ${isRtl ? 'text-right' : 'text-left'}`}
          >
            {t('i18n_15')}
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder={isRtl ? 'name@example.com' : 'name@example.com'}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`bg-slate-500/5 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all duration-300 w-full text-slate-800 dark:text-white placeholder:text-slate-400/50 ${isRtl ? 'text-right' : 'text-left'}`}
          />
        </div>

        {/* Description Textarea */}
        <div className="flex flex-col gap-1.5">
          <label 
            htmlFor="description"
            className={`text-xs font-semibold tracking-wide text-slate-400 dark:text-slate-500 uppercase ${isRtl ? 'text-right' : 'text-left'}`}
          >
            {t('i18n_16')}
          </label>
          <textarea
            id="description"
            required
            rows={3}
            placeholder={isRtl ? 'اكتب تفاصيل طلبك هنا...' : 'Describe how we can support you...'}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={`bg-slate-500/5 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all duration-300 w-full text-slate-800 dark:text-white placeholder:text-slate-400/50 resize-none ${isRtl ? 'text-right' : 'text-left'}`}
          />
        </div>

        {/* Action Row */}
        <div className={`flex flex-col sm:flex-row gap-4 mt-4 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
          <Button 
            variant="primary" 
            type="submit"
            aria-label="Submit Application"
            className="flex-1 justify-center active:scale-98"
          >
            {t('i18n_17')}
          </Button>

          <Button 
            variant="secondary"
            type="button"
            onClick={() => navigate('/')}
            aria-label="Go Back"
            className="justify-center active:scale-98"
          >
            {t('i18n_18')}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default Apply
