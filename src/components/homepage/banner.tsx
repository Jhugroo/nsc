import { signIn, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { LoadingSpinner } from "../ui/custom/spinner";
import Link from "next/link";
import Image from "next/image"
export default function BannerSectionHomePage() {
    const { data: sessionData, status } = useSession();
    return <section id="home" className="relative h-screen w-full">
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
                <Button size="lg" variant="destructive">
                    Get Involved
                </Button>
                {status === 'loading' ? <Button size="lg" variant="secondary" ><LoadingSpinner /></Button> : sessionData ? <Link href="/profile" ><Button size="lg" variant="secondary" >My Profile</Button></Link> : <Button variant="secondary" size="lg" onClick={() => void signIn('google')}>Sign up</Button>}
            </div>
        </div>
    </section>
}