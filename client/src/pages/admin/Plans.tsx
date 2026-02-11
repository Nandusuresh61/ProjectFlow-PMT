import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Check, Loader2, Trash2, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Plan {
    id: string;
    name: string;
    price: string;
    description: string;
    maxProjects: number;
    maxMembers: number;
    features: string[];
    popular?: boolean;
    isActive: boolean;
}

const initialPlans: Plan[] = [
    {
        id: "1",
        name: "Starter",
        price: "0",
        description: "For small teams just getting started",
        maxProjects: 3,
        maxMembers: 5,
        features: ["Basic support", "1GB storage"],
        popular: false,
        isActive: true,
    },
    {
        id: "2",
        name: "Professional",
        price: "2499",
        description: "For growing teams that need more power",
        maxProjects: 10,
        maxMembers: 20,
        features: ["Priority support", "10GB storage", "Analytics"],
        popular: true,
        isActive: true,
    },
    {
        id: "3",
        name: "Enterprise",
        price: "8499",
        description: "For large organizations with specific needs",
        maxProjects: 9999, // Unlimited
        maxMembers: 9999, // Unlimited
        features: ["24/7 Support", "Unlimited storage", "Advanced Analytics", "SSO"],
        popular: false,
        isActive: true,
    },
];

export default function Plans() {
    const [plans, setPlans] = useState<Plan[]>(initialPlans);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        maxProjects: "",
        maxMembers: "",
        additionalDetails: "",
    });

    const [featuresList, setFeaturesList] = useState<string[]>([""]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...featuresList];
        newFeatures[index] = value;
        setFeaturesList(newFeatures);
    };

    const addFeatureInput = () => {
        setFeaturesList([...featuresList, ""]);
    };

    const removeFeatureInput = (index: number) => {
        const newFeatures = featuresList.filter((_, i) => i !== index);
        setFeaturesList(newFeatures);
    };

    const handleCreatePlan = async () => {
        if (!formData.name || !formData.price) {
            toast.error("Name and Price are required.");
            return;
        }

        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        const validFeatures = featuresList.filter(f => f.trim() !== "");

        const newPlan: Plan = {
            id: Math.random().toString(36).substr(2, 9),
            name: formData.name,
            price: formData.price,
            description: formData.description,
            maxProjects: parseInt(formData.maxProjects) || 0,
            maxMembers: parseInt(formData.maxMembers) || 0,
            features: validFeatures,
            popular: false,
            isActive: true
        };

        setPlans([...plans, newPlan]);
        toast.success("Plan created successfully!");
        setLoading(false);
        setIsDialogOpen(false);
        setFormData({
            name: "",
            price: "",
            description: "",
            maxProjects: "",
            maxMembers: "",
            additionalDetails: "",
        });
        setFeaturesList([""]);
    };

    const togglePlanStatus = (id: string) => {
        setPlans(plans.map(p => {
            if (p.id === id) {
                const newStatus = !p.isActive;
                toast.success(`Plan ${newStatus ? 'activated' : 'deactivated'}`);
                return { ...p, isActive: newStatus };
            }
            return p;
        }));
    };

    return (
        <div className="space-y-6 text-zinc-100">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Subscription Plans</h1>
                    <p className="text-zinc-500">Manage billing plans and features for organizations.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700 text-white border-0">
                            <Plus className="mr-2 h-4 w-4" /> Create New Plan
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[90vh] bg-zinc-900 border-zinc-800 text-zinc-100">
                        <DialogHeader>
                            <DialogTitle className="text-white">Create New Plan</DialogTitle>
                            <DialogDescription className="text-zinc-400">
                                Add a new subscription plan for your customers.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-zinc-300">Plan Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="e.g. Starter"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="price" className="text-zinc-300">Price (Monthly in ₹)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-zinc-500">₹</span>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        placeholder="0"
                                        className="pl-7 bg-zinc-950 border-zinc-800 text-zinc-100 focus:ring-green-500 focus:border-green-500"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description" className="text-zinc-300">Description</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className="flex min-h-[60px] w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Brief description of the plan"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="maxProjects" className="text-zinc-300">Max Projects</Label>
                                    <Input
                                        id="maxProjects"
                                        name="maxProjects"
                                        type="number"
                                        placeholder="e.g. 5"
                                        value={formData.maxProjects}
                                        onChange={handleInputChange}
                                        className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="maxMembers" className="text-zinc-300">Max Members</Label>
                                    <Input
                                        id="maxMembers"
                                        name="maxMembers"
                                        type="number"
                                        placeholder="e.g. 10"
                                        value={formData.maxMembers}
                                        onChange={handleInputChange}
                                        className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-zinc-300">Features</Label>
                                <div className="space-y-2">
                                    {featuresList.map((feature, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={feature}
                                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                                placeholder="Feature description"
                                                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:ring-green-500 focus:border-green-500 flex-1"
                                            />
                                            {featuresList.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeFeatureInput(index)}
                                                    className="text-zinc-500 hover:text-red-500 hover:bg-zinc-800"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addFeatureInput}
                                        className="w-full mt-2 border-dashed border-zinc-700 text-zinc-400 hover:text-green-500 hover:border-green-500/50 hover:bg-zinc-900"
                                    >
                                        <Plus className="h-3 w-3 mr-1" /> Add Feature
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="additionalDetails" className="text-zinc-300">Additional Details (Optional)</Label>
                                <Input
                                    id="additionalDetails"
                                    name="additionalDetails"
                                    placeholder="Any extra info..."
                                    value={formData.additionalDetails}
                                    onChange={handleInputChange}
                                    className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-zinc-400 hover:text-white hover:bg-zinc-800">Cancel</Button>
                            <Button onClick={handleCreatePlan} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Plan
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {plans.map((plan, index) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className={cn(
                            "h-full flex flex-col relative overflow-hidden transition-all duration-300 bg-zinc-900 border-zinc-800 hover:border-green-500/30 group",
                            !plan.isActive && "opacity-60 grayscale-[0.5]"
                        )}>
                            {plan.popular && (
                                <div className="absolute top-0 right-0">
                                    <div className="bg-green-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg">
                                        Popular
                                    </div>
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="flex items-baseline gap-1 text-white">
                                    <span className="text-2xl font-bold">₹{plan.price}</span>
                                    <span className="text-sm font-normal text-zinc-500">/mo</span>
                                </CardTitle>
                                <CardTitle className="text-lg font-medium text-green-500 mt-2">{plan.name}</CardTitle>
                                <CardDescription className="text-zinc-400">{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-2.5 text-sm">
                                    {plan.maxProjects === 9999 ? (
                                        <li className="flex items-center gap-2 text-zinc-300">
                                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                            Unlimited projects
                                        </li>
                                    ) : (
                                        <li className="flex items-center gap-2 text-zinc-300">
                                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                            Up to {plan.maxProjects} projects
                                        </li>
                                    )}

                                    {plan.maxMembers === 9999 ? (
                                        <li className="flex items-center gap-2 text-zinc-300">
                                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                            Unlimited team members
                                        </li>
                                    ) : (
                                        <li className="flex items-center gap-2 text-zinc-300">
                                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                            Up to {plan.maxMembers} team members
                                        </li>
                                    )}

                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-zinc-300">
                                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter className="pt-4 border-t border-zinc-800 flex justify-between gap-2 items-center">
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={plan.isActive}
                                        onCheckedChange={() => togglePlanStatus(plan.id)}
                                        className="data-[state=checked]:bg-green-600"
                                    />
                                    <span className={cn("text-xs font-medium", plan.isActive ? "text-green-500" : "text-zinc-500")}>
                                        {plan.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
