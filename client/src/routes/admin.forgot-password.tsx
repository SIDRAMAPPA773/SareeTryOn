import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { SiteNav } from '@/views/components/site-nav';
import { API_BASE_URL } from '@/config/api';

export const Route = createFileRoute('/admin/forgot-password')({
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Reset link sent');
        setIsSent(true);
        if (data.previewUrl) {
           console.log("Preview URL for testing: ", data.previewUrl);
           setPreviewUrl(data.previewUrl);
        }
      } else {
        toast.error(data.message || 'Failed to send reset link');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SiteNav />
      <div className="flex flex-1 items-center justify-center px-4 mt-20">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
            Forgot Password
          </h1>
          
          {isSent ? (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-6">
                If an account exists for {email}, you will receive a password reset link shortly.
              </p>
              
              {previewUrl && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
                  <h4 className="text-yellow-800 font-semibold mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    Development Mode
                  </h4>
                  <p className="text-sm text-yellow-700 mb-2">No SMTP server is configured. You can use this direct link to reset the password:</p>
                  <a href={previewUrl} className="text-primary hover:underline font-medium text-sm break-all">
                    Click here to reset password
                  </a>
                </div>
              )}

              <Link to="/admin/login" className="text-primary hover:underline font-medium">
                Return to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 mt-4"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
              
              <div className="text-center mt-4">
                <Link to="/admin/login" className="text-sm text-primary hover:underline font-medium">
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
