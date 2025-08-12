// resources/js/Pages/Welcome.jsx
import React, { useState, useMemo } from 'react';
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
      <label className="text-sm text-gray-700 font-medium" htmlFor={name}>
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
        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
          error ? 'border-red-300' : 'border-gray-200'
        }`}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

export default function Welcome() {
  const [activeTab, setActiveTab] = useState('parkx'); // 'parkx' | 'contractor'
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const { props } = usePage();
  const flashMessage = props?.flash?.message;

  // Random hero image (cached list)
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
      // backend requires 'name' only for contractor; send a stub if needed
      name: activeTab === 'contractor' ? 'Contractor' : undefined,
    };

    router.post('/login', payload, {
      onSuccess: () => router.visit('/dashboard'),
      onError: () => {
        // errors are shown inline by loginForm.errors
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
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left — Hero (stacked above on mobile, side-by-side on md+) */}
      <div className="relative w-full md:w-1/2 lg:w-2/3">
        {/* Use an img for better object-fit behavior */}
        <img
          src={backgroundImage}
          alt=""
          className="h-[40vh] w-full object-cover md:h-full md:min-h-screen"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Bienvenue sur HSE ParkX</h1>
          <p className="text-base md:text-lg max-w-xl">
            Plateforme de supervision et de signalement pour un environnement de travail plus sûr.
          </p>
        </div>
      </div>

      {/* Right — Auth panel */}
      <div className="w-full md:w-1/2 lg:w-1/3 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* Logo + Heading */}
          <div className="mb-5 text-center">
            <img src="/images/logo.png" alt="logo" className="mx-auto h-12 w-auto mb-3" />
            <h2 className="text-2xl font-bold mb-1">Connexion</h2>
            <p className="text-gray-500 text-sm">Connectez-vous en tant qu’utilisateur ou contractant</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6" role="tablist" aria-label="Type de compte">
            <button
              role="tab"
              aria-selected={activeTab === 'parkx'}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                activeTab === 'parkx' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
              onClick={() => {
                setActiveTab('parkx');
                setShowSignup(false);
              }}
            >
              ParkX
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'contractor'}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                activeTab === 'contractor' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('contractor')}
            >
              Contractant
            </button>
          </div>

          {/* Flash message */}
          {flashMessage && (
            <div className="mb-4 px-4 py-2 text-green-800 bg-green-100 border border-green-200 rounded text-center">
              {flashMessage}
            </div>
          )}

          {/* Login / Signup */}
          {!showSignup ? (
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

              {/* Inline generic error (if the backend returns a top-level message) */}
              {loginForm.errors?.type && (
                <p className="text-xs text-red-600 text-center">{loginForm.errors.type}</p>
              )}
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <InputField
                label="Nom complet"
                name="name"
                value={signupForm.data.name}
                onChange={(val) => signupForm.setData('name', val)}
                autoComplete="name"
                placeholder="Jean Dupont"
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
                <label className="text-sm text-gray-700 font-medium">Rôle</label>
                <select
                  value={signupForm.data.role}
                  onChange={(e) => signupForm.setData('role', e.target.value)}
                  className={`mt-1 w-full px-3 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    signupForm.errors?.role ? 'border-red-300' : 'border-gray-200'
                  }`}
                >
                  <option value="">Sélectionner un rôle</option>
                  <option value="manager">Manager</option>
                  <option value="supervisor">Superviseur</option>
                  <option value="worker">Ouvrier</option>
                </select>
                {signupForm.errors?.role && (
                  <p className="text-xs text-red-600 mt-1">{signupForm.errors.role}</p>
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
          )}

          {/* Toggle link */}
          <div className="mt-4 text-center text-sm">
            {showSignup ? (
              <>
                Déjà inscrit ?{' '}
                <button onClick={() => setShowSignup(false)} className="text-blue-600 hover:underline">
                  Se connecter
                </button>
              </>
            ) : (
              activeTab === 'contractor' && (
                <>
                  Pas encore de compte ?{' '}
                  <button onClick={() => setShowSignup(true)} className="text-blue-600 hover:underline">
                    Créer un compte
                  </button>
                </>
              )
            )}
          </div>

          <p className="text-xs text-gray-400 text-center mt-6">ParkX — Parcs Industriels Durables.</p>
        </div>
      </div>
    </div>
  );
}
