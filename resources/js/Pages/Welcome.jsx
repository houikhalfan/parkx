import React, { useState, useMemo } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';

const InputField = ({ label, type = 'text', value, onChange, showToggle, show, onToggle }) => (
  <div className="space-y-1">
    {label && <label className="text-sm text-gray-600 font-medium">{label}</label>}
    <div className="relative">
      <input
        type={showToggle ? (show ? 'text' : 'password') : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  </div>
);

export default function Welcome() {
  const [activeTab, setActiveTab] = useState('parkx');
  const [showPassword, setShowPassword] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const { props } = usePage();
  const flashMessage = props?.flash?.message;

  const backgroundImages = useMemo(() => ['/images/11s.jpeg', '/images/2.jpg'], []);
  const backgroundImage = useMemo(() => backgroundImages[Math.floor(Math.random() * backgroundImages.length)], [backgroundImages]);

  const loginForm = useForm({ email: '', password: '', type: 'parkx', name: '' });
  const signupForm = useForm({
    name: '', email: '', password: '', password_confirmation: '', phone: '', company_name: '', role: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    const loginData = {
      email: loginForm.data.email,
      password: loginForm.data.password,
      type: activeTab,
      name: activeTab === 'contractor' ? loginForm.data.email || 'Contractor' : undefined
    };

    router.post('/login', loginData, {
      onSuccess: () => router.visit('/dashboard'),
      onError: (errors) => {
        console.error('❌ Login error:', errors);
        if (errors?.email) alert(errors.email);
      }
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    signupForm.post('/contractor/register', {
      onSuccess: () => {
        signupForm.reset();
        setShowSignup(false);
      },
      onError: (errors) => {
        console.log('❌ Signup error:', errors);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left image + welcome message */}
      <div
        className="md:w-2/3 w-full h-64 md:h-auto bg-cover bg-center relative"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white p-6">
          <h1 className="text-4xl font-bold mb-4">Bienvenue sur HSE ParkX</h1>
          <p className="text-lg max-w-xl">
            Plateforme de supervision et de signalement pour un environnement de travail plus sûr.
          </p>
        </div>
      </div>

      {/* Right login/signup form */}
      <div className="md:w-1/3 w-full bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
        <div className="mb-4 text-center">
  <img src="/images/logo.png" alt="logo" className="mx-auto h-34 w-auto mb-2" />
  <h2 className="text-2xl font-bold mb-1">Connexion</h2>
  <p className="text-gray-500 text-sm">Connectez-vous en tant qu'utilisateur ou administrateur</p>
</div>



          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${activeTab === 'parkx' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
              onClick={() => setActiveTab('parkx')}
            >
              ParkX
            </button>

            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${activeTab === 'contractor' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
              onClick={() => setActiveTab('contractor')}
            >
              Contractant
            </button>
          </div>

          {flashMessage && (
            <div className="mb-4 px-4 py-2 text-green-800 bg-green-100 border border-green-200 rounded text-center">
              {flashMessage}
            </div>
          )}

          {!showSignup ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <InputField label="Nom d'utilisateur" type="email" value={loginForm.data.email} onChange={(val) => loginForm.setData('email', val)} />
              <InputField label="Mot de passe" value={loginForm.data.password} onChange={(val) => loginForm.setData('password', val)} showToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
              <button type="submit" className="w-full py-3 bg-orange-500 text-white rounded-lg">Se connecter</button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <InputField label="Nom complet" value={signupForm.data.name} onChange={(val) => signupForm.setData('name', val)} />
              <InputField label="Email" type="email" value={signupForm.data.email} onChange={(val) => signupForm.setData('email', val)} />
              <InputField label="Mot de passe" value={signupForm.data.password} onChange={(val) => signupForm.setData('password', val)} showToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
              <InputField label="Confirmer le mot de passe" value={signupForm.data.password_confirmation} onChange={(val) => signupForm.setData('password_confirmation', val)} showToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
              <InputField label="Téléphone" value={signupForm.data.phone} onChange={(val) => signupForm.setData('phone', val)} />
              <InputField label="Entreprise" value={signupForm.data.company_name} onChange={(val) => signupForm.setData('company_name', val)} />
              <div>
                <label className="text-sm text-gray-600 font-medium">Rôle</label>
                <select value={signupForm.data.role} onChange={(e) => signupForm.setData('role', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2">
                  <option value="">Sélectionner un rôle</option>
                  <option value="manager">Manager</option>
                  <option value="supervisor">Superviseur</option>
                  <option value="worker">Ouvrier</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-yellow-500 text-white rounded-lg">Demander un accès</button>
            </form>
          )}

          <div className="mt-4 text-center text-sm">
            {showSignup ? (
              <>Déjà inscrit ? <button onClick={() => setShowSignup(false)} className="text-blue-500">Se connecter</button></>
            ) : (
              activeTab === 'contractor' && (
                <>Pas encore de compte ? <button onClick={() => setShowSignup(true)} className="text-blue-500">Créer un compte</button></>
              )
            )}
          </div>

          <p className="text-xs text-gray-400 text-center mt-6">
            ParkX- Parcs Industiels Durables.

          </p>
        </div>
      </div>
    </div>
  );
}
