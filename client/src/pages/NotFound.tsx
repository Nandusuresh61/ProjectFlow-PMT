import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GridBackground } from "@/components/ui/gridBackground";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
            <GridBackground />
            <div className="z-10 flex flex-col items-center gap-8 text-center bg-background/50 backdrop-blur-sm p-12 rounded-xl border border-border/50 shadow-2xl">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative"
                >
                    <h1 className="text-9xl font-bold tracking-tighter text-foreground">
                        404
                    </h1>
                    <motion.div
                        className="absolute -inset-4 -z-10 rounded-full bg-primary/20 blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="space-y-4"
                >
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Page Not Found
                    </h2>
                    <p className="text-muted-foreground max-w-[400px]">
                        Oops! The page you're looking for doesn't exist. It might have been
                        moved or deleted.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <Button asChild size="lg" className="font-semibold cursor-pointer">
                        <Link to="/">Go Back Home</Link>
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
