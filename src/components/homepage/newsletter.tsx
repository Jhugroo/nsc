import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function NewsletterSectionHomePage() {
    return <section className="bg-blue-600 py-16 text-white">
        <div className="container">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight">Stay Updated</h2>
                <p className="mt-4">
                    Subscribe to our newsletter to receive updates on events, initiatives, and opportunities
                </p>
                <form className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        className="bg-white/10 text-white placeholder:text-white/60 border-white/20 focus-visible:ring-white"
                    />
                    <Button className="bg-white text-blue-600 hover:bg-white/90">Subscribe</Button>
                </form>
            </div>
        </div>
    </section>
}