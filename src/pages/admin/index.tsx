import { adminLinks } from "@/components/menu/mainMenu";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar } from "@radix-ui/react-avatar";

import { CornerDownLeft, HomeIcon, type LucideIcon } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
    return <div className="w-full grid grid-flow-row-dense md:grid-cols-4 sm:grid-cols-2">{adminLinks.map((adminLink) => <MenuCardOption adminLink={adminLink} key={adminLink.link} />)}
        <Link href={"/"} className="w-48">
            <Card className="bg-muted border-2 border-theme-style m-4 w-48">
                <CardHeader>
                    <CardTitle className="flex">
                        <Avatar className="h-8 w-8">
                            <HomeIcon />
                        </Avatar>
                        <span className="mt-1 ml-2">  Home</span>
                    </CardTitle>
                    <CardDescription className="text-accent-foreground">Back to homepage </CardDescription>
                </CardHeader>
                <CardContent >
                </CardContent>
            </Card >
        </Link></div>
}

function MenuCardOption({ adminLink: { link, Icon, text } }: {
    adminLink: {
        link: string;
        Icon: LucideIcon;
        text: string;
    }
}) {
    return (
        <Link href={"/admin" + link} className="w-48">
            <Card className="bg-muted border-2 border-theme-style m-4 w-48">
                <CardHeader>
                    <CardTitle className="flex">
                        <Avatar className="h-8 w-8">
                            <Icon />
                        </Avatar>
                        <span className="mt-1 ml-2">  {text}</span>
                    </CardTitle>

                    <CardDescription className="text-accent-foreground">Short description </CardDescription>
                </CardHeader>
                <CardContent >
                </CardContent>
            </Card >
        </Link>
    )
}
export function AdminDashboardLink() {
    return <Link href="/admin">
        <Button variant="destructive" className="fixed bottom-4 left-6 z-50">
            <CornerDownLeft />
        </Button>
    </Link>
}