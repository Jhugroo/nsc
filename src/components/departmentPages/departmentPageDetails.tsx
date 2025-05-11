

import { api } from "@/utils/api";
import { LoadingSpinner } from "@/components/ui/custom/spinner";

import {
    MapPin,
    CornerDownLeft,
} from "lucide-react";
import { Button } from "../ui/button";
import { BackgroundCarousel } from "../ui/custom/background-carousel";
import Link from "next/link";
export default function DepartmentPageDetails({ departmentPageId }: { departmentPageId: string }) {
    const { data: departmentPageData, isLoading } = api.departmentPage.getDisplayDepartmentPage.useQuery(departmentPageId)
    if (isLoading) {
        return <LoadingSpinner />
    }
    return <div className="container">
        <div className="mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{departmentPageData?.title}</h2>
            {(departmentPageData && departmentPageData.image?.length > 0) ? < BackgroundCarousel items={departmentPageData.image.map(image => ({ key: image.key, id: image.name, image: image.url }))} /> : <LoadingSpinner />}

            <p className="mt-4 text-muted-foreground">
                {departmentPageData?.description}
            </p>
            <div className="my-4 flex items-center text-sm space-x-2">

                <span className="flex">
                    <MapPin className="mr-1 h-4 w-4" />
                    {departmentPageData?.Department?.label ?? ''}
                </span>
            </div>

        </div >
        <Link href="/departments">
            <Button variant="destructive" className="fixed bottom-4 left-6 z-50">
                <CornerDownLeft />
            </Button>
        </Link>
    </div >
}