import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
    message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => (
    <div className="glass rounded-2xl p-5 flex items-start gap-3 border-destructive/30">
        <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        <div className="text-sm text-destructive">{message}</div>
    </div>
);
