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

    loginForm.setData('type', activeTab);

    // ✅ Laravel expects name for contractors during login
    if (activeTab === 'contractor') {
      loginForm.setData('name', loginForm.data.email || 'Contractor');
    }

    loginForm.post('/login', {
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
    <div className="min-h-screen flex bg-white">
      <div className="w-full max-w-md bg-white flex flex-col relative">
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-8">
            <div className="bg-gray-100 px-4 py-2 rounded-full">
              <span className="text-gray-700 font-medium">ParkX</span>
            </div>
          </div>

          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${activeTab === 'parkx' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
              onClick={() => setActiveTab('parkx')}>ParkX</button>
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${activeTab === 'contractor' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
              onClick={() => setActiveTab('contractor')}>Contractor</button>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {showSignup && activeTab === 'contractor' ? 'Contractor Signup' : 'Welcome back'}
            </h1>
            <p className="text-gray-600 text-sm">
              {showSignup && activeTab === 'contractor' ? 'Fill in details to request access' : 'Sign in to your account'}
            </p>
          </div>
        </div>

        <div className="flex-1 px-8 pb-8 overflow-y-auto">
          {flashMessage && (
            <div className="mb-4 px-4 py-2 text-green-800 bg-green-100 border border-green-200 rounded">
              {flashMessage}
            </div>
          )}

          {/* ParkX Login */}
          {activeTab === 'parkx' && !showSignup && (
            <form onSubmit={handleLogin} className="space-y-4">
              {loginForm.errors.email && <div className="text-red-600 text-sm">{loginForm.errors.email}</div>}
              <InputField label="Email" type="email" value={loginForm.data.email} onChange={(val) => loginForm.setData('email', val)} />
              <InputField label="Password" value={loginForm.data.password} onChange={(val) => loginForm.setData('password', val)} showToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
              <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg">Sign in</button>
            </form>
          )}

          {/* Contractor Login */}
          {activeTab === 'contractor' && !showSignup && (
            <form onSubmit={handleLogin} className="space-y-4">
              {loginForm.errors.email && <div className="text-red-600 text-sm">{loginForm.errors.email}</div>}
              <InputField label="Email" type="email" value={loginForm.data.email} onChange={(val) => loginForm.setData('email', val)} />
              <InputField label="Password" value={loginForm.data.password} onChange={(val) => loginForm.setData('password', val)} showToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
              <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg">Sign in</button>
              <p className="text-sm text-center mt-4">Don't have an account? <button type="button" onClick={() => setShowSignup(true)} className="text-blue-500">Sign up</button></p>
            </form>
          )}

          {/* Contractor Signup */}
          {activeTab === 'contractor' && showSignup && (
            <form onSubmit={handleSignup} className="space-y-4">
              {signupForm.errors.name && <div className="text-red-600 text-sm">{signupForm.errors.name}</div>}
              <InputField label="Full Name" value={signupForm.data.name} onChange={(val) => signupForm.setData('name', val)} />

              {signupForm.errors.email && <div className="text-red-600 text-sm">{signupForm.errors.email}</div>}
              <InputField label="Email" type="email" value={signupForm.data.email} onChange={(val) => signupForm.setData('email', val)} />

              {signupForm.errors.password && <div className="text-red-600 text-sm">{signupForm.errors.password}</div>}
              <InputField label="Password" value={signupForm.data.password} onChange={(val) => signupForm.setData('password', val)} showToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />

              <InputField label="Confirm Password" value={signupForm.data.password_confirmation} onChange={(val) => signupForm.setData('password_confirmation', val)} showToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />

              <InputField label="Phone Number" value={signupForm.data.phone} onChange={(val) => signupForm.setData('phone', val)} />
              <InputField label="Company Name" value={signupForm.data.company_name} onChange={(val) => signupForm.setData('company_name', val)} />

              {signupForm.errors.role && <div className="text-red-600 text-sm">{signupForm.errors.role}</div>}
              <div>
                <label className="text-sm text-gray-600 font-medium">Role</label>
                <select value={signupForm.data.role} onChange={(e) => signupForm.setData('role', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2">
                  <option value="">Select Role</option>
                  <option value="manager">Manager</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="worker">Worker</option>
                </select>
              </div>

              <button type="submit" className="w-full py-3 bg-yellow-500 text-white rounded-lg">Request Access</button>
              <p className="text-sm text-center mt-4">Already have an account? <button type="button" onClick={() => setShowSignup(false)} className="text-blue-500">Sign in</button></p>
            </form>
          )}
        </div>
      </div>

      <div className="hidden md:block flex-1 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }} />
    </div>
  );
}
