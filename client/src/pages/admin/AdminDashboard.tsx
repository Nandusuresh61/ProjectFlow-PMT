import { motion } from "framer-motion";
import { Users, Building2, CreditCard, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
    const stats = [
        {
            title: "Total Revenue",
            value: "₹12,45,000",
            change: "+12.5%",
            trend: "up",
            icon: DollarSign,
        },
        {
            title: "Total Users",
            value: "1,284",
            change: "+8.2%",
            trend: "up",
            icon: Users,
        },
        {
            title: "Organizations",
            value: "342",
            change: "+24 new",
            trend: "up",
            icon: Building2,
        },
        {
            title: "Active Subscriptions",
            value: "298",
            change: "87% of orgs",
            trend: "neutral",
            icon: CreditCard,
        },
    ];

    const recentOrgs = [
        { name: "Acme Corp", plan: "Professional", status: "Active", date: "2024-02-10" },
        { name: "TechStart Inc", plan: "Enterprise", status: "Active", date: "2024-02-09" },
        { name: "Global Solutions", plan: "Starter", status: "Trial", date: "2024-02-09" },
        { name: "NextGen AI", plan: "Professional", status: "Active", date: "2024-02-08" },
        { name: "Design Studio", plan: "Starter", status: "Inactive", date: "2024-02-07" },
    ];

    return (
        <div className="space-y-6 text-zinc-100">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="bg-zinc-900 border-zinc-800 hover:border-green-500/30 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-400">
                                    {stat.title}
                                </CardTitle>
                                <div className="p-2 bg-green-500/10 rounded-full">
                                    <stat.icon className="h-4 w-4 text-green-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <p className="text-xs text-zinc-500 flex items-center mt-1">
                                    {stat.trend === "up" ? (
                                        <span className="text-green-500 flex items-center mr-1">
                                            <TrendingUp className="h-3 w-3 mr-1" />
                                            {stat.change}
                                        </span>
                                    ) : (
                                        <span className="text-zinc-500 mr-1">{stat.change}</span>
                                    )}
                                    from last month
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <motion.div
                    className="col-span-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="h-full bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white">Monthly Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[240px] flex items-end justify-between gap-2 pt-4 px-2">
                                {/* Dummy Chart Bars */}
                                {[35, 45, 30, 60, 75, 50, 65, 80, 70, 90, 85, 95].map((height, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div className="relative w-full bg-zinc-800/50 rounded-t-md h-full overflow-hidden flex items-end">
                                            <motion.div
                                                className="w-full bg-green-600 hover:bg-green-500 transition-colors rounded-t-md relative group-hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                                                initial={{ height: 0 }}
                                                animate={{ height: `${height}%` }}
                                                transition={{ duration: 1, delay: i * 0.05 + 0.5 }}
                                            >
                                            </motion.div>
                                        </div>
                                        <span className="text-xs text-zinc-500 font-medium group-hover:text-green-500 transition-colors">
                                            {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    className="col-span-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card className="h-full bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white">Recent Organizations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentOrgs.map((org, i) => (
                                    <div key={i} className="flex items-center justify-between border-b border-zinc-800 pb-2 last:border-0 last:pb-0 hover:bg-zinc-800/50 p-2 rounded-lg transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-xs ring-1 ring-zinc-700">
                                                {org.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-zinc-200">{org.name}</p>
                                                <p className="text-xs text-zinc-500">{org.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={cn(
                                                "text-[10px] px-2 py-0.5 rounded-full font-medium border",
                                                org.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    org.status === 'Trial' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                        'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                                            )}>
                                                {org.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
