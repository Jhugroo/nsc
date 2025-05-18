import { Button } from "@/components/ui/button";
import Link from "next/link"
import Image from "next/image"
export default function TeamSectionHomePage() {
    const team = [
        {
            name: "Aryan Patel",
            role: "President",
            image: "/temp-face.jpg?height=300&width=300",
        },
        {
            name: "Leela Ramchurn",
            role: "Vice President",
            image: "/temp-face.jpg?height=300&width=300",
        },
        {
            name: "David Wong",
            role: "Secretary General",
            image: "/temp-face.jpg?height=300&width=300",
        },
        {
            name: "Sarah Mohamad",
            role: "Treasurer",
            image: "/temp-face.jpg?height=300&width=300",
        },
    ]
    return <section id="team" className="bg-secondary py-16 md:py-24">
        <div className="container">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight">Meet Our Executive Team</h2>
                <p className="mt-4 text-muted-foreground">
                    Dedicated student leaders working to represent and serve the student community
                </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {team.map((member, index) => (
                    <div key={index} className="flex flex-col items-center text-center">
                        <div className="relative h-40 w-40 overflow-hidden rounded-full">
                            <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                        </div>
                        <h3 className="mt-4 text-lg font-bold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                ))}
            </div>
            <div className="mt-12 text-center">
                <Link href="#">
                    <Button> View all council members →</Button>
                </Link>
            </div>
        </div>
    </section>
}