import React, { useCallback, useReducer, useRef } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { cn } from "@/lib/utils";

export type FieldType = "text" | "email" | "password" | "number" | "tel" | "url";

export interface FormField<T extends Record<string, string>> {
    /** Must match a key of your form data type */
    name: keyof T & string;
    label: string;
    type?: FieldType;
    placeholder?: string;
    /** Extra classes applied to the input element */
    inputClassName?: string;
    /** Anything rendered between the label and the input (e.g. a "Forgot password?" link) */
    labelSuffix?: React.ReactNode;
    /** For real-time feedback (debouncing, etc.) */
    onChange?: (value: string) => void;
    /** Error message provider from outside the form logic */
    customError?: string;
    /** Additional props forwarded to the underlying <input> */
    inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "type" | "value" | "onChange" | "className">;
}

export interface CustomFormProps<T extends Record<string, string>> {
    /** Array of field descriptors — drives the whole form */
    fields: FormField<T>[];
    /** Initial values for every field */
    initialValues: T;
    /** Zod schema used for validation before submit */
    schema?: z.ZodType<T>;
    /** Called with validated data if schema passes, or raw data if no schema */
    onSubmit: (values: T) => Promise<void> | void;
    /** Text shown on the submit button */
    submitLabel?: string;
    /** Text shown while loading */
    loadingLabel?: string;
    /** Controlled from outside (e.g. global store loading state) */
    isLoading?: boolean;
    /** Manually disable the submit button */
    isDisabled?: boolean;
    /** Anything rendered below the submit button (e.g. Google OAuth, dividers) */
    footer?: React.ReactNode;
    /** Override submit button classes */
    submitClassName?: string;
    /** Wrapper className around the fields */
    fieldsClassName?: string;
}


type FormState<T> = {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    touched: Partial<Record<keyof T, boolean>>;
    isSubmitting: boolean;
};

type FormAction<T> =
    | { type: "SET_VALUE"; field: keyof T; value: string }
    | { type: "SET_ERRORS"; errors: Partial<Record<keyof T, string>> }
    | { type: "TOUCH"; field: keyof T }
    | { type: "SET_SUBMITTING"; isSubmitting: boolean }
    | { type: "RESET"; values: T };

function formReducer<T extends Record<string, string>>(
    state: FormState<T>,
    action: FormAction<T>
): FormState<T> {
    switch (action.type) {
        case "SET_VALUE":
            return {
                ...state,
                values: { ...state.values, [action.field]: action.value },
                // Clear the error for this field when the user edits it
                errors: { ...state.errors, [action.field]: undefined },
            };
        case "SET_ERRORS":
            return { ...state, errors: action.errors };
        case "TOUCH":
            return { ...state, touched: { ...state.touched, [action.field]: true } };
        case "SET_SUBMITTING":
            return { ...state, isSubmitting: action.isSubmitting };
        case "RESET":
            return { values: action.values, errors: {}, touched: {}, isSubmitting: false };
        default:
            return state;
    }
}

/**
 * CustomForm – a single reusable form engine for the entire app.
 *
 * @example
 * ```tsx
 * <CustomForm
 *   fields={[
 *     { name: "email", label: "Email", type: "email", placeholder: "m@example.com" },
 *     { name: "password", label: "Password", type: "password" },
 *   ]}
 *   initialValues={{ email: "", password: "" }}
 *   schema={LoginUserSchema}
 *   onSubmit={handleLogin}
 *   submitLabel="Sign In"
 *   loadingLabel="Signing in..."
 *   isLoading={isLoading}
 * />
 * ```
 */
function CustomForm<T extends Record<string, string>>({
    fields,
    initialValues,
    schema,
    onSubmit,
    submitLabel = "Submit",
    loadingLabel = "Loading...",
    isLoading = false,
    isDisabled = false,
    footer,
    submitClassName,
    fieldsClassName,
}: CustomFormProps<T>) {
    const [state, dispatch] = useReducer(
        (s: FormState<T>, a: FormAction<T>) => formReducer<T>(s, a),
        {
            values: initialValues,
            errors: {},
            touched: {},
            isSubmitting: false,
        }
    );

    // Keep a ref to the latest onSubmit to avoid stale closures
    const onSubmitRef = useRef(onSubmit);
    onSubmitRef.current = onSubmit;

    const handleChange = useCallback(
        (field: keyof T & string) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                dispatch({ type: "SET_VALUE", field, value });
                
                // Find the field config to call its onChange
                const fieldConfig = fields.find((f) => f.name === field);
                if (fieldConfig?.onChange) {
                    fieldConfig.onChange(value);
                }
            },
        [fields]
    );

    const handleBlur = useCallback(
        (field: keyof T) => () => {
            dispatch({ type: "TOUCH", field });
        },
        []
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched to surface any existing errors
        fields.forEach((f) => dispatch({ type: "TOUCH", field: f.name }));

        // Validate with zod schema if provided
        if (schema) {
            const result = schema.safeParse(state.values);
            if (!result.success) {
                const errorMap: Partial<Record<keyof T, string>> = {};
                result.error.issues.forEach((issue) => {
                    const key = issue.path[0] as keyof T;
                    if (!errorMap[key]) {
                        errorMap[key] = issue.message;
                    }
                });
                dispatch({ type: "SET_ERRORS", errors: errorMap });
                return;
            }
        }

        dispatch({ type: "SET_SUBMITTING", isSubmitting: true });
        try {
            await onSubmitRef.current(state.values);
        } finally {
            dispatch({ type: "SET_SUBMITTING", isSubmitting: false });
        }
    };

    const loading = isLoading || state.isSubmitting;
    const disabled = loading || isDisabled;

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className={cn("space-y-4", fieldsClassName)}>
                {fields.map((field) => {
                    // Internal error from zod/submit
                    const internalError = state.errors[field.name];
                    // Real-time or external error passed via props
                    const externalError = field.customError;
                    
                    const error = externalError || internalError;
                    const touched = state.touched[field.name];
                    const showError = (touched && internalError) || externalError;

                    return (
                        <div key={field.name} className="space-y-1.5">
                            {/* Label row */}
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor={field.name}
                                    className="text-[#576CBC]/60 text-sm font-bold uppercase tracking-widest"
                                >
                                    {field.label}
                                </Label>
                                {field.labelSuffix}
                            </div>

                            {/* Input */}
                            {field.type === "password" ? (
                                <PasswordInput
                                    id={field.name}
                                    name={field.name}
                                    value={state.values[field.name]}
                                    onChange={handleChange(field.name)}
                                    onBlur={handleBlur(field.name)}
                                    placeholder={field.placeholder ?? "••••••••"}
                                    className={cn(
                                        "bg-[#19376D]/10 border-[#576CBC]/20 text-white placeholder:text-[#576CBC]/40 focus-visible:ring-[#A5D7E8]/20 focus-visible:border-[#A5D7E8]/50",
                                        showError && "border-red-500/60 focus-visible:ring-red-500/30",
                                        field.inputClassName
                                    )}
                                    {...field.inputProps}
                                />
                            ) : (
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type={field.type ?? "text"}
                                    value={state.values[field.name]}
                                    onChange={handleChange(field.name)}
                                    onBlur={handleBlur(field.name)}
                                    placeholder={field.placeholder}
                                    className={cn(
                                        "bg-[#19376D]/10 border-[#576CBC]/20 text-white placeholder:text-[#576CBC]/40 focus-visible:ring-[#A5D7E8]/20 focus-visible:border-[#A5D7E8]/50 transition-all",
                                        showError && "border-red-500/60 focus-visible:ring-red-500/30",
                                        field.inputClassName
                                    )}
                                    {...field.inputProps}
                                />
                            )}

                            {/* Inline error message */}
                            {showError && (
                                <p className="text-xs text-red-400 mt-0.5" role="alert">
                                    {error}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Submit button */}
            <Button
                type="submit"
                disabled={disabled}
                className={cn(
                    "w-full font-bold h-12 bg-[#A5D7E8] text-[#0B2447] hover:bg-white transition-all shadow-[0_0_20px_rgba(165,215,232,0.3)] mt-6",
                    submitClassName
                )}
            >
                {loading ? loadingLabel : submitLabel}
            </Button>

            {/* Optional footer slot (OAuth divider, links, etc.) */}
            {footer && <div className="mt-6">{footer}</div>}
        </form>
    );
}

export { CustomForm };

export default CustomForm;
