import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-400">
                    {label}
                </label>
                <input
                    className={`flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${className}`}
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);
Input.displayName = "Input";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', isLoading, children, ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";

        const variants = {
            primary: "bg-white text-black hover:bg-slate-200",
            outline: "border border-white/10 bg-transparent hover:bg-white/5 text-white",
            ghost: "hover:bg-white/5 text-white"
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${className}`}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

const GridBackground = () => (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
);

/* --- OTP PAGE --- */

export default function Otp() {
    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-hidden">
            <GridBackground />

            {/* Navbar Minimal */}
            <nav className="relative z-10 p-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter group">
                    <div className="bg-white text-black w-8 h-8 flex items-center justify-center rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform">PF</div>
                    <span className="text-white">ProjectFlow</span>
                </Link>
                <Link to="/login">
                    <Button variant="ghost" className="text-slate-400 hover:text-white">Log in</Button>
                </Link>
            </nav>

            <main className="flex-grow flex items-center justify-center p-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Verify your email</h1>
                        <p className="text-slate-500">
                            We've sent a code to <span className="text-white font-medium">m@example.com</span>
                        </p>
                    </div>

                    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 space-y-6 shadow-2xl backdrop-blur-sm">
                        <div className="space-y-4">
                            <Input
                                label="One-Time Password"
                                placeholder="123456"
                                type="text"
                                maxLength={6}
                                className="text-center text-2xl tracking-[0.5em] font-mono h-14"
                            />
                        </div>

                        <Button className="w-full font-bold h-12">
                            Verify Email
                        </Button>

                        <div className="text-center text-sm">
                            <span className="text-slate-500">Didn't receive the code? </span>
                            <button className="text-white underline hover:text-slate-200">
                                Click to resend
                            </button>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
