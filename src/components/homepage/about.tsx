import { ChevronRight } from "lucide-react";
import Image from "next/image"
import Link from "next/link";
export default function AboutSectionHomepage() {
    return <section id="about" className="py-16 md:py-24">
        <div className="container">
            <div className="flex flex-col gap-8 md:flex-row md:gap-16">
                <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold tracking-tight">About NSCM</h2>
                    <div className="mt-4 space-y-4">
                        <p>
                            The National Student Council of Mauritius (NSCM) is the official representative body for students
                            across Mauritius, bringing together student leaders from secondary schools, colleges, and
                            universities.
                        </p>
                        <p>
                            Established to amplify student voices in educational policy and governance, NSCM works closely with
                            the Ministry of Education to ensure student perspectives are considered in decision-making
                            processes.
                        </p>
                        <p>
                            Our mission is to foster leadership, promote academic excellence, and create a collaborative
                            environment where students can develop the skills needed to become future leaders of Mauritius.
                        </p>
                    </div>
                    <div className="mt-6">
                        <Link href="#initiatives" className="group inline-flex items-center text-sm font-medium text-primary">
                            Discover our initiatives
                            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
                <div className="relative md:w-1/2">
                    <Image
                        src="/home.png?height=400&width=600"
                        alt="Students in council meeting"
                        width={600}
                        height={400}
                        className="rounded-lg object-cover"
                    />

                </div>
            </div>
        </div>
    </section>
}