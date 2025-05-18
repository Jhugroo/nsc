
import AboutSectionHomepage from "@/components/homepage/about";
import BannerSectionHomePage from "@/components/homepage/banner";
import InitiativesSectionHomePage from "@/components/homepage/initiatives";
import TeamSectionHomePage from "@/components/homepage/team";
import NewsletterSectionHomePage from "@/components/homepage/newsletter";
import ContactUsSectionHomePage from "@/components/homepage/contact-us";

export default function Component() {

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <BannerSectionHomePage />
        <AboutSectionHomepage />
        <InitiativesSectionHomePage />
        <TeamSectionHomePage />
        <NewsletterSectionHomePage />
        <ContactUsSectionHomePage />
      </main>
    </div >
  )
}
