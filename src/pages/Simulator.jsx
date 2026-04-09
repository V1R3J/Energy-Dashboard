import { useState, useEffect, useCallback } from "react";
import {
  Thermometer, Lightbulb, Wind, Sun, Zap, BatteryCharging,
  CalendarDays, Gauge, SlidersHorizontal, Receipt, Bolt,
  ChevronDown, ChevronRight, CircleCheck, TrendingUp, BadgePercent,
  PlugZap, IndianRupee, Info, PencilLine, CheckCheck,
} from "lucide-react";

// ─── Data ──────────────────────────────────────────────────────────────────────
const INIT_DATA = [
  { month: "Apr-24", acHrs: 12, lf: 0.45, days: 26, lights: 11501.57, fans: 7628.40, ac: 86346,    others: 21974.03 },
  { month: "May-24", acHrs: 10, lf: 0.50, days: 26, lights: 11501.57, fans: 7628.40, ac: 79950,    others: 27480.03 },
  { month: "Jun-24", acHrs: 10, lf: 0.40, days: 26, lights: 11501.57, fans: 7628.40, ac: 63960,    others: 28770.03 },
  { month: "Jul-24", acHrs: 10, lf: 0.36, days: 26, lights: 11501.57, fans: 7628.40, ac: 57564,    others: 35636.03 },
  { month: "Aug-24", acHrs: 12, lf: 0.45, days: 26, lights: 11501.57, fans: 7628.40, ac: 86346,    others: 13234.03 },
  { month: "Sep-24", acHrs: 12, lf: 0.45, days: 26, lights: 11501.57, fans: 7628.40, ac: 86346,    others: 16464.03 },
  { month: "Oct-24", acHrs: 12, lf: 0.40, days: 26, lights: 11501.57, fans: 7628.40, ac: 76752,    others: 22388.03 },
  { month: "Nov-24", acHrs: 9,  lf: 0.35, days: 26, lights: 11501.57, fans: 7628.40, ac: 50368.5,  others: 22871.53 },
  { month: "Dec-24", acHrs: 8,  lf: 0.28, days: 26, lights: 11501.57, fans: 7628.40, ac: 35817.6,  others: 15622.43 },
  { month: "Jan-25", acHrs: 8,  lf: 0.28, days: 26, lights: 11501.57, fans: 7628.40, ac: 35817.6,  others: 21772.43 },
  { month: "Feb-25", acHrs: 10, lf: 0.35, days: 24, lights: 10616.83, fans: 7041.60, ac: 51660,    others: 15471.57 },
  { month: "Mar-25", acHrs: 12, lf: 0.45, days: 26, lights: 11501.57, fans: 7628.40, ac: 86346,    others: 18984.03 },
];

const INIT_BILL = {
  solar: 455,
  solarGen: 55901,
  contract: 1600,
  recorded: 1039,
  pf: 97,
  tou: 139110,
  ntcUnits: 52100,
  ntcRate: 30,
  pfAdj: -6593.58,
  otherDebit: 3684,
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const getTotal = (d) => d.lights + d.fans + d.ac + d.others;

const fmtIN = (n, dec = 0) =>
  Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });

const calcBill = (d, b) => {
  const totalConsumed = getTotal(d);
  const netUnits = totalConsumed - b.solar;
  const billingDem85 = b.contract * 0.85;
  const billingDem = Math.max(b.recorded, billingDem85);

  const energyCharge =
    netUnits <= 1000
      ? netUnits * 4.55
      : 1000 * 4.55 + (netUnits - 1000) * 4.45;
  const fpppa = netUnits * 3.61;

  let fixedDem = 0;
  if (billingDem <= 1000) fixedDem = billingDem * 260;
  else if (billingDem <= 1335) fixedDem = 1000 * 260 + (billingDem - 1000) * 335;
  else fixedDem = 1000 * 260 + 335 * 335 + (billingDem - 1335) * 385;

  const excessDem = b.recorded > b.contract ? (b.recorded - b.contract) * 385 : 0;
  const ntcRebate = -(b.ntcUnits * (b.ntcRate / 100));
  const subTotal = energyCharge + fpppa + fixedDem + excessDem + b.tou + b.pfAdj;
  const govtDuty = subTotal * 0.15;
  const bankCharges = b.solarGen * 1.5;
  const beforeTCS = subTotal + govtDuty + bankCharges + ntcRebate + b.otherDebit + 0.94;
  const tcs = Math.round(beforeTCS * 0.001);
  const amountDue = beforeTCS + tcs;

  return {
    totalConsumed, netUnits, billingDem85, billingDem,
    energyCharge, fpppa, fixedDem, excessDem, ntcRebate,
    subTotal, govtDuty, bankCharges, beforeTCS, tcs, amountDue,
  };
};

// ─── Tiny reusable pieces ──────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-3 mb-4 mt-8">
    <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
      {children}
    </span>
    <div className="flex-1 h-px bg-gray-100" />
  </div>
);

const StatCard = ({ icon: Icon, color, label, value, sub, topBar }) => (
  <div className={`bg-white border border-gray-100 rounded-2xl p-4 relative overflow-hidden shadow-sm`}>
    {topBar && <div className={`absolute top-0 left-0 right-0 h-0.5 ${topBar}`} />}
    <div className={`inline-flex p-2 rounded-xl mb-3 ${color}`}>
      <Icon size={15} />
    </div>
    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
    <p className="text-xl font-bold text-gray-800 font-mono leading-none">{value}</p>
    {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
  </div>
);

const BillRow = ({ label, value, sub, highlight, indent, green, red }) => (
  <div
    className={`flex items-baseline justify-between py-2.5 border-b border-gray-50 last:border-0
      ${highlight ? "bg-blue-50/60 -mx-4 px-4 rounded-lg" : ""}
      ${indent ? "pl-6" : ""}
    `}
  >
    <span className={`text-sm ${highlight ? "font-semibold text-gray-700" : "text-gray-500"}`}>
      {label}
      {sub && <span className="text-[11px] text-gray-400 ml-1.5">{sub}</span>}
    </span>
    <span
      className={`font-mono text-sm font-semibold tabular-nums
        ${green ? "text-emerald-600" : red ? "text-rose-500" : highlight ? "text-blue-600" : "text-gray-800"}
      `}
    >
      {value}
    </span>
  </div>
);

const PctBar = ({ value, color }) => (
  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
    <div
      className={`h-full rounded-full transition-all duration-500 ${color}`}
      style={{ width: `${Math.min(value, 100)}%` }}
    />
  </div>
);

const InputField = ({ label, value, unit, onChange, hint }) => (
  <div>
    <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
      {label}
    </label>
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono font-semibold text-gray-800
          bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all pr-10"
      />
      {unit && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">
          {unit}
        </span>
      )}
    </div>
    {hint && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
  </div>
);

// Editable inline cell for the table
const EditCell = ({ value, width = "60px", onChange }) => (
  <input
    type="number"
    defaultValue={value}
    onBlur={(e) => onChange(Number(e.target.value))}
    onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
    className="border border-gray-200 rounded-lg px-2 py-1 text-xs font-mono text-right text-gray-700
      bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
    style={{ width }}
  />
);

// ─── Main component ────────────────────────────────────────────────────────────
export default function Simulator() {
  const [data, setData] = useState(INIT_DATA.map((d) => ({ ...d })));
  const [bill, setBill] = useState({ ...INIT_BILL });
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [billOpen, setBillOpen] = useState(true);
  const [inputsOpen, setInputsOpen] = useState(true);

  const updateRow = (i, field, val) => {
    setData((prev) => prev.map((d, idx) => (idx === i ? { ...d, [field]: val } : d)));
  };
  const updateBill = (field, val) => setBill((prev) => ({ ...prev, [field]: val }));

  const sel = data[selectedIdx];
  const totalConsumed = getTotal(sel);
  const annualKwh = data.reduce((s, d) => s + getTotal(d), 0);
  const bc = calcBill(sel, bill);

  const acPct = (sel.ac / totalConsumed) * 100;
  const lfPct = ((sel.lights + sel.fans) / totalConsumed) * 100;
  const othPct = (sel.others / totalConsumed) * 100;

  // ── Bar chart heights for mini inline bar ──
  const maxTotal = Math.max(...data.map(getTotal));

  return (
    <div className="bg-gray-50 min-h-screen p-6 font-sans">
      <div className="max-w-screen-xl mx-auto space-y-0">

        {/* ── Annual KPI strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-2">
          <StatCard
            icon={Bolt} color="bg-blue-50 text-blue-500"
            topBar="bg-blue-400"
            label="Annual consumption" value={`${fmtIN(annualKwh / 1000, 1)} k`}
            sub="kWh total"
          />
          <StatCard
            icon={IndianRupee} color="bg-emerald-50 text-emerald-600"
            topBar="bg-emerald-400"
            label="Amount due" value={`₹${fmtIN(bc.amountDue / 100000, 2)}L`}
            sub="selected month"
          />
          <StatCard
            icon={CalendarDays} color="bg-violet-50 text-violet-500"
            topBar="bg-violet-400"
            label="Selected month" value={sel.month}
            sub={`${sel.days} op. days`}
          />
          <StatCard
            icon={Thermometer} color="bg-sky-50 text-sky-500"
            topBar="bg-sky-400"
            label="AC consumption" value={fmtIN(sel.ac)}
            sub={`${acPct.toFixed(1)}% of total · kWh`}
          />
          <StatCard
            icon={Gauge} color="bg-amber-50 text-amber-500"
            topBar="bg-amber-400"
            label="Net units billed" value={fmtIN(bc.netUnits)}
            sub="after solar set-off"
          />
          <StatCard
            icon={Sun} color="bg-orange-50 text-orange-400"
            topBar="bg-orange-300"
            label="Solar generation" value={fmtIN(bill.solarGen)}
            sub="kWh · banking"
          />
        </div>

        {/* ══════════════════════════════════════
            SECTION 1 — Monthly Consumption Table
        ══════════════════════════════════════ */}
        <SectionLabel>Monthly Consumption Data</SectionLabel>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    ["Month", "text-left pl-5"],
                    ["AC hrs/day", "text-right pr-3"],
                    ["Load factor", "text-right pr-3"],
                    ["Days", "text-right pr-3"],
                    ["Lights (kWh)", "text-right pr-3"],
                    ["Fans (kWh)", "text-right pr-3"],
                    ["AC (kWh)", "text-right pr-3"],
                    ["Others (kWh)", "text-right pr-3"],
                    ["Total (kWh)", "text-right pr-3"],
                    ["vs Annual", "text-right pr-3"],
                    ["Select", "text-center pr-4"],
                  ].map(([h, cls]) => (
                    <th
                      key={h}
                      className={`py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap ${cls}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((d, i) => {
                  const tot = getTotal(d);
                  const barW = Math.round((tot / maxTotal) * 100);
                  const isActive = i === selectedIdx;
                  return (
                    <tr
                      key={d.month}
                      onClick={() => setSelectedIdx(i)}
                      className={`border-b border-gray-50 cursor-pointer transition-colors
                        ${isActive
                          ? "bg-blue-50 border-l-2 border-l-blue-400"
                          : "hover:bg-gray-50/80"
                        }`}
                    >
                      {/* Month */}
                      <td className="py-2.5 pl-5 pr-3">
                        <span className={`font-bold text-sm ${isActive ? "text-blue-600" : "text-gray-700"}`}>
                          {d.month}
                        </span>
                      </td>
                      {/* AC hrs */}
                      <td className="py-2 pr-3 text-right">
                        <EditCell value={d.acHrs} width="52px" onChange={(v) => updateRow(i, "acHrs", v)} />
                      </td>
                      {/* Load factor */}
                      <td className="py-2 pr-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <EditCell value={(d.lf * 100).toFixed(0)} width="48px" onChange={(v) => updateRow(i, "lf", v / 100)} />
                          <span className="text-xs text-gray-400">%</span>
                        </div>
                      </td>
                      {/* Days */}
                      <td className="py-2 pr-3 text-right">
                        <EditCell value={d.days} width="44px" onChange={(v) => updateRow(i, "days", v)} />
                      </td>
                      {/* Lights */}
                      <td className="py-2 pr-3 text-right">
                        <EditCell value={d.lights.toFixed(2)} width="80px" onChange={(v) => updateRow(i, "lights", v)} />
                      </td>
                      {/* Fans */}
                      <td className="py-2 pr-3 text-right">
                        <EditCell value={d.fans.toFixed(2)} width="80px" onChange={(v) => updateRow(i, "fans", v)} />
                      </td>
                      {/* AC */}
                      <td className="py-2 pr-3 text-right">
                        <EditCell value={d.ac.toFixed(2)} width="84px" onChange={(v) => updateRow(i, "ac", v)} />
                      </td>
                      {/* Others */}
                      <td className="py-2 pr-3 text-right">
                        <EditCell value={d.others.toFixed(2)} width="84px" onChange={(v) => updateRow(i, "others", v)} />
                      </td>
                      {/* Total */}
                      <td className="py-2 pr-3 text-right">
                        <span className={`font-mono font-bold text-sm ${isActive ? "text-blue-600" : "text-gray-700"}`}>
                          {fmtIN(tot)}
                        </span>
                      </td>
                      {/* Mini bar */}
                      <td className="py-2 pr-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isActive ? "bg-blue-400" : "bg-gray-300"}`}
                              style={{ width: `${barW}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-400 w-7 text-right">{barW}%</span>
                        </div>
                      </td>
                      {/* Select */}
                      <td className="py-2 pr-4 text-center">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full">
                            <CheckCheck size={10} /> Selected
                          </span>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedIdx(i); }}
                            className="text-[10px] font-semibold text-gray-400 border border-gray-200 px-2.5 py-1 rounded-full
                              hover:border-blue-300 hover:text-blue-500 transition-colors"
                          >
                            Use
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 2 — Selected Month Snapshot
        ══════════════════════════════════════ */}
        <SectionLabel>Selected Month — {sel.month} Breakdown</SectionLabel>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: CalendarDays, color: "bg-slate-50 text-slate-500",   topBar: "bg-slate-300", label: "Operating days",  value: sel.days,                            sub: "days" },
            { icon: Bolt,         color: "bg-blue-50 text-blue-500",     topBar: "bg-blue-400",  label: "Total consumed",  value: fmtIN(totalConsumed),                sub: "kWh" },
            { icon: Thermometer,  color: "bg-sky-50 text-sky-500",       topBar: "bg-sky-400",   label: "AC consumption",  value: fmtIN(sel.ac),                       sub: `${acPct.toFixed(1)}% · kWh` },
            { icon: Gauge,        color: "bg-violet-50 text-violet-500", topBar: "bg-violet-400",label: "AC hrs / day",    value: sel.acHrs,                           sub: `LF ${(sel.lf * 100).toFixed(0)}%` },
            { icon: Lightbulb,    color: "bg-amber-50 text-amber-500",   topBar: "bg-amber-400", label: "Lights + Fans",   value: fmtIN(sel.lights + sel.fans),        sub: `${lfPct.toFixed(1)}% · kWh` },
            { icon: SlidersHorizontal, color: "bg-emerald-50 text-emerald-500", topBar: "bg-emerald-400", label: "Others", value: fmtIN(sel.others),                  sub: `${othPct.toFixed(1)}% · kWh` },
          ].map((c) => (
            <StatCard key={c.label} {...c} />
          ))}
        </div>

        {/* ── Consumption split bars ── */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mt-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Consumption split</p>
          <div className="space-y-3">
            {[
              { label: "AC", value: sel.ac, pct: acPct, color: "bg-blue-400", textColor: "text-blue-600" },
              { label: "Lights", value: sel.lights, pct: (sel.lights / totalConsumed) * 100, color: "bg-amber-400", textColor: "text-amber-600" },
              { label: "Fans", value: sel.fans, pct: (sel.fans / totalConsumed) * 100, color: "bg-emerald-400", textColor: "text-emerald-600" },
              { label: "Others", value: sel.others, pct: othPct, color: "bg-slate-300", textColor: "text-slate-500" },
            ].map(({ label, value, pct, color, textColor }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500 font-medium w-14">{label}</span>
                  <div className="flex-1 mx-3">
                    <PctBar value={pct} color={color} />
                  </div>
                  <span className={`text-xs font-bold font-mono w-12 text-right ${textColor}`}>
                    {pct.toFixed(1)}%
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono w-24 text-right">
                    {fmtIN(value)} kWh
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 3 — Bill Inputs
        ══════════════════════════════════════ */}
        <SectionLabel>Bill Inputs — Editable</SectionLabel>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/70 transition-colors"
            onClick={() => setInputsOpen((v) => !v)}
          >
            <div className="flex items-center gap-2">
              <PencilLine size={15} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">Tariff & Demand Inputs</span>
              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">10 fields</span>
            </div>
            {inputsOpen ? <ChevronDown size={15} className="text-gray-400" /> : <ChevronRight size={15} className="text-gray-400" />}
          </button>

          {inputsOpen && (
            <div className="px-5 pb-5 border-t border-gray-50">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                <InputField label="Solar set-off" value={bill.solar} unit="kWh"
                  onChange={(v) => updateBill("solar", v)}
                  hint="Subtracted from total consumed" />
                <InputField label="Solar generation" value={bill.solarGen} unit="kWh"
                  onChange={(v) => updateBill("solarGen", v)}
                  hint="Banking charges @ ₹1.50/kWh" />
                <InputField label="Contract demand" value={bill.contract} unit="kW"
                  onChange={(v) => updateBill("contract", v)}
                  hint="Agreed contract kW" />
                <InputField label="Recorded demand" value={bill.recorded} unit="kW"
                  onChange={(v) => updateBill("recorded", v)}
                  hint="Actual peak kW recorded" />
                <InputField label="Avg power factor" value={bill.pf} unit="%"
                  onChange={(v) => updateBill("pf", v)}
                  hint="For reference / rebate check" />
                <InputField label="TOU charges" value={bill.tou} unit="₹"
                  onChange={(v) => updateBill("tou", v)}
                  hint="Time-of-use surcharge" />
                <InputField label="NTC units" value={bill.ntcUnits} unit="kWh"
                  onChange={(v) => updateBill("ntcUnits", v)}
                  hint="Non-tariff credit units" />
                <InputField label="NTC rate" value={bill.ntcRate} unit="%"
                  onChange={(v) => updateBill("ntcRate", v)}
                  hint="NTC rebate % applied" />
                <InputField label="PF adjustment" value={bill.pfAdj} unit="₹"
                  onChange={(v) => updateBill("pfAdj", v)}
                  hint="Negative value = rebate" />
                <InputField label="Other debit" value={bill.otherDebit} unit="₹"
                  onChange={(v) => updateBill("otherDebit", v)}
                  hint="Any additional charges" />
              </div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════
            SECTION 4 — Calculated Bill
        ══════════════════════════════════════ */}
        <SectionLabel>Calculated Bill — {sel.month}</SectionLabel>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* ── Col 1: Units & Demand ── */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <PlugZap size={14} className="text-blue-500" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Units & Demand</p>
            </div>
            <BillRow label="Total consumed"     value={`${fmtIN(bc.totalConsumed)} kWh`} />
            <BillRow label="Solar set-off"       value={`− ${fmtIN(bill.solar)} kWh`} green />
            <BillRow label="Net units billed"    value={`${fmtIN(bc.netUnits)} kWh`} highlight />
            <BillRow label="Billing demand (85%)" value={`${fmtIN(bc.billingDem85, 0)} kW`} sub="of contract" />
            <BillRow label="Max demand used"     value={`${fmtIN(bc.billingDem, 0)} kW`} highlight />
          </div>

          {/* ── Col 2: Consumption split panel ── */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-amber-50 rounded-lg">
                <BadgePercent size={14} className="text-amber-500" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Consumption Split</p>
            </div>
            {[
              { label: "AC",           pct: acPct,                                      color: "bg-blue-400" },
              { label: "Lights + Fans", pct: lfPct,                                     color: "bg-amber-400" },
              { label: "Others",        pct: othPct,                                    color: "bg-slate-300" },
            ].map(({ label, pct, color }) => (
              <div key={label} className="py-2.5 border-b border-gray-50 last:border-0">
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="font-mono text-sm font-semibold text-gray-700">{pct.toFixed(2)}%</span>
                </div>
                <PctBar value={pct} color={color} />
              </div>
            ))}

            {/* Demand utilisation */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Demand utilisation</p>
              {(() => {
                const utilPct = (bc.billingDem / bill.contract) * 100;
                return (
                  <>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-gray-500">Used vs contract</span>
                      <span className="font-mono text-sm font-semibold text-gray-700">{utilPct.toFixed(1)}%</span>
                    </div>
                    <PctBar value={utilPct} color={utilPct > 100 ? "bg-rose-400" : "bg-violet-400"} />
                  </>
                );
              })()}
            </div>
          </div>

          {/* ── Col 3: Amount Due highlight ── */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-emerald-50 rounded-lg">
                <Receipt size={14} className="text-emerald-500" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Bill Summary</p>
            </div>
            <div className="space-y-1 flex-1">
              <BillRow label="Energy charges"      value={`₹ ${fmtIN(bc.energyCharge, 2)}`} />
              <BillRow label="FPPPA @ ₹3.61/unit"  value={`₹ ${fmtIN(bc.fpppa, 2)}`} />
              <BillRow label="Fixed demand charges" value={`₹ ${fmtIN(bc.fixedDem, 2)}`} />
              <BillRow label="Excess demand"        value={`₹ ${fmtIN(bc.excessDem, 2)}`} />
              <BillRow label="TOU charges"          value={`₹ ${fmtIN(bill.tou, 2)}`} />
              <BillRow label="PF adjustment"
                value={`${bc.energyCharge >= 0 && bill.pfAdj < 0 ? "− " : ""}₹ ${fmtIN(Math.abs(bill.pfAdj), 2)}`}
                green={bill.pfAdj < 0} />
              <BillRow label="Govt duty @ 15%"      value={`₹ ${fmtIN(bc.govtDuty, 2)}`} />
              <BillRow label="Banking charges"      value={`₹ ${fmtIN(bc.bankCharges, 2)}`} sub="solar" />
              <BillRow label="NTC rebate"            value={`− ₹ ${fmtIN(Math.abs(bc.ntcRebate), 2)}`} green />
              <BillRow label="Other debit"           value={`₹ ${fmtIN(bill.otherDebit, 2)}`} />
              <BillRow label="TCS @ 0.1%"            value={`₹ ${fmtIN(bc.tcs)}`} />
            </div>

            {/* Grand total */}
            <div className="mt-4 pt-4 border-t-2 border-gray-100">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Amount Due</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{sel.month} · incl. all charges</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-emerald-600 font-mono leading-none">
                    ₹{fmtIN(bc.amountDue / 100000, 2)}L
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1 font-mono">
                    ₹ {fmtIN(bc.amountDue, 2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SECTION 5 — Full Bill Breakdown (expanded)
        ══════════════════════════════════════ */}
        <SectionLabel>Full Bill Breakdown</SectionLabel>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/60 transition-colors"
            onClick={() => setBillOpen((v) => !v)}
          >
            <div className="flex items-center gap-2">
              <Receipt size={15} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">Detailed charge computation</span>
            </div>
            {billOpen ? <ChevronDown size={15} className="text-gray-400" /> : <ChevronRight size={15} className="text-gray-400" />}
          </button>

          {billOpen && (
            <div className="border-t border-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-50">

                {/* Left col */}
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Energy & Demand charges</p>
                  <BillRow label="Net units billed"
                    value={`${fmtIN(bc.netUnits)} kWh`} highlight />
                  <BillRow label="Energy charge (≤1000 kWh @ ₹4.55)"
                    value={`₹ ${fmtIN(Math.min(bc.netUnits, 1000) * 4.55, 2)}`} indent />
                  {bc.netUnits > 1000 && (
                    <BillRow label={`Energy charge (${fmtIN(bc.netUnits - 1000)} kWh @ ₹4.45)`}
                      value={`₹ ${fmtIN((bc.netUnits - 1000) * 4.45, 2)}`} indent />
                  )}
                  <BillRow label="Total energy charges"  value={`₹ ${fmtIN(bc.energyCharge, 2)}`} highlight />
                  <BillRow label="FPPPA @ ₹3.61/unit"    value={`₹ ${fmtIN(bc.fpppa, 2)}`} />
                  <div className="mt-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Fixed demand charges</p>
                    <BillRow label="Billing demand"        value={`${fmtIN(bc.billingDem, 0)} kW`} />
                    <BillRow label="Fixed demand charge"   value={`₹ ${fmtIN(bc.fixedDem, 2)}`} highlight />
                    <BillRow label="Excess demand charges" value={`₹ ${fmtIN(bc.excessDem, 2)}`}
                      red={bc.excessDem > 0} />
                    <BillRow label="TOU charges"           value={`₹ ${fmtIN(bill.tou, 2)}`} />
                    <BillRow label="PF adjustment"
                      value={`${bill.pfAdj < 0 ? "− " : ""}₹ ${fmtIN(Math.abs(bill.pfAdj), 2)}`}
                      green={bill.pfAdj < 0} />
                  </div>
                  <div className="mt-4 pt-3 border-t border-dashed border-gray-200">
                    <BillRow label="Sub-total" value={`₹ ${fmtIN(bc.subTotal, 2)}`} highlight />
                  </div>
                </div>

                {/* Right col */}
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Taxes, rebates & adjustments</p>
                  <BillRow label="Sub-total (carried)"     value={`₹ ${fmtIN(bc.subTotal, 2)}`} highlight />
                  <BillRow label="Govt duty @ 15%"         value={`₹ ${fmtIN(bc.govtDuty, 2)}`} />
                  <BillRow label="Banking charges (solar)"
                    sub="₹1.50/kWh"
                    value={`₹ ${fmtIN(bc.bankCharges, 2)}`} />
                  <BillRow label="NTC rebate"               value={`− ₹ ${fmtIN(Math.abs(bc.ntcRebate), 2)}`} green />
                  <BillRow label="Other debit"              value={`₹ ${fmtIN(bill.otherDebit, 2)}`} />
                  <BillRow label="Rounding"                 value="₹ 0.94" />
                  <div className="mt-4 pt-3 border-t border-dashed border-gray-200">
                    <BillRow label="Before TCS"   value={`₹ ${fmtIN(bc.beforeTCS, 2)}`} highlight />
                    <BillRow label="TCS @ 0.1%"   value={`₹ ${fmtIN(bc.tcs)}`} />
                  </div>

                  {/* Grand total box */}
                  <div className="mt-5 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">
                        Total Amount Due
                      </p>
                      <p className="text-xs text-emerald-500">{sel.month} · all inclusive</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-emerald-700 font-mono leading-none">
                        ₹{fmtIN(bc.amountDue / 100000, 2)}L
                      </p>
                      <p className="text-xs text-emerald-500 font-mono mt-1">
                        ₹ {fmtIN(bc.amountDue, 2)}
                      </p>
                    </div>
                  </div>

                  {/* Info note */}
                  <div className="mt-4 flex items-start gap-2 text-[11px] text-gray-400">
                    <Info size={12} className="mt-0.5 shrink-0" />
                    <span>
                      Fixed demand slabs: ≤1000 kW @ ₹260, 1001–1335 kW @ ₹335, &gt;1335 kW @ ₹385. Excess demand @ ₹385/kW above contract.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* bottom padding */}
        <div className="h-8" />

      </div>
    </div>
  );
}