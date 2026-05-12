export const Spinner = ({ label = "Loading" }: { label?: string }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-muted-foreground">
            <div className="h-10 w-10 rounded-full border-2 border-white/10 border-t-accent animate-spin" />
            <span>{label}</span>
        </div>
    );
};
