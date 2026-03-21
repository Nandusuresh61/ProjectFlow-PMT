import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheck className="h-5 w-5 text-emerald-500" />,
        info: <Info className="h-5 w-5 text-blue-500" />,
        warning: <TriangleAlert className="h-5 w-5 text-amber-500" />,
        error: <OctagonX className="h-5 w-5 text-red-500" />,
        loading: <LoaderCircle className="h-5 w-5 animate-spin text-muted-foreground" />,
      }}
      toastOptions={{
        style: {
          background: "rgba(22, 29, 52, 0.64)", // Deeper navy blue
          backdropFilter: "blur(16px)", // Glass effect
          border: "1px solid rgba(87, 108, 188, 0.3)", // Subtle navy border
          color: "#f1f5f9", // slate-100
          borderRadius: "12px",
        },
        classNames: {
          toast: "group toast font-sans px-4 py-3",
          description: "group-[.toast]:text-slate-400 group-[.toast]:text-xs",
          title: "group-[.toast]:font-semibold group-[.toast]:text-sm",
          actionButton:
            "group-[.toast]:bg-indigo-600 group-[.toast]:text-white group-[.toast]:hover:bg-indigo-500",
          cancelButton:
            "group-[.toast]:bg-white/5 group-[.toast]:text-slate-300",
          // Adding specific styles for status accents
          success: "border-l-4 border-l-emerald-500",
          error: "border-l-4 border-l-red-500",
          warning: "border-l-4 border-l-amber-500",
          info: "border-l-4 border-l-blue-500",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }