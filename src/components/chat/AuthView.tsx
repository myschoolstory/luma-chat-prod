import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2, User, Lock } from 'lucide-react';
import { useChatStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import type { AuthResponse } from '@shared/types';
export const AuthView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useChatStore((s) => s.setAuth);
  const handleAuth = async (mode: 'login' | 'register') => {
    if (username.length < 3 || password.length < 6) {
      toast.error('Username (3+) and Password (6+) too short');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json() as AuthResponse;
      if (data.success && data.user && data.token) {
        setAuth(data.user, data.token);
        toast.success(`Welcome back, ${data.user.username}!`);
      } else {
        toast.error(data.error || 'Authentication failed');
      }
    } catch (err) {
      toast.error('Network error during authentication');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-2xl glass overflow-hidden">
          <div className="h-1.5 bg-indigo-600 w-full" />
          <CardHeader className="text-center pt-8 pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg floating">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-display font-bold tracking-tight">Luma</CardTitle>
            <CardDescription>Secure minimalist messaging</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 rounded-xl bg-secondary/50 p-1">
                <TabsTrigger value="login" className="rounded-lg">Login</TabsTrigger>
                <TabsTrigger value="register" className="rounded-lg">Join</TabsTrigger>
              </TabsList>
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="pl-10 h-12 bg-secondary/30 border-none rounded-xl"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="pl-10 h-12 bg-secondary/30 border-none rounded-xl"
                  />
                </div>
              </div>
              <TabsContent value="login">
                <Button
                  onClick={() => handleAuth('login')}
                  disabled={loading}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition-all group"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                  {!loading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </TabsContent>
              <TabsContent value="register">
                <Button
                  onClick={() => handleAuth('register')}
                  disabled={loading}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition-all group"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                  {!loading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};