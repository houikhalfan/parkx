// resources/js/Pages/Admin/Login.jsx
import { useForm } from '@inertiajs/react';

export default function AdminLogin() {
  const { data, setData, post, errors, processing } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/admin/login', {
      onSuccess: () => {
        window.location.href = '/admin';
      },
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-center bg-cover animate-pan"
          style={{
            backgroundImage: "url('/images/INNO.jpg')",
            willChange: 'transform',
          }}
        />
        {/* Soft dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/35" />
        {/* Optional subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-xl">
          {/* Glassy card */}
          <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 shadow-2xl ring-1 ring-black/5 p-8 sm:p-10">
            {/* Logo */}
            <div className="flex justify-center">
              <img
                src="/images/logo.png"         // <-- change to your logo path
                alt="Company logo"
                className="h-18 w-auto mb-4"
                draggable="false"
              />
            </div>

            <p className="mt-2 text-center text-gray-700">
              Connectez-vous à votre tableau de bord administrateur
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-800">
                  Adresse e-mail
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder="admin@entreprise.com"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  aria-invalid={!!errors.email}
                  className="w-full rounded-lg border border-gray-300 bg-white/90 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  required
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-800">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  aria-invalid={!!errors.password}
                  className="w-full rounded-lg border border-gray-300 bg-white/90 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  required
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <label htmlFor="remember" className="select-none text-sm text-gray-800">
                  Se souvenir de moi
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={processing}
                className="w-full rounded-lg bg-black text-white py-3 font-medium transition hover:opacity-90 disabled:opacity-70"
              >
                {processing ? 'Connexion…' : 'Se connecter'}
              </button>
            </form>

            {/* Forgot Password */}
            <div className="mt-6 text-center">
              <a
                href="#"
                className="text-sm text-gray-700 underline-offset-2 hover:text-gray-900"
              >
                Mot de passe oublié&nbsp;?
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Component-scoped styles */}
      <style>{`
        /* Smooth pan + slight zoom (Ken Burns) */
        @keyframes pan {
          0%   { transform: scale(1.08) translate(0%, 0%); }
          50%  { transform: scale(1.12) translate(-2%, -1%); }
          100% { transform: scale(1.08) translate(-4%, -3%); }
        }
        .animate-pan {
          animation: pan 36s ease-in-out infinite alternate;
          transform-origin: center;
        }
        /* Respect user reduced-motion preference */
        @media (prefers-reduced-motion: reduce) {
          .animate-pan { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
