
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
} from "lucide-react";
import InitiativesList from "../Initiatives/initiativesList";
export default function InitiativesSectionHomePage() {

    return <section id="initiatives" className="bg-secondary py-16 md:py-24">
        <div className="container">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight">Our Key Initiatives</h2>
                <p className="mt-4 text-muted-foreground">
                    Driving positive change in education and student life across Mauritius
                </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                <InitiativesList />
            </div>
            <div className="mt-12 text-center">
                <Button>
                    View All Initiatives
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    </section>
}