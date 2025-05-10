import Link from "next/link";

export function FooterSection() {
    return <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t footer">
        <p className="text-xs text-muted-foreground">NSC © 2024 | All rights reserved</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
                Terms of service
            </Link>
            <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
                Privacy Policy
            </Link>
            <Link href="/about" className="text-xs hover:underline underline-offset-4" prefetch={false}>
                About Us
            </Link>
        </nav>
    </footer>
}
