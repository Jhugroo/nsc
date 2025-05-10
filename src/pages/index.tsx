
import { Button } from "@/components/ui/button";
import Image from "next/image"
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
  ChevronRight,
  Calendar,
  Users,
  BookOpen,
  Award,
  ArrowRight,
} from "lucide-react";
import EventsList from "@/components/event/eventlist";

export default function Component() {

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section id="home" className="relative h-screen w-full">
          <div className="absolute inset-0 z-0">
            <Image
              src="/banner.avif?height=1080&width=1920"
              alt="Mauritius landscape"
              fill
              className="object-cover brightness-[0.6]"
              priority
            />
          </div>
          <div className="container relative z-10 flex h-full flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl">
                National Student Council of Mauritius
              </h1>
              <p className="mx-auto max-w-[700px] text-white md:text-xl">
                Empowering students across Mauritius to lead, innovate, and shape the future of education
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                Get Involved
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        <section id="about" className="py-16 md:py-24">
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

        <section id="initiatives" className="bg-secondary py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">Our Key Initiatives</h2>
              <p className="mt-4 text-muted-foreground">
                Driving positive change in education and student life across Mauritius
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <Users className="h-10 w-10 text-blue-600" />
                <h3 className="mt-4 text-xl font-bold">Student Leadership</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Training programs and workshops to develop leadership skills among student representatives.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <BookOpen className="h-10 w-10 text-green-600" />
                <h3 className="mt-4 text-xl font-bold">Academic Excellence</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Peer tutoring networks and study resources to support academic achievement.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <Award className="h-10 w-10 text-yellow-600" />
                <h3 className="mt-4 text-xl font-bold">Policy Advocacy</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Representing student interests in educational policy discussions at national level.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <Calendar className="h-10 w-10 text-red-600" />
                <h3 className="mt-4 text-xl font-bold">National Events</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Organizing conferences, competitions, and cultural events that bring students together.
                </p>
              </div>
            </div>
            <div className="mt-12 text-center">
              <Button>
                View All Initiatives
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        <section id="events" className=" py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">Upcoming Events</h2>
              <p className="mt-4 text-muted-foreground">
                Join us at our upcoming events and activities across Mauritius
              </p>
            </div>
            <EventsList take={6} />
            <div className="mt-12 text-center">
              <Link href="/events" >
                <Button>View all events →</Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="team" className="bg-secondary py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">Meet Our Executive Team</h2>
              <p className="mt-4 text-muted-foreground">
                Dedicated student leaders working to represent and serve the student community
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
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
              ].map((member, index) => (
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



        {/* Newsletter Section */}
        <section className="bg-blue-600 py-16 text-white">
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

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-24">
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
      </main>
    </div>
  )
}
