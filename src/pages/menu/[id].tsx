import Kids from "@/components/kids/kids";
import { LoadingSpinner } from "@/components/ui/custom/spinner";
import { useRouter } from 'next/router'
export default function MenutypeWithSlug() {

  const router = useRouter()
  const { id } = router.query
  if (typeof id === "string") {
    return <div className="pt-8"> <Kids defaultKid={id} /></div>
  }
  return <div className="pt-8"> <LoadingSpinner /></div>
}