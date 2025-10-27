import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaInfoCircle } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showTestCredentials, setShowTestCredentials] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(email, password);
    
    if (success) {
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      
      // Get user from localStorage to determine role
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        // Redirect based on role
        if (user.role === 'student') {
          navigate('/student-dashboard');
        } else if (user.role === 'event-member') {
          navigate('/event-panel');
        } else if (user.role === 'admin') {
          navigate('/admin-dashboard');
        }
      }
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
    }
  };

  const handleTestLogin = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
    setShowTestCredentials(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-8 rounded-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center"
            >
              <FaUser className="text-2xl text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background border-border"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-background border-border"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 space-y-4">
            {/* Test Credentials Toggle */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowTestCredentials(!showTestCredentials)}
                className="text-sm text-primary hover:underline inline-flex items-center gap-2"
              >
                <FaInfoCircle />
                {showTestCredentials ? 'Hide' : 'Show'} Test Credentials
              </button>
            </div>

            {/* Test Credentials */}
            {showTestCredentials && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-4 rounded-lg space-y-3 text-sm"
              >
                <h3 className="font-semibold text-center mb-3">Test Accounts</h3>
                
                {/* Student */}
                <div className="border border-border rounded p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-400">👨‍🎓 Student</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTestLogin('john@student.edu', 'student123')}
                      className="h-7 text-xs"
                    >
                      Use
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Email: john@student.edu</div>
                    <div>Password: student123</div>
                  </div>
                </div>

                {/* Event Member */}
                <div className="border border-border rounded p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-purple-400">🎯 Event Member</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTestLogin('coordinator@college.edu', 'event123')}
                      className="h-7 text-xs"
                    >
                      Use
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Email: coordinator@college.edu</div>
                    <div>Password: event123</div>
                  </div>
                </div>

                {/* Admin */}
                <div className="border border-border rounded p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-red-400">👑 Admin</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTestLogin('admin@college.edu', 'admin123')}
                      className="h-7 text-xs"
                    >
                      Use
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Email: admin@college.edu</div>
                    <div>Password: admin123</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Signup Link */}
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
