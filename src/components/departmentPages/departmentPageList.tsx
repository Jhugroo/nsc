import Image from "next/image"
import {
    MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { LoadingSpinner } from "@/components/ui/custom/spinner";
import Link from "next/link";
export default function DepartmentPageList({ take = 100 }: { take?: number }) {
    const { data: departmentData, isLoading } = api.departmentPage.getDisplayDepartmentPages.useQuery({ take: take })
    const blocks = departmentData?.map((department) => {
        return {
            title: department.title,
            department: department.Department?.label ?? '',
            image: department?.image?.[0]?.url ?? "/placeholder.svg",
            link: department.link,
            details: `/departments/${department.id}`,
        }
    })
    if (isLoading) {
        return <LoadingSpinner />
    }
    return <div className="flex flex-col min-h-[100dvh]">

        <div className="mt-12 grid gap-6 md:grid-cols-3">
            {blocks ? blocks.map((department, index) => (
                <div
                    key={index}
                    className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
                >
                    <div className="relative h-48 w-full overflow-hidden">
                        <Image
                            src={department.image}
                            alt={department.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={index <= 3}
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                    </div>
                    <div className="p-6">
                        <h3 className="text-lg font-bold">{department.title}</h3>

                        <div className="mt-1 flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-4 w-4" />
                            {department.department}
                        </div>
                        <div className="flex space-x-2 mt-4">
                            <Link href={department.details}><Button className="float-right" variant="outline">Details</Button></Link>

                        </div>


                    </div>
                </div>
            )) : <>No departments ;-;</>}
        </div> </div >
}