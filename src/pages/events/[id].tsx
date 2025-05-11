import EventDetails from "@/components/event/eventDetails"
import { useRouter } from 'next/router'
export default function EventDetailsPage() {
    const router = useRouter()
    const { id } = router.query
    return <section id="events" >
        <EventDetails eventId={id as string} />
    </section>
}