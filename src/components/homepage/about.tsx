import { ChevronRight } from "lucide-react";
import Image from "next/image"
import Link from "next/link";
export default function AboutSectionHomepage() {
    return <section id="about" className="py-16 md:py-24">
        <div className="container">
            <div className="flex flex-col gap-8 md:flex-row md:gap-16">
                <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold tracking-tight">About NSC</h2>
                    <div className="mt-4 space-y-4">
                        <p>
                            The National Student Council is a dynamic and representative body with a vision to reinforce and empower
                            the student community of our great nation.We stand as a beacon of student representation and advocacy,
                            committed to fostering positive changes and holistic development within the educational landscape.
                            We have positioned ourselves as the authoritative voice of students, advocating for their rights, 
                            voicing their concerns and standing up for their goals.
                        </p>
                        <p>
                            Our council serves as a platform that unites students from all backgrounds, enabling them to mould 
                            their educational pathways, contribute to society and prepare for a fulfilling future.By championing 
                            their voices, we work towards creating a space where young individuals can actively participate in 
                            shaping their educational experiences and contributing to positive change within the student community 
                            itself first then the society.
                        </p>
                        <p>
                            Our mission is to foster leadership, promote academic excellence, and create a collaborative
                            environment where students can develop the skills needed to become future leaders of Mauritius.
                        </p>
                    </div>
                    <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-4">
                        <Link href="/about" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                            Learn More
                            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link href="#initiatives" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                            Discover our Initiatives
                            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div
    </section>
}
