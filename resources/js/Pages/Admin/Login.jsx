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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10">
          <h1 className="text-3xl font-semibold text-center">Connexion Admin</h1>
          <p className="mt-2 text-center text-gray-500">
            Connectez-vous à votre tableau de bord administrateur
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@entreprise.com"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                aria-invalid={!!errors.email}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                aria-invalid={!!errors.password}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                required
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
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
              <label htmlFor="remember" className="text-sm text-gray-800 select-none">
                Se souvenir de moi
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={processing}
              className="w-full rounded-lg bg-black text-white py-3 font-medium transition disabled:opacity-70"
            >
              {processing ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          {/* Forgot Password */}
          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700 underline-offset-2">
              Mot de passe oublié&nbsp;?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
