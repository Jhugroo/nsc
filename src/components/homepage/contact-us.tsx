
import { Button } from "@/components/ui/button";
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Facebook,
    Instagram,
    Twitter,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";
export default function ContactUsSectionHomePage() {
    return <section id="contact" className="py-16 md:py-24">
        <div className="container">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight">Contact Us</h2>
                <p className="mt-4 text-muted-foreground">Have questions or want to get involved? Reach out to us.</p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
                <div>
                    <h3 className="text-xl font-bold">Get in Touch</h3>
                    <div className="mt-4 space-y-4">
                        <div className="flex items-start">
                            <Mail className="mr-3 h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Email</p>
                                <p className="text-sm text-muted-foreground">info@nscm.mu</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Phone className="mr-3 h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Phone</p>
                                <p className="text-sm text-muted-foreground">+230 XXX XXXX</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <MapPin className="mr-3 h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Address</p>
                                <p className="text-sm text-muted-foreground">
                                    NSCM Secretariat, Ministry of Education Building
                                    <br />
                                    IVTB House, Phoenix, Mauritius
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h4 className="font-medium">Follow Us</h4>
                        <div className="mt-2 flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold">Send a Message</h3>
                    <form className="mt-4 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Name
                                </label>
                                <Input id="name" placeholder="Your name" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </label>
                                <Input id="email" type="email" placeholder="Your email" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="subject" className="text-sm font-medium">
                                Subject
                            </label>
                            <Input id="subject" placeholder="Message subject" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">
                                Message
                            </label>
                            <Textarea id="message" placeholder="Your message" rows={4} />
                        </div>
                        <Button type="submit" className="w-full">
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    </section>
}