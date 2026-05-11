import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, CreditCard, Calendar, ArrowUpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getSubscription, upgradeSubscription, verifyPayment } from '@/services/subscription/subscription.api';
import { getPlans } from '@/services/plan/plan.api';
import { AuthUserState } from '@/store/auth.store';
import { useWorkspaceStore } from '@/store/workspace.store';
import { getErrorMessage } from '@/shared/utils/error';
import type { SubscriptionResponse, SubscriptionHistoryItem } from '@/services/subscription/subscription.api';
import type { Plan } from '@/types/plan.types';

export const BillingSettings = () => {
    const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);
    const [history, setHistory] = useState<SubscriptionHistoryItem[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState<string | null>(null);

    const user = AuthUserState((state) => state.user);
    const workspaceId = user?.currentWorkspaceId;
    const fetchWorkspaces = useWorkspaceStore((state) => state.fetchWorkspaces);

    useEffect(() => {
        if (workspaceId) {
            fetchBillingData();
        }
    }, [workspaceId]);

    const fetchBillingData = async () => {
        setLoading(true);
        try {
            const [subRes, plansRes] = await Promise.all([
                getSubscription(workspaceId!),
                getPlans()
            ]);
            setSubscription(subRes.data);
            setHistory(subRes.data.history || []);
            setPlans(plansRes.data);
        } catch (error) {
            toast.error(getErrorMessage(error) || "Failed to load billing information");
        } finally {
            setLoading(false);
        }
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const currentPlan = subscription?.plan;
    const subDetails = subscription?.subscription;
    const usage = subscription?.usage || { projects: 0, members: 0 };

    const calculateDaysRemaining = (endDate: string | Date | undefined) => {
        if (!endDate) return null;
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const daysRemaining = calculateDaysRemaining(subDetails?.endDate);

    const handleUpgrade = async (planId: string) => {
        if (upgrading) return;

        const targetPlan = plans.find(p => p.planId === planId);
        if (!targetPlan) return;

        // Frontend validation: Check usage limits
        if (targetPlan.maxProjects !== -1 && usage.projects > targetPlan.maxProjects) {
            toast.error(`Cannot downgrade: current project count (${usage.projects}) exceeds the new plan's limit (${targetPlan.maxProjects}). Please remove some projects first.`);
            return;
        }

        if (targetPlan.maxMembers !== -1 && usage.members > targetPlan.maxMembers) {
            toast.error(`Cannot downgrade: current member count (${usage.members}) exceeds the new plan's limit (${targetPlan.maxMembers}). Please remove some members first.`);
            return;
        }

        setUpgrading(planId);
        try {
            const res = await loadRazorpay();
            if (!res) {
                toast.error("Razorpay SDK failed to load. Are you online?");
                return;
            }

            const response = await upgradeSubscription(workspaceId!, planId);
            const { orderId, amount, currency } = response.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: amount.toString(),
                currency: currency,
                name: "ProjectFlow",
                description: `Upgrade to ${targetPlan.type} Plan`,
                order_id: orderId,
                handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
                    try {
                        await verifyPayment(workspaceId!, {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            planId
                        });
                        toast.success("Subscription upgraded successfully! 🎉");
                        await fetchWorkspaces();
                        fetchBillingData();
                    } catch (error) {
                        toast.error(getErrorMessage(error) || "Payment verification failed");
                    }
                },
                prefill: {
                    name: user?.fullName,
                    email: user?.email,
                },
                theme: {
                    color: "#A5D7E8",
                },
            };

            const paymentObject = new (window as unknown as { Razorpay: new (options: unknown) => { open: () => void } }).Razorpay(options);
            paymentObject.open();
        } catch (error) {
            toast.error(getErrorMessage(error) || "Failed to initiate upgrade");
        } finally {
            setUpgrading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#A5D7E8] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (

        <div className="p-8 space-y-10">
            {/* Current Plan Summary */}
            <section>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <CreditCard className="text-[#A5D7E8]" size={22} />
                    Current Subscription
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Crown size={60} className="text-[#A5D7E8]" />
                        </div>
                        <p className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest mb-1">Active Plan</p>
                        <h4 className="text-2xl font-black text-white mb-4">{currentPlan?.type || 'Free'}</h4>
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2 text-[#A5D7E8] bg-[#A5D7E8]/10 w-fit px-3 py-1 rounded-full text-xs font-bold">
                                <span className="w-1.5 h-1.5 bg-[#A5D7E8] rounded-full animate-pulse"></span>
                                {subDetails?.status?.toUpperCase()}
                            </div>

                            {daysRemaining !== null && (
                                <div className={`text-xs font-bold px-3 py-1 rounded-full ${daysRemaining < 7
                                        ? 'bg-red-500/10 text-red-400'
                                        : 'bg-white/5 text-white/40'
                                    }`}>
                                    {daysRemaining} days left
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6">
                        <p className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest mb-1">Billing Cycle</p>
                        <h4 className="text-xl font-bold text-white mb-4 capitalize">{subDetails?.billingCycle || 'Monthly'}</h4>
                        <div className="flex items-center gap-2 text-white/40 text-xs">
                            <Calendar size={14} />
                            Next Renewal: {subDetails?.endDate ? new Date(subDetails.endDate).toLocaleDateString() : 'N/A'}
                        </div>
                    </div>

                    <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6">
                        <p className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest mb-1">Usage Limits</p>
                        <div className="space-y-3 mt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-white/60">Projects</span>
                                <span className="text-white font-bold">
                                    {usage.projects} / {currentPlan?.maxProjects === -1 ? '∞' : `${currentPlan?.maxProjects || 3}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white/60">Members</span>
                                <span className="text-white font-bold">
                                    {usage.members} / {currentPlan?.maxMembers === -1 ? '∞' : `${currentPlan?.maxMembers || 5}`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Upgrade Options */}
            <section>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <ArrowUpCircle className="text-[#A5D7E8]" size={22} />
                    Available Plans
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => {
                        const isCurrent = plan.planId === currentPlan?.planId;
                        const isFree = plan.type.toUpperCase() === 'FREE';
                        const currentIsPaid = currentPlan?.type?.toUpperCase() !== 'FREE';
                        const isRestricted = isFree && currentIsPaid;

                        return (
                            <motion.div
                                key={plan.planId}
                                whileHover={{ y: -5 }}
                                className={`bg-white/[0.03] border rounded-[2.5rem] p-8 flex flex-col transition-all ${isCurrent ? 'border-[#A5D7E8]/30 bg-[#A5D7E8]/5' : 'border-white/5 hover:border-white/20'
                                    }`}
                            >
                                <div className="mb-6">
                                    <h4 className="text-xl font-bold text-white mb-2">{plan.type}</h4>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-white">₹{plan.priceMonthly}</span>
                                        <span className="text-[#576CBC]/60 text-sm font-medium">/mo</span>
                                    </div>
                                    <p className="text-white/40 text-xs mt-2 leading-relaxed">{plan.description}</p>
                                </div>

                                <div className="space-y-4 mb-8 flex-grow">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm">
                                            <div className="mt-1 w-4 h-4 rounded-full bg-[#A5D7E8]/10 flex items-center justify-center flex-shrink-0">
                                                <Check size={10} className="text-[#A5D7E8]" />
                                            </div>
                                            <span className="text-white/70">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleUpgrade(plan.planId)}
                                    disabled={isCurrent || (upgrading !== null) || isRestricted}
                                    className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isCurrent || isRestricted
                                            ? 'bg-white/5 text-white/40 cursor-default'
                                            : 'bg-[#A5D7E8] text-[#0B2447] hover:bg-white hover:shadow-[0_0_20px_rgba(165,215,232,0.4)]'
                                        }`}
                                >
                                    {upgrading === plan.planId ? (
                                        <div className="w-4 h-4 border-2 border-[#0B2447] border-t-transparent rounded-full animate-spin"></div>
                                    ) : isCurrent ? (
                                        'Current Plan'
                                    ) : isRestricted ? (
                                        'Unavailable'
                                    ) : (
                                        'Upgrade Now'
                                    )}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* Billing History */}
            <section className="pb-12">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <CreditCard className="text-[#A5D7E8]" size={22} />
                    Billing History
                </h3>

                <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-6 py-4 text-[10px] font-black text-[#576CBC]/60 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-[#576CBC]/60 uppercase tracking-widest">Plan</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-[#576CBC]/60 uppercase tracking-widest">Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-[#576CBC]/60 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-[#576CBC]/60 uppercase tracking-widest text-right">Transaction ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {history.length > 0 ? (
                                    history.map((item, index) => (
                                        <tr key={item.subscriptionId || index} className="group hover:bg-white/[0.01] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-white/80">
                                                    {new Date(item.createdAt || item.startDate).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                                <div className="text-[10px] text-white/20 font-medium uppercase tracking-tighter">
                                                    {new Date(item.createdAt || item.startDate).toLocaleTimeString(undefined, {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-black text-white/90">{item.planType}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-mono text-[#A5D7E8]">
                                                {item.amount > 0 ? `₹${item.amount}` : 'FREE'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`text-[10px] font-black px-2 py-0.5 rounded-md w-fit ${item.status === 'active'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        : 'bg-white/5 text-white/40 border border-white/10'
                                                    }`}>
                                                    {item.status?.toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-[10px] font-mono text-white/20 select-all">
                                                    {item.razorpayPaymentId || 'N/A'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-white/20 text-sm font-medium">
                                            No payment history found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};
