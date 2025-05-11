

import { api } from "@/utils/api";
import { LoadingSpinner } from "@/components/ui/custom/spinner";

import {
    MapPin,
    Calendar,
} from "lucide-react";
import { dateFormatterDisplay } from "@/lib/utils";
import { Button } from "../ui/button";
import { BackgroundCarousel } from "../ui/custom/background-carousel";
export default function EventDetails({ eventId }: { eventId: string }) {
    const { data: eventData, isLoading } = api.event.getDisplayEvent.useQuery(eventId)
    if (isLoading) {
        return <LoadingSpinner />
    }
    return <div className="container">
        <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{eventData?.title}</h2>
            {(eventData && eventData.image?.length > 0) ? < BackgroundCarousel items={eventData.image.map(image => ({ key: image.key, id: image.name, image: image.url }))} /> : <LoadingSpinner />}

            <p className="mt-4 text-muted-foreground">
                {eventData?.description}
            </p>
            <div className="my-4 flex items-center text-sm space-x-2">
                <span className="flex">
                    <Calendar className="mr-1 h-4 w-4" />
                    {dateFormatterDisplay(eventData?.eventDate ?? new Date())}
                </span>
                <span className="flex">
                    <MapPin className="mr-1 h-4 w-4" />
                    {eventData?.location}
                </span>
            </div>

            {eventData?.link && < a href={eventData.link} target="_blank">
                <Button variant="outline" className="mt-4 w-full">
                    Register Now
                </Button>
            </a>}
        </div >
    </div >
}