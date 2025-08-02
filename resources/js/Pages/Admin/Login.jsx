// resources/js/Pages/Admin/Login.jsx
import { useForm } from '@inertiajs/react';

export default function AdminLogin() {
  const { data, setData, post, errors } = useForm({
    email: '',
    password: '',
  });

const handleSubmit = (e) => {
  e.preventDefault();

  post('/admin/login', {
    onSuccess: () => {
      window.location.href = '/admin'; // or use route helper if you're using Ziggy
    },
    onError: (errors) => {
      console.error(errors); // optional: useful during dev
    },
  });
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}