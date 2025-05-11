import DepartmentPageList from "@/components/departmentPages/departmentPageList";

export default function EventsPage() {
  return <section id="events" className="py-16 md:py-24">
    <div className="container">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight">Our departments</h2>
      </div>
      <DepartmentPageList />

    </div>
  </section>
}