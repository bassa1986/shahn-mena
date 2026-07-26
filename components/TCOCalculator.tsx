'use client'
import { useState } from 'react'
import { Zap } from 'lucide-react'

type Param = { country: string; electricity_rate_kwh: number; avg_fuel_price: number }

export default function TCOCalculator({ params }: { params: Param[] }) {
  const [country, setCountry]   = useState('SA')
  const [kmPerDay, setKmPerDay] = useState(50)
  const [fuelL, setFuelL]       = useState(10)
  const [evKwh, setEvKwh]       = useState(18)

  const p         = params.find(x => x.country === country) ?? params[0]
  if (!p) return null
  const cur       = country === 'SA' ? 'ر.س' : country === 'AE' ? 'د.إ' : 'د.م'
  const kmYear    = kmPerDay * 365
  const fuelCost  = (kmYear / 100) * fuelL  * p.avg_fuel_price
  const evCost    = (kmYear / 100) * evKwh  * p.electricity_rate_kwh
  const saving    = fuelCost - evCost
  const saving5   = saving * 5

  return (
    <div className="card-surface">
      <div className="mb-6">
        <label className="block text-sm text-[#A89070] mb-2" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>الدولة</label>
        <div className="flex gap-3">
          {params.map(p => (
            <button key={p.country} onClick={() => setCountry(p.country)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${country === p.country ? 'bg-[#F5A623] text-[#0D1B2A]' : 'bg-[#0A1520] text-[#A89070] hover:text-[#FAF3E0]'}`}
              style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
              {p.country === 'SA' ? '🇸🇦 السعودية' : p.country === 'AE' ? '🇦🇪 الإمارات' : '🇲🇦 المغرب'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="block text-sm text-[#A89070] mb-2" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>كم تقود يومياً؟ ({kmPerDay} كم)</label>
          <input type="range" min={10} max={300} value={kmPerDay} onChange={e => setKmPerDay(+e.target.value)} className="w-full accent-[#F5A623]" />
        </div>
        <div>
          <label className="block text-sm text-[#A89070] mb-2" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>استهلاك بنزين (لتر/100كم): {fuelL}</label>
          <input type="range" min={5} max={20} value={fuelL} onChange={e => setFuelL(+e.target.value)} className="w-full accent-[#F5A623]" />
        </div>
        <div>
          <label className="block text-sm text-[#A89070] mb-2" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>استهلاك كهرباء (kWh/100كم): {evKwh}</label>
          <input type="range" min={12} max={30} value={evKwh} onChange={e => setEvKwh(+e.target.value)} className="w-full accent-[#F5A623]" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[#0A1520] rounded-lg p-4 text-center">
          <div className="text-xs text-[#A89070] mb-1" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>تكلفة البنزين سنوياً</div>
          <div className="font-tajawal font-black text-rose-400 text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>{fuelCost.toFixed(0)} {cur}</div>
        </div>
        <div className="bg-[#0A1520] rounded-lg p-4 text-center">
          <div className="text-xs text-[#A89070] mb-1" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>تكلفة الكهرباء سنوياً</div>
          <div className="font-tajawal font-black text-emerald-400 text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>{evCost.toFixed(0)} {cur}</div>
        </div>
      </div>

      <div className="bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-xl p-5 text-center">
        <div className="text-sm text-[#A89070] mb-1" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>توفيرك السنوي</div>
        <div className="font-tajawal font-black text-4xl text-[#F5A623]" style={{ fontFamily: 'Tajawal, sans-serif' }}>{saving.toFixed(0)} {cur}</div>
        <div className="text-xs text-[#A89070] mt-2" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
          توفير 5 سنوات: <span className="text-[#F5A623] font-bold">{saving5.toFixed(0)} {cur}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
        <Zap size={12} className="text-[#F5A623]" />
        الأسعار مُحدَّثة تلقائياً من قاعدة البيانات
      </div>
    </div>
  )
}
