
import { api } from "@/utils/api";
import { LoadingSpinner } from "@/components/ui/custom/spinner";
import Image from "next/image"

export default function TeamMemberList() {
    const { data: team, isLoading } = api.team.getDisplay.useQuery()
    if (isLoading) return <LoadingSpinner />
    return <>
        {team ? team.map(({ name, role, image }, index) =>
            <div key={index} className="flex flex-col items-center text-center">
                <div className="relative h-40 w-40 overflow-hidden rounded-full">
                    <Image src={(image as { url?: string }[])[0]?.url ?? "/placeholder.svg"} alt={name} fill className="object-cover" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{name}</h3>
                <p className="text-sm text-muted-foreground">{role}</p>
            </div>
        ) : <>No team members</>}
    </>
}