import Image from "next/image"
import {
    MapPin,
    Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { LoadingSpinner } from "@/components/ui/custom/spinner";
import { dateFormatterDisplay } from "@/lib/utils";
import Link from "next/link";
export default function EventsList({ take = 100 }: { take?: number }) {
    const { data: eventData, isLoading } = api.event.getDisplayEvents.useQuery({ take: take })
    const blocks = eventData?.map((event) => {
        return {
            title: event.title,
            date: dateFormatterDisplay(event.eventDate),
            location: event.location,
            image: event?.image?.[0]?.url ?? "/placeholder.svg",
            link: event.link,
            details: `/events/${event.id}`,
        }
    })
    if (isLoading) {
        return <LoadingSpinner />
    }
    return <div className="flex flex-col min-h-[100dvh]">

        <div className="mt-12 grid gap-6 md:grid-cols-3">
            {blocks ? blocks.map((event, index) => (
                <div
                    key={index}
                    className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
                >
                    <div className="relative h-48 w-full overflow-hidden">
                        <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                    </div>
                    <div className="p-6">
                        <h3 className="text-lg font-bold">{event.title}</h3>
                        <div className="mt-2 flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-4 w-4" />
                            {event.date}
                        </div>
                        <div className="mt-1 flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-4 w-4" />
                            {event.location}
                        </div>
                        <div className="flex space-x-2 mt-4">
                            <Link href={event.details}><Button className="float-right" variant="outline">Details</Button></Link>
                            {event.link && < a href={event.link} target="_blank"> <Button variant="secondary">
                                Register Now
                            </Button></a>}
                        </div>


                    </div>
                </div>
            )) : <>No Upcoming events ;-;</>}
        </div> </div >
}