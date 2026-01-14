import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { GridBackground } from '@/components/ui/gridBackground';

export default function Login() {
    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-hidden">
            <GridBackground />

            {/* Navbar Minimal */}
            <nav className="relative z-10 p-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter group">
                    <div className="bg-white text-black w-8 h-8 flex items-center justify-center rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform">PF</div>
                    <span className="text-white">ProjectFlow</span>
                </Link>
                <Link to="/signup">
                    <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5">Sign up</Button>
                </Link>
            </nav>

            <main className="flex-grow flex items-center justify-center p-4 md:p-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                        <p className="text-slate-500">Enter your credentials to access your account</p>
                    </div>

                    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 space-y-6 shadow-2xl backdrop-blur-sm">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-400">Email</Label>
                                <Input
                                    id="email"
                                    placeholder="m@example.com"
                                    type="email"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-white/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-400">Password</Label>
                                <PasswordInput
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-white/20"
                                />
                            </div>
                        </div>

                        <Button className="w-full font-bold h-12 bg-white text-black hover:bg-slate-200">
                            Sign In
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#0A0A0A] px-2 text-slate-500">Or continue with</span>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full border-white/10 bg-transparent hover:bg-white/5 text-white hover:text-white" type="button">
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                            </svg>
                            Google
                        </Button>
                    </div>

                    <p className="text-center text-sm text-slate-500">
                        Don't have an account? <Link to="/signup" className="underline hover:text-white">Sign up</Link>
                    </p>
                </motion.div>
            </main>
        </div>
    );
}
