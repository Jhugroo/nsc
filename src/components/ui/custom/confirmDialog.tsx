import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "./spinner";
import { type LucideIcon } from "lucide-react";

export function ConfirmDialog({
    disabled = false,
    buttonText = "Confirmer",
    title = "Êtes-vous sûr ?",
    Icon,
    description = "Cette action ne peut être annulée.",
    confirmButtonText = "Confirmer",
    confirmFunction,
    buttonVariant = "outline",
    className = ""
}:
    {
        disabled?: boolean;
        buttonText?: string,
        title?: string,
        Icon?: LucideIcon
        description?: string,
        confirmButtonText?: string,
        className?: string
        buttonVariant?: "default" | "link" | "destructive" | "outline" | "secondary" | "ghost"
        confirmFunction: () => void
    }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button disabled={disabled} variant={buttonVariant} className={className}>{Icon && <Icon />}{buttonText} {disabled && <LoadingSpinner />}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={() => confirmFunction()}>{confirmButtonText}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
