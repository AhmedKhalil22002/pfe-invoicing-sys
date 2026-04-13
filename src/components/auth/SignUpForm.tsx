import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';

interface SignUpFormProps {
  className?: string;
  goToAuthentication: () => void;
}

export const SignUpForm = ({ className, goToAuthentication }: SignUpFormProps) => {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: () => api.auth.signUp({ username, email, password }),
    onSuccess: () => {
      toast.success('Account created! An admin needs to approve your account before you can log in.');
      goToAuthentication();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Registration failed';
      toast.error(Array.isArray(message) ? message.join(', ') : message);
    }
  });

  const handleSubmit = () => {
    if (!username || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    signUp();
  };

  return (
    <div className={cn('flex flex-col gap-6 w-[350px]', className)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Fill in the details below to register.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isPending}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isPending}
          />
          {password && confirmPassword && password !== confirmPassword && (
            <span className="text-xs text-red-500">Passwords do not match</span>
          )}
        </div>

        <div className="flex flex-row gap-2">
          <Button variant="outline" className="w-full" onClick={goToAuthentication} disabled={isPending}>
            Cancel
          </Button>
          <Button className="w-full" onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Creating...' : 'Sign Up'}
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <a href="#" className="underline underline-offset-4 text-foreground"
            onClick={(e) => { e.preventDefault(); goToAuthentication(); }}>
            Log in
          </a>
        </div>
      </div>
    </div>
  );
};