import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Head from "next/head";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { MainMenu } from "@/components/menu/mainMenu";
import { ThemeProvider } from "@/components/theme/provider";
import { Toaster } from "react-hot-toast";
import Image from 'next/image'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import logo from '../../public/logo.png'
import { Analytics } from "@vercel/analytics/react"
import { FooterSection } from "@/components/footer";
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {


  return (
    <SessionProvider session={session}>
      <Toaster />
      <Head>
        <title>NSC</title>
        <meta name="description" content="National student council" />
        <link rel="icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <ThemeProvider
        attribute="class"
        defaultTheme="light">
        <div className="mt-2">
          <Link href="/"><Button variant="ghost"><Image src={logo} className='h-[2rem] w-[12rem]' quality={100} alt='product preview' /></Button>
          </Link>
          <div className="flex float-right"><MainMenu /> </div>
        </div>
        <div className="min-h-screen">
          <Component {...pageProps} />

          <Analytics />
        </div>     <FooterSection />
      </ThemeProvider>
    </SessionProvider>
  );
};


export default api.withTRPC(MyApp);


