export type FormValues = {
    title: string;
    description: string;
    type: "Story" | "Task" | "Bug";
    status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "DONE";
    priority: "Low" | "Medium" | "High";
    size: "XS" | "S" | "M" | "L" | "XL" | "";
    assignee: string;
    sprint: string;
    subtasks: { id: string; title: string; completed: boolean }[];
};

export type FormState = {
    values: FormValues;
    errors: Partial<Record<keyof FormValues | string, string>>;
    touched: Partial<Record<keyof FormValues | string, boolean>>;
    isSubmitting: boolean;
};

export type FormAction =
    | { type: "SET_VALUE"; field: string; value: any }
    | { type: "SET_ERRORS"; errors: Partial<Record<string, string>> }
    | { type: "TOUCH"; field: string }
    | { type: "SET_SUBMITTING"; isSubmitting: boolean }
    | { type: "RESET"; values: FormValues };
