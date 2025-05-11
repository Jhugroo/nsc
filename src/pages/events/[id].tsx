import EventDetails from "@/components/event/eventDetails"
import { useRouter } from 'next/router'
export default function EventDetailsPage() {
    const router = useRouter()
    const { id } = router.query
    return <section id="events" className="py-16 md:py-24" >
        <EventDetails eventId={id as string} />
    </section>
}