import DepartmentPageDetails from "@/components/departmentPages/departmentPageDetails"
import { useRouter } from 'next/router'
export default function EventDetailsPage() {
    const router = useRouter()
    const { id } = router.query
    return <section id="events" >
        <DepartmentPageDetails departmentPageId={id as string} />
    </section>
}