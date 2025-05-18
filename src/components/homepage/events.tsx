import { Button } from "@/components/ui/button";
import Link from "next/link"
import EventsList from "@/components/event/eventlist";
export default function EventsSectionHomePage() {
    return <section id="events" className=" py-16 md:py-24">
        <div className="container">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight">Upcoming Events</h2>
                <p className="mt-4 text-muted-foreground">
                    Join us at our upcoming events and activities across Mauritius
                </p>
            </div>
            <EventsList take={6} />
            <div className="mt-12 text-center">
                <Link href="/events" >
                    <Button>View all events →</Button>
                </Link>
            </div>
        </div>
    </section>
}