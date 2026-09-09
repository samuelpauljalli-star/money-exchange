import { useState, useEffect, useRef } from "react";

type Screen =
  | "landing"
  | "register-role"
  | "register-details"
  | "register-phone"
  | "register-otp"
  | "register-email"
  | "register-aadhar"
  | "register-location"
  | "dashboard"
  | "match-detail";

type Role = "need-cash" | "need-online" | null;

interface UserData {
  role: Role;
  name: string;
  age: string;
  phone: string;
  otp: string;
  email: string;
  aadhar: string;
  lat: number | null;
  lng: number | null;
  locationName: string;
}

interface Match {
  id: number;
  name: string;
  age: number;
  distance: string;
  amount: number;
  rating: number;
  verified: boolean;
  avatar: string;
  role: Role;
}

const DEMO_MATCHES: Match[] = [
  { id: 1, name: "Rajesh Kumar", age: 34, distance: "0.8 km", amount: 2000, rating: 4.8, verified: true, avatar: "RK", role: "need-cash" },
  { id: 2, name: "Priya Sharma", age: 27, distance: "1.2 km", amount: 5000, rating: 4.6, verified: true, avatar: "PS", role: "need-online" },
  { id: 3, name: "Mohammed Arif", age: 41, distance: "2.1 km", amount: 1500, rating: 4.9, verified: true, avatar: "MA", role: "need-cash" },
  { id: 4, name: "Sunita Devi", age: 29, distance: "3.4 km", amount: 3000, rating: 4.5, verified: false, avatar: "SD", role: "need-online" },
  { id: 5, name: "Arun Nair", age: 38, distance: "4.0 km", amount: 10000, rating: 4.7, verified: true, avatar: "AN", role: "need-cash" },
];

function StepDot({ active, done }: { active: boolean; done: boolean }) {
  return (
    <div
      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
        done ? "bg-[#E8980A]" : active ? "bg-[#1A3A5C]" : "bg-[#D8D3C8]"
      }`}
    />
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <StepDot key={i} active={i === step} done={i < step} />
      ))}
      <span className="ml-auto text-xs text-[#6B7A99] font-medium">
        {step + 1} of {total}
      </span>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  maxLength,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#1A1F36]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full px-4 py-3.5 rounded-xl border border-[#D8D3C8] bg-white text-[#1A1F36] placeholder-[#6B7A99] focus:outline-none focus:ring-2 focus:ring-[#1A3A5C] focus:border-transparent transition-all text-base"
      />
      {hint && <p className="text-xs text-[#6B7A99]">{hint}</p>}
    </div>
  );
}

function PrimaryBtn({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 rounded-xl bg-[#1A3A5C] text-white font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1E4A76] active:scale-[0.98] transition-all duration-150"
    >
      {children}
    </button>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm text-[#6B7A99] hover:text-[#1A1F36] transition-colors mb-6"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M19 12H5M5 12l7-7M5 12l7 7" />
      </svg>
      Back
    </button>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Verified
    </span>
  );
}

// ── Screens ────────────────────────────────────────────────────────────────────

function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-[#F5F3EF] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1A3A5C] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M8 7h8M8 12h5M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="17" cy="17" r="4" fill="#E8980A"/>
              <path d="M17 15v2l1 1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-display font-bold text-lg text-[#1A1F36]">CashBridge</span>
        </div>
        <span className="text-xs bg-[#1A3A5C]/10 text-[#1A3A5C] px-3 py-1 rounded-full font-medium">India's #1 P2P</span>
      </div>

      {/* Hero */}
      <div className="px-6 pt-6 pb-10">
        <div className="relative rounded-3xl overflow-hidden bg-[#1A3A5C] p-8 mb-6">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#E8980A]/20 rounded-full -translate-y-1/4 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
          <div className="relative z-10">
            <p className="text-[#E8980A] font-semibold text-sm mb-3 tracking-wide uppercase">The Money Bridge</p>
            <h1 className="font-display font-bold text-3xl text-white leading-tight mb-4">
              Cash ↔ Digital<br />Made Simple
            </h1>
            <p className="text-white/70 text-sm leading-relaxed">
              Connect with verified people nearby. Exchange cash for online money — or online money for cash — safely and instantly.
            </p>
          </div>
        </div>

        {/* How it works */}
        <h2 className="font-display font-bold text-xl text-[#1A1F36] mb-4">How it works</h2>
        <div className="flex flex-col gap-3 mb-8">
          {[
            { icon: "👤", title: "Create your profile", desc: "Verify with Aadhar, phone & email for full trust" },
            { icon: "📍", title: "Share your location", desc: "Find nearby partners for quick face-to-face exchange" },
            { icon: "🤝", title: "Connect & exchange", desc: "Meet, verify, and complete the exchange safely" },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-4 bg-white rounded-2xl p-4 border border-[#D8D3C8]">
              <div className="w-10 h-10 rounded-xl bg-[#F5F3EF] flex items-center justify-center text-xl flex-shrink-0">
                {step.icon}
              </div>
              <div>
                <p className="font-semibold text-[#1A1F36] text-sm">{step.title}</p>
                <p className="text-[#6B7A99] text-xs mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="flex items-center justify-around bg-white rounded-2xl p-4 border border-[#D8D3C8] mb-8">
          {[
            { val: "50K+", label: "Users" },
            { val: "₹2Cr+", label: "Exchanged" },
            { val: "4.9★", label: "Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display font-bold text-lg text-[#1A3A5C]">{stat.val}</p>
              <p className="text-xs text-[#6B7A99]">{stat.label}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 rounded-xl bg-[#E8980A] text-white font-display font-bold text-lg hover:bg-[#D4880A] active:scale-[0.98] transition-all duration-150 shadow-lg shadow-[#E8980A]/30"
        >
          Get Started →
        </button>
        <p className="text-center text-xs text-[#6B7A99] mt-3">
          Free to use • Aadhar verified • RBI compliant
        </p>
      </div>
    </div>
  );
}

function RoleScreen({ onSelect, onBack }: { onSelect: (r: Role) => void; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#F5F3EF] flex flex-col px-6 pt-6">
      <BackBtn onClick={onBack} />
      <ProgressBar step={0} total={7} />
      <h2 className="font-display font-bold text-2xl text-[#1A1F36] mb-2">What do you need?</h2>
      <p className="text-[#6B7A99] text-sm mb-8 leading-relaxed">
        Tell us your need — we'll match you with the right person nearby.
      </p>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => onSelect("need-cash")}
          className="group relative bg-white border-2 border-[#D8D3C8] rounded-2xl p-6 text-left hover:border-[#1A3A5C] hover:shadow-md transition-all duration-200 active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-xl bg-[#EBF0F7] flex items-center justify-center text-2xl mb-3">💵</div>
          <h3 className="font-display font-bold text-lg text-[#1A1F36] mb-1">I need Cash</h3>
          <p className="text-sm text-[#6B7A99] leading-relaxed">
            I have money in my bank / UPI / wallet but need physical cash right now.
          </p>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#D8D3C8] group-hover:text-[#1A3A5C] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </button>

        <button
          onClick={() => onSelect("need-online")}
          className="group relative bg-white border-2 border-[#D8D3C8] rounded-2xl p-6 text-left hover:border-[#E8980A] hover:shadow-md transition-all duration-200 active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-xl bg-[#FFF8EC] flex items-center justify-center text-2xl mb-3">📱</div>
          <h3 className="font-display font-bold text-lg text-[#1A1F36] mb-1">I need Online Money</h3>
          <p className="text-sm text-[#6B7A99] leading-relaxed">
            I have physical cash but need money in my bank / UPI / wallet right now.
          </p>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#D8D3C8] group-hover:text-[#E8980A] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}

function DetailsScreen({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: UserData;
  onChange: (k: keyof UserData, v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const valid = data.name.trim().length >= 2 && Number(data.age) >= 18 && Number(data.age) <= 100;
  return (
    <div className="min-h-screen bg-[#F5F3EF] flex flex-col px-6 pt-6">
      <BackBtn onClick={onBack} />
      <ProgressBar step={1} total={7} />
      <h2 className="font-display font-bold text-2xl text-[#1A1F36] mb-2">Your details</h2>
      <p className="text-[#6B7A99] text-sm mb-8">This information helps build trust with exchange partners.</p>
      <div className="flex flex-col gap-5 mb-8">
        <InputField label="Full Name" value={data.name} onChange={(v) => onChange("name", v)} placeholder="As per Aadhar card" />
        <InputField label="Age" value={data.age} onChange={(v) => onChange("age", v)} type="number" placeholder="Must be 18+" hint="You must be 18 or older to use CashBridge." />
      </div>
      <PrimaryBtn onClick={onNext} disabled={!valid}>Continue →</PrimaryBtn>
    </div>
  );
}

function PhoneScreen({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: UserData;
  onChange: (k: keyof UserData, v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const valid = data.phone.length === 10 && /^\d+$/.test(data.phone);
  return (
    <div className="min-h-screen bg-[#F5F3EF] flex flex-col px-6 pt-6">
      <BackBtn onClick={onBack} />
      <ProgressBar step={2} total={7} />
      <h2 className="font-display font-bold text-2xl text-[#1A1F36] mb-2">Phone number</h2>
      <p className="text-[#6B7A99] text-sm mb-8 leading-relaxed">
        We'll send a one-time password to verify your number.
      </p>
      <div className="mb-8">
        <label className="text-sm font-medium text-[#1A1F36] block mb-1.5">Mobile Number</label>
        <div className="flex gap-2">
          <div className="flex items-center px-4 py-3.5 rounded-xl border border-[#D8D3C8] bg-[#EDE9E1] text-[#1A1F36] font-medium text-base whitespace-nowrap">
            🇮🇳 +91
          </div>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="9876543210"
            className="flex-1 px-4 py-3.5 rounded-xl border border-[#D8D3C8] bg-white text-[#1A1F36] placeholder-[#6B7A99] focus:outline-none focus:ring-2 focus:ring-[#1A3A5C] transition-all text-base tracking-widest"
          />
        </div>
        <p className="text-xs text-[#6B7A99] mt-1.5">Standard SMS charges may apply.</p>
      </div>
      <PrimaryBtn onClick={onNext} disabled={!valid}>Send OTP →</PrimaryBtn>
    </div>
  );
}

function OTPScreen({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: UserData;
  onChange: (k: keyof UserData, v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [timer, setTimer] = useState(30);
  const [sent, setSent] = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = data.otp.split("").concat(Array(6).fill("")).slice(0, 6);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer((p) => p - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setSent(false);
    }
  }, [timer]);

  const handleDigit = (i: number, val: string) => {
    const v = val.replace(/\D/g, "").slice(-1);
    const arr = digits.map((d, idx) => (idx === i ? v : d));
    onChange("otp", arr.join(""));
    if (v && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const valid = data.otp.replace(/\D/g, "").length === 6;

  return (
    <div className="min-h-screen bg-[#F5F3EF] flex flex-col px-6 pt-6">
      <BackBtn onClick={onBack} />
      <ProgressBar step={3} total={7} />
      <h2 className="font-display font-bold text-2xl text-[#1A1F36] mb-2">Enter OTP</h2>
      <p className="text-[#6B7A99] text-sm mb-8 leading-relaxed">
        We sent a 6-digit code to <span className="font-semibold text-[#1A1F36]">+91 {data.phone}</span>
      </p>
      <div className="flex gap-2 mb-4">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="tel"
            maxLength={1}
            value={d}
            onChange={(e) => handleDigit(i, e.target.value)}
            onKeyDown={(e) => handleKey(i, e)}
            className="flex-1 aspect-square text-center text-xl font-bold rounded-xl border-2 border-[#D8D3C8] bg-white text-[#1A1F36] focus:outline-none focus:border-[#1A3A5C] focus:ring-2 focus:ring-[#1A3A5C]/20 transition-all"
          />
        ))}
      </div>
      <p className="text-sm text-[#6B7A99] mb-8">
        {sent ? (
          <>Resend in <span className="font-semibold text-[#1A1F36]">{timer}s</span></>
        ) : (
          <button onClick={() => { setTimer(30); setSent(true); }} className="text-[#1A3A5C] font-semibold underline">
            Resend OTP
          </button>
        )}
      </p>
      <PrimaryBtn onClick={onNext} disabled={!valid}>Verify →</PrimaryBtn>
      <p className="text-center text-xs text-[#6B7A99] mt-4">
        Demo: use any 6 digits to continue.
      </p>
    </div>
  );
}

function EmailScreen({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: UserData;
  onChange: (k: keyof UserData, v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  return (
    <div className="min-h-screen bg-[#F5F3EF] flex flex-col px-6 pt-6">
      <BackBtn onClick={onBack} />
      <ProgressBar step={4} total={7} />
      <h2 className="font-display font-bold text-2xl text-[#1A1F36] mb-2">Email address</h2>
      <p className="text-[#6B7A99] text-sm mb-8 leading-relaxed">
        Used for transaction receipts and account recovery.
      </p>
      <div className="mb-8">
        <InputField label="Email" value={data.email} onChange={(v) => onChange("email", v)} type="email" placeholder="you@example.com" hint="We'll send a verification link to confirm." />
      </div>
      <PrimaryBtn onClick={onNext} disabled={!valid}>Continue →</PrimaryBtn>
    </div>
  );
}

function AadharScreen({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: UserData;
  onChange: (k: keyof UserData, v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const raw = data.aadhar.replace(/\D/g, "");
  const formatted = raw.match(/.{1,4}/g)?.join(" ") ?? raw;
  const valid = raw.length === 12;
  return (
    <div className="min-h-screen bg-[#F5F3EF] flex flex-col px-6 pt-6">
      <BackBtn onClick={onBack} />
      <ProgressBar step={5} total={7} />
      <h2 className="font-display font-bold text-2xl text-[#1A1F36] mb-2">Aadhar verification</h2>
      <p className="text-[#6B7A99] text-sm mb-6 leading-relaxed">
        Your 12-digit Aadhar number verifies your identity. We never store your full number.
      </p>

      <div className="bg-[#EBF0F7] border border-[#1A3A5C]/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <svg className="mt-0.5 flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#1A3A5C" fillOpacity="0.15" stroke="#1A3A5C" strokeWidth="1.5"/>
          <path d="M9 12l2 2 4-4" stroke="#1A3A5C" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <div>
          <p className="font-semibold text-[#1A3A5C] text-sm">Secure & Encrypted</p>
          <p className="text-xs text-[#6B7A99] mt-0.5">Your data is protected under IT Act 2000 and UIDAI guidelines. Only masked digits are shared with partners.</p>
        </div>
      </div>

      <div className="mb-8">
        <label className="text-sm font-medium text-[#1A1F36] block mb-1.5">Aadhar Number</label>
        <input
          type="tel"
          value={formatted}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
            onChange("aadhar", raw);
          }}
          placeholder="XXXX XXXX XXXX"
          className="w-full px-4 py-3.5 rounded-xl border border-[#D8D3C8] bg-white text-[#1A1F36] placeholder-[#6B7A99] focus:outline-none focus:ring-2 focus:ring-[#1A3A5C] transition-all text-base tracking-widest font-mono"
        />
        <p className="text-xs text-[#6B7A99] mt-1.5">{raw.length} / 12 digits entered</p>
      </div>
      <PrimaryBtn onClick={onNext} disabled={!valid}>Verify Aadhar →</PrimaryBtn>
    </div>
  );
}

function LocationScreen({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: UserData;
  onChange: (k: keyof UserData, v: string | number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [granted, setGranted] = useState(false);

  const requestLocation = () => {
    setLoading(true);
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange("lat", pos.coords.latitude);
        onChange("lng", pos.coords.longitude);
        onChange("locationName", `${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`);
        setGranted(true);
        setLoading(false);
      },
      () => {
        // Fallback to demo location
        onChange("lat", 28.6139);
        onChange("lng", 77.209);
        onChange("locationName", "New Delhi, Delhi (Demo)");
        setGranted(true);
        setLoading(false);
      },
      { timeout: 8000 }
    );
  };

  const valid = data.lat !== null;

  return (
    <div className="min-h-screen bg-[#F5F3EF] flex flex-col px-6 pt-6">
      <BackBtn onClick={onBack} />
      <ProgressBar step={6} total={7} />
      <h2 className="font-display font-bold text-2xl text-[#1A1F36] mb-2">Share your location</h2>
      <p className="text-[#6B7A99] text-sm mb-2 leading-relaxed">
        Location is <span className="font-semibold text-[#1A1F36]">mandatory</span> — it lets us find exchange partners within walking distance.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <span className="text-xl">📍</span>
        <p className="text-sm text-amber-800 leading-relaxed">
          Your exact location is <strong>never shared</strong> with others. Only your approximate area (within 500m) is shown to partners.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 py-8">
        {/* Map placeholder */}
        <div className="w-full h-48 rounded-2xl bg-[#EBF0F7] border border-[#D8D3C8] relative overflow-hidden flex items-center justify-center">
          {granted ? (
            <>
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-20">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-[#1A3A5C]/30" />
                ))}
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#E8980A] flex items-center justify-center shadow-lg animate-pulse">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
                  </svg>
                </div>
                <p className="font-semibold text-[#1A3A5C] text-sm">{data.locationName}</p>
              </div>
            </>
          ) : (
            <div className="text-center text-[#6B7A99]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mx-auto mb-2 opacity-40">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="currentColor"/>
              </svg>
              <p className="text-sm">Tap below to detect location</p>
            </div>
          )}
        </div>

        <button
          onClick={requestLocation}
          disabled={loading || granted}
          className={`w-full py-4 rounded-xl font-semibold text-base transition-all active:scale-[0.98] ${
            granted
              ? "bg-emerald-500 text-white cursor-default"
              : "bg-[#E8980A] text-white hover:bg-[#D4880A]"
          } disabled:opacity-60`}
        >
          {loading ? "Detecting location…" : granted ? "✓ Location Confirmed" : "📍 Detect My Location"}
        </button>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </div>

      <PrimaryBtn onClick={onNext} disabled={!valid}>
        {valid ? "Complete Setup →" : "Location required to continue"}
      </PrimaryBtn>
    </div>
  );
}

function Dashboard({
  data,
  selectedMatch,
  onSelectMatch,
  onBack,
}: {
  data: UserData;
  selectedMatch: Match | null;
  onSelectMatch: (m: Match | null) => void;
  onBack: () => void;
}) {
  const [filter, setFilter] = useState<"all" | Role>("all");
  const oppositeRole: Role = data.role === "need-cash" ? "need-online" : "need-cash";

  const filtered = DEMO_MATCHES.filter((m) =>
    filter === "all" ? true : m.role === filter
  );

  if (selectedMatch) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex flex-col px-6 pt-6">
        <BackBtn onClick={() => onSelectMatch(null)} />
        <div className="bg-white rounded-3xl border border-[#D8D3C8] overflow-hidden mb-6">
          <div className="bg-[#1A3A5C] px-6 pt-8 pb-10 relative">
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#F5F3EF] rounded-t-3xl" />
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#E8980A] flex items-center justify-center font-display font-bold text-2xl text-white">
                {selectedMatch.avatar}
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-white">{selectedMatch.name}</h3>
                <p className="text-white/60 text-sm">{selectedMatch.age} years • {selectedMatch.distance}</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-4">
              {selectedMatch.verified && <VerifiedBadge />}
              <span className="text-xs text-[#6B7A99]">★ {selectedMatch.rating} rating</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: "Needs", value: selectedMatch.role === "need-cash" ? "Cash" : "Online Money" },
                { label: "Amount", value: `₹${selectedMatch.amount.toLocaleString("en-IN")}` },
                { label: "Distance", value: selectedMatch.distance },
                { label: "ID Verified", value: selectedMatch.verified ? "Yes" : "Pending" },
              ].map((item) => (
                <div key={item.label} className="bg-[#F5F3EF] rounded-xl p-3">
                  <p className="text-xs text-[#6B7A99] mb-0.5">{item.label}</p>
                  <p className="font-semibold text-[#1A1F36] text-sm">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-xs text-amber-800 leading-relaxed">
              <strong>Safety tip:</strong> Always meet in a public place. Verify their Aadhar masked number before completing any exchange. Never share your UPI PIN.
            </div>
            <button className="w-full py-4 rounded-xl bg-[#E8980A] text-white font-display font-bold text-base hover:bg-[#D4880A] active:scale-[0.98] transition-all">
              Send Exchange Request
            </button>
            <button className="w-full py-3 rounded-xl text-[#6B7A99] text-sm font-medium mt-2 hover:text-[#1A1F36] transition-colors">
              Report Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF] flex flex-col">
      {/* Top bar */}
      <div className="px-6 pt-6 pb-4 bg-white border-b border-[#D8D3C8]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-xl text-[#1A1F36]">Hello, {data.name.split(" ")[0]} 👋</h2>
            <p className="text-xs text-[#6B7A99]">📍 {data.locationName}</p>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${data.role === "need-cash" ? "bg-[#EBF0F7] text-[#1A3A5C]" : "bg-[#FFF8EC] text-[#E8980A]"}`}>
            {data.role === "need-cash" ? "💵 Need Cash" : "📱 Need Online"}
          </div>
        </div>
        {/* Request card */}
        <div className="bg-[#1A3A5C] rounded-2xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-white/60 text-xs mb-0.5">Nearest match</p>
            <p className="font-display font-bold text-white text-lg">
              {DEMO_MATCHES.find((m) => m.role === oppositeRole)?.name ?? "Searching..."}
            </p>
            <p className="text-[#E8980A] text-xs font-semibold">
              {DEMO_MATCHES.find((m) => m.role === oppositeRole)?.distance} away
            </p>
          </div>
          <button
            onClick={() => onSelectMatch(DEMO_MATCHES.find((m) => m.role === oppositeRole) ?? null)}
            className="px-4 py-2 rounded-xl bg-[#E8980A] text-white text-sm font-semibold hover:bg-[#D4880A] transition-colors"
          >
            Connect
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="px-6 pt-4 pb-2 flex gap-2">
        {(["all", "need-cash", "need-online"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f
                ? "bg-[#1A3A5C] text-white"
                : "bg-white border border-[#D8D3C8] text-[#6B7A99] hover:border-[#1A3A5C]"
            }`}
          >
            {f === "all" ? "All" : f === "need-cash" ? "💵 Need Cash" : "📱 Need Online"}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 pb-8 pt-2">
        <p className="text-xs text-[#6B7A99] mb-3 font-medium">{filtered.length} people nearby</p>
        <div className="flex flex-col gap-3">
          {filtered.map((match) => (
            <button
              key={match.id}
              onClick={() => onSelectMatch(match)}
              className="bg-white rounded-2xl border border-[#D8D3C8] p-4 flex items-center gap-4 text-left hover:border-[#1A3A5C] hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1A3A5C] flex items-center justify-center font-display font-bold text-white text-sm flex-shrink-0">
                {match.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-[#1A1F36] text-sm truncate">{match.name}</p>
                  {match.verified && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#10B981">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <p className="text-xs text-[#6B7A99]">{match.distance} • ★ {match.rating}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${match.role === "need-cash" ? "bg-[#EBF0F7] text-[#1A3A5C]" : "bg-[#FFF8EC] text-[#E8980A]"}`}>
                    {match.role === "need-cash" ? "Need Cash" : "Need Online"}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-display font-bold text-[#1A1F36] text-sm">₹{match.amount.toLocaleString("en-IN")}</p>
                <p className="text-xs text-[#6B7A99]">amount</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────────

const SCREEN_ORDER: Screen[] = [
  "landing",
  "register-role",
  "register-details",
  "register-phone",
  "register-otp",
  "register-email",
  "register-aadhar",
  "register-location",
  "dashboard",
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [data, setData] = useState<UserData>({
    role: null,
    name: "",
    age: "",
    phone: "",
    otp: "",
    email: "",
    aadhar: "",
    lat: null,
    lng: null,
    locationName: "",
  });

  const change = (k: keyof UserData, v: string | number | null) =>
    setData((prev) => ({ ...prev, [k]: v }));

  const go = (s: Screen) => setScreen(s);
  const next = () => {
    const i = SCREEN_ORDER.indexOf(screen);
    if (i >= 0 && i < SCREEN_ORDER.length - 1) setScreen(SCREEN_ORDER[i + 1]);
  };
  const back = () => {
    const i = SCREEN_ORDER.indexOf(screen);
    if (i > 0) setScreen(SCREEN_ORDER[i - 1]);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F5F3EF] overflow-hidden">
      {screen === "landing" && <LandingScreen onStart={() => go("register-role")} />}
      {screen === "register-role" && (
        <RoleScreen onSelect={(r) => { change("role", r as string); next(); }} onBack={back} />
      )}
      {screen === "register-details" && (
        <DetailsScreen data={data} onChange={change} onNext={next} onBack={back} />
      )}
      {screen === "register-phone" && (
        <PhoneScreen data={data} onChange={change} onNext={next} onBack={back} />
      )}
      {screen === "register-otp" && (
        <OTPScreen data={data} onChange={change} onNext={next} onBack={back} />
      )}
      {screen === "register-email" && (
        <EmailScreen data={data} onChange={change} onNext={next} onBack={back} />
      )}
      {screen === "register-aadhar" && (
        <AadharScreen data={data} onChange={change} onNext={next} onBack={back} />
      )}
      {screen === "register-location" && (
        <LocationScreen data={data} onChange={change} onNext={next} onBack={back} />
      )}
      {screen === "dashboard" && (
        <Dashboard data={data} selectedMatch={selectedMatch} onSelectMatch={setSelectedMatch} onBack={back} />
      )}
    </div>
  );
}
