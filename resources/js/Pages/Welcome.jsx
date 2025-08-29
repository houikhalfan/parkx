// resources/js/Pages/Welcome.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';

const InputField = ({
  label,
  type = 'text',
  value,
  onChange,
  showToggle = false,
  show = false,
  onToggle = () => {},
  name,
  autoComplete,
  placeholder,
  error,
}) => (
  <div className="space-y-1">
    {label && (
      <label className="text-sm text-gray-100 md:text-gray-700 dark:text-slate-200 font-medium" htmlFor={name}>
        {label}
      </label>
    )}
    <div className="relative">
      <input
        id={name}
        name={name}
        type={showToggle ? (show ? 'text' : 'password') : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-white/40 dark:border-slate-600/60
                    rounded-lg text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      error ? 'border-red-300' : ''
                    }`}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
          aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        >
          {show ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      )}
    </div>
    {error && <p className="text-xs text-red-200 md:text-red-600">{error}</p>}
  </div>
);

export default function Welcome() {
  // Apply saved theme (dark/light)
  useEffect(() => {
    const stored = localStorage.getItem('parkx-theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const next = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next === 'dark');
  }, []);

  const [activeTab, setActiveTab] = useState('parkx'); // 'parkx' | 'contractor'
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const { props } = usePage();
  const flashMessage = props?.flash?.message || props?.flash?.success || props?.flash?.info;

  // Background image (full page)
  const backgroundImages = useMemo(() => ['/images/11s.jpeg', '/images/2.jpg'], []);
  const backgroundImage = useMemo(
    () => backgroundImages[Math.floor(Math.random() * backgroundImages.length)],
    [backgroundImages]
  );

  // Forms
  const loginForm = useForm({ email: '', password: '' });
  const signupForm = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    company_name: '',
    role: '',
  });

  const handleLogin = (e) => {
    e.preventDefault();
    const payload = {
      email: loginForm.data.email,
      password: loginForm.data.password,
      type: activeTab, // 'parkx' or 'contractor'
    };
    router.post('/login', payload, {
      onSuccess: () => {
        if (activeTab === 'contractor') router.visit('/contractant');
        else router.visit('/dashboard');
      },
      preserveScroll: true,
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    signupForm.post('/contractor/register', {
      onSuccess: () => {
        signupForm.reset();
        setShowSignup(false);
        setActiveTab('contractor');
      },
      preserveScroll: true,
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* FULL-PAGE BACKGROUND IMAGE */}
      <img
        src={backgroundImage}
        alt="HSE ParkX background"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/45 dark:bg-black/55" />

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left hero text (desktop) */}
        <div className="hidden md:flex flex-1 items-center justify-center text-center px-6">
          <div className="text-white drop-shadow-md max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Bienvenue sur HSE ParkX</h1>
            <p className="text-lg lg:text-xl">
              Plateforme de supervision et de signalement pour un environnement de travail plus sûr.
            </p>
          </div>
        </div>

        {/* RIGHT AUTH PANEL */}
        <div className="w-full md:w-[480px] lg:w-[520px] ml-auto flex items-center justify-center p-5 md:p-8">
          <div className="w-full max-w-md">
            {/* Glass card */}
            <div className="backdrop-blur-md bg-white/85 dark:bg-slate-800/75 rounded-2xl shadow-2xl p-6 flex flex-col min-h-[540px] max-h-[84vh]">
              {/* Logo + Heading */}
              <div className="mb-5 text-center">
                <img src="/images/logo.png" alt="logo" className="mx-auto h-12 w-auto mb-3" />
                <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-slate-100">Connexion</h2>
                <p className="text-gray-600 dark:text-slate-300 text-sm">
                  Connectez-vous en tant qu’utilisateur ou contractant
                </p>
              </div>

              {/* Tabs */}
              <div
                className="flex bg-white/70 dark:bg-slate-900/40 rounded-lg p-1 mb-4 border border-white/50 dark:border-slate-700/50"
                role="tablist"
                aria-label="Type de compte"
              >
                <button
                  role="tab"
                  aria-selected={activeTab === 'parkx'}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                    activeTab === 'parkx'
                      ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow'
                      : 'text-gray-700 dark:text-slate-300'
                  }`}
                  onClick={() => { setActiveTab('parkx'); setShowSignup(false); }}
                >
                  ParkX
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'contractor'}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                    activeTab === 'contractor'
                      ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow'
                      : 'text-gray-700 dark:text-slate-300'
                  }`}
                  onClick={() => setActiveTab('contractor')}
                >
                  Contractant
                </button>
              </div>

              {/* Flash message */}
              {flashMessage && (
                <div className="mb-3 px-4 py-2 text-green-900 bg-emerald-100/80 border border-emerald-200 rounded text-center dark:text-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800">
                  {flashMessage}
                </div>
              )}

              {/* Forms area */}
              <div className="flex-1 overflow-hidden">
                {!showSignup ? (
                  // LOGIN
                  <form onSubmit={handleLogin} className="space-y-4">
                    <InputField
                      label="Adresse e-mail"
                      type="email"
                      name="email"
                      value={loginForm.data.email}
                      onChange={(val) => loginForm.setData('email', val)}
                      autoComplete="username"
                      placeholder="exemple@mail.com"
                      error={loginForm.errors?.email}
                    />
                    <InputField
                      label="Mot de passe"
                      name="password"
                      value={loginForm.data.password}
                      onChange={(val) => loginForm.setData('password', val)}
                      showToggle
                      show={showLoginPassword}
                      onToggle={() => setShowLoginPassword((s) => !s)}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      error={loginForm.errors?.password}
                    />
                    <button
                      type="submit"
                      disabled={loginForm.processing}
                      className="w-full py-3 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loginForm.processing ? 'Connexion…' : 'Se connecter'}
                    </button>
                    {loginForm.errors?.type && (
                      <p className="text-xs text-red-600 text-center mt-2">{loginForm.errors.type}</p>
                    )}
                  </form>
                ) : (
                  // SIGNUP (scrollable area)
                  <div className="max-h-[320px] overflow-y-auto custom-scrollbar pr-2 -mr-2">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <InputField
                        label="Nom complet"
                        name="name"
                        value={signupForm.data.name}
                        onChange={(val) => signupForm.setData('name', val)}
                        autoComplete="name"
                        placeholder="Nom prenom"
                        error={signupForm.errors?.name}
                      />
                      <InputField
                        label="Email"
                        type="email"
                        name="email"
                        value={signupForm.data.email}
                        onChange={(val) => signupForm.setData('email', val)}
                        autoComplete="email"
                        placeholder="exemple@mail.com"
                        error={signupForm.errors?.email}
                      />
                      <InputField
                        label="Mot de passe"
                        name="password"
                        value={signupForm.data.password}
                        onChange={(val) => signupForm.setData('password', val)}
                        showToggle
                        show={showSignupPassword}
                        onToggle={() => setShowSignupPassword((s) => !s)}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        error={signupForm.errors?.password}
                      />
                      <InputField
                        label="Confirmer le mot de passe"
                        name="password_confirmation"
                        value={signupForm.data.password_confirmation}
                        onChange={(val) => signupForm.setData('password_confirmation', val)}
                        showToggle
                        show={showSignupConfirm}
                        onToggle={() => setShowSignupConfirm((s) => !s)}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        error={signupForm.errors?.password_confirmation}
                      />
                      <InputField
                        label="Téléphone"
                        name="phone"
                        value={signupForm.data.phone}
                        onChange={(val) => signupForm.setData('phone', val)}
                        autoComplete="tel"
                        placeholder="+212 6 12 34 56 78"
                        error={signupForm.errors?.phone}
                      />
                      <InputField
                        label="Entreprise"
                        name="company_name"
                        value={signupForm.data.company_name}
                        onChange={(val) => signupForm.setData('company_name', val)}
                        placeholder="Votre société"
                        error={signupForm.errors?.company_name}
                      />
                      <div>
                        <label className="text-sm text-gray-100 md:text-gray-700 dark:text-slate-200 font-medium">
                          Rôle
                        </label>
                        <select
                          value={signupForm.data.role}
                          onChange={(e) => signupForm.setData('role', e.target.value)}
                          className="mt-1 w-full px-3 py-2 bg-white/80 dark:bg-slate-800/80 border border-white/40 dark:border-slate-600/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Sélectionner un rôle</option>
                          <option value="manager">Manager</option>
                          <option value="supervisor">Superviseur</option>
                          <option value="worker">Ouvrier</option>
                        </select>
                        {signupForm.errors?.role && (
                          <p className="text-xs text-red-200 md:text-red-600 mt-1">{signupForm.errors.role}</p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={signupForm.processing}
                        className="w-full py-3 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {signupForm.processing ? 'Envoi…' : 'Demander un accès'}
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Toggle link */}
              <div className="mt-4 text-center text-sm">
                {showSignup ? (
                  <>
                    Déjà inscrit ?{' '}
                    <button onClick={() => setShowSignup(false)} className="text-blue-200 md:text-blue-600 hover:underline">
                      Se connecter
                    </button>
                  </>
                ) : (
                  activeTab === 'contractor' && (
                    <>
                      Pas encore de compte ?{' '}
                      <button onClick={() => setShowSignup(true)} className="text-blue-200 md:text-blue-600 hover:underline">
                        Créer un compte
                      </button>
                    </>
                  )
                )}
              </div>

              <p className="text-xs text-gray-300 md:text-gray-400 dark:text-slate-400 text-center mt-2">
                ParkX — Parcs Industriels Durables.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
