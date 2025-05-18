import {
    Calendar,
    Users,
    BookOpen,
    Award,
    ArrowRight,
    type LucideIcon,
} from "lucide-react";
import { api } from "@/utils/api";
import { LoadingSpinner } from "@/components/ui/custom/spinner";

export const componentMap = {
    Calendar,
    Users,
    BookOpen,
    Award,
    ArrowRight,
} as const satisfies Record<string, LucideIcon>;

export default function InitiativesList() {
    const { data: initiatives, isLoading } = api.initiatives.getDisplay.useQuery()
    if (isLoading) return <LoadingSpinner />
    return <>
        {initiatives ? initiatives.map(({ icon, iconColor, title, description }, index) => {
            const Icon: LucideIcon = componentMap[icon as keyof typeof componentMap];
            return <div className="rounded-lg border bg-card p-6 shadow-sm" key={`initialive-list-${index}`} >
                <Icon className={`h-10 w-10 text-${iconColor}`} />
                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{description} </p>
            </div>
        }) : <>No initiatives</>}
    </>
}