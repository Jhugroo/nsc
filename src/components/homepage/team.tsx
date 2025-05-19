import { Button } from "@/components/ui/button";
import Link from "next/link"
import TeamMemberList from "../team/TeamMemberList";
export default function TeamSectionHomePage() {

    return <section id="team" className="bg-secondary py-16 md:py-24">
        <div className="container">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight">Meet Our Executive Team</h2>
                <p className="mt-4 text-muted-foreground">
                    Dedicated student leaders working to represent and serve the student community
                </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <TeamMemberList />
            </div>
            <div className="mt-12 text-center">
                <Link href="#">
                    <Button> View all council members →</Button>
                </Link>
            </div>
        </div>
    </section>
}