import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, CreditCard, Calendar, ArrowUpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getSubscription, upgradeSubscription, verifyPayment } from '@/services/subscription/subscription.api';
import { getPlans } from '@/services/plan/plan.api';
import { AuthUserState } from '@/store/auth.store';
import { getErrorMessage } from '@/shared/utils/error';
import type { Plan } from '@/types/plan.types';

export const BillingSettings = () => {
    const [subscription, setSubscription] = useState<any>(null);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState<string | null>(null);

    const user = AuthUserState((state) => state.user);
    const workspaceId = user?.currentWorkspaceId;

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

    const handleUpgrade = async (planId: string) => {
        if (upgrading) return;
        
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
                description: `Upgrade to ${plans.find(p => p.planId === planId)?.type} Plan`,
                order_id: orderId,
                handler: async (response: any) => {
                    try {
                        await verifyPayment(workspaceId!, {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            planId
                        });
                        toast.success("Subscription upgraded successfully! 🎉");
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

            const paymentObject = new (window as any).Razorpay(options);
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

    const currentPlan = subscription?.plan;
    const subDetails = subscription?.subscription;

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
                        <div className="flex items-center gap-2 text-[#A5D7E8] bg-[#A5D7E8]/10 w-fit px-3 py-1 rounded-full text-xs font-bold">
                            <span className="w-1.5 h-1.5 bg-[#A5D7E8] rounded-full animate-pulse"></span>
                            {subDetails?.status?.toUpperCase()}
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
                                <span className="text-white font-bold">{currentPlan?.maxProjects === -1 ? 'Unlimited' : `${currentPlan?.maxProjects || 3} Max`}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white/60">Members</span>
                                <span className="text-white font-bold">{currentPlan?.maxMembers === -1 ? 'Unlimited' : `${currentPlan?.maxMembers || 5} Max`}</span>
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
                        return (
                            <motion.div
                                key={plan.planId}
                                whileHover={{ y: -5 }}
                                className={`bg-white/[0.03] border rounded-[2.5rem] p-8 flex flex-col transition-all ${
                                    isCurrent ? 'border-[#A5D7E8]/30 bg-[#A5D7E8]/5' : 'border-white/5 hover:border-white/20'
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
                                    disabled={isCurrent || (upgrading !== null)}
                                    className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                                        isCurrent
                                            ? 'bg-white/5 text-white/40 cursor-default'
                                            : 'bg-[#A5D7E8] text-[#0B2447] hover:bg-white hover:shadow-[0_0_20px_rgba(165,215,232,0.4)]'
                                    }`}
                                >
                                    {upgrading === plan.planId ? (
                                        <div className="w-4 h-4 border-2 border-[#0B2447] border-t-transparent rounded-full animate-spin"></div>
                                    ) : isCurrent ? (
                                        'Current Plan'
                                    ) : (
                                        'Upgrade Now'
                                    )}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};
