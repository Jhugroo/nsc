import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AuthCard from "@/components/auth/auth";
import {
  type LucideIcon,
  Menu,
  Users,
  Shield,
  Blocks,
  CalendarCheck2Icon
} from "lucide-react"
import Image from 'next/image'
import logo from '../../../public/logo.png'
import { api } from "@/utils/api";
import { ModeToggle } from "../theme/switcher";
export const adminLinks = [
  { link: "/view-users", Icon: Users, text: "Users" },
  { link: "/event", Icon: CalendarCheck2Icon, text: "Events" },
]
const verifiedLinks: {
  link: string;
  Icon: LucideIcon;
  text: string;
}[] = [

  ]

export function MainMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: user } = api.user.get.useQuery()
  const closeMenu = () => { setIsOpen(false); };

  useEffect(() => { pathname === "/profile" && closeMenu(); }, [pathname]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className=" text-themeStyle" ><Menu /></Button>
      </SheetTrigger>
      <SheetContent className="w-fit">
        <SheetTitle onClick={() => closeMenu()}>
          <div className="flex mt-4"><Link href="/"><Button variant="ghost"><Image src={logo} className='h-[2rem] w-[12rem]' quality={100} alt='product preview' /></Button></Link><ModeToggle /></div>
          {(user?.isVerified ?? user?.isAdmin) && <>
            {verifiedLinks.map((verifiedLink) => <MenuLink href={verifiedLink.link} pathname={pathname} Icon={verifiedLink.Icon} text={verifiedLink.text} key={verifiedLink.link} />)}
          </>}
          <MenuLink href="/events" pathname={pathname} Icon={CalendarCheck2Icon} text="Events" />
          <MenuLink href="/about" pathname={pathname} Icon={Blocks} text="About Us" />
          {user?.isAdmin && <>
            <MenuItem itemKey="adminTab" Icon={Shield} text="Admin Section" key="adminTab" />
            {adminLinks.slice(0, 5).map((adminLink) => <MenuLink href={"/admin" + adminLink.link} pathname={pathname} Icon={adminLink.Icon} text={adminLink.text} key={adminLink.link} />)}
          </>}
        </SheetTitle>
        <AuthCard />
      </SheetContent>
    </Sheet >
  );
}

function MenuLink({ pathname, href, text, Icon }: { pathname: string, href: string, text: string, Icon?: LucideIcon }) {
  return (
    <Link
      key={href}
      href={href}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        pathname === href
          ? "bg-muted hover:bg-muted"
          : "font-medium hover",
        "justify-start w-full"
      )}
    >
      {Icon && <Icon className="pd-3 mr-2 w-5 h-5" strokeWidth={1} />} {text}
    </Link>
  );
}

function MenuItem({ itemKey, text, Icon }: { itemKey: string, text: string, Icon?: LucideIcon }) {
  return (
    <Link href="/admin">
      <div
        key={itemKey}
        className={cn(
          buttonVariants({ variant: "default" }),
          "font-bold ", "justify-start w-full bg-accent-foreground text-accent"
        )}
      >
        {Icon && <Icon className="pd-3 mr-2 w-5 h-5" strokeWidth={3} />} {text}
      </div>
    </Link >
  );
}