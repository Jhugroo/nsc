import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "../button"

export default function PaginationNavigator({ take, isLoading, isNextNull, skip, setSkip }: {
    isLoading: boolean,
    isNextNull: object | undefined | null,
    skip: number,
    setSkip: (skip: number) => void
    take: number
}) {
    const isNextButtonEnabled = () => {
        if (!isLoading && isNextNull !== undefined && isNextNull !== null) {
            return false
        }
        return true
    }
    const isPrevButtonEnabled = () => {
        if (isLoading) {
            return true
        }
        if (skip > 0) {
            return false
        }
        return true
    }
    return <>
        <Button disabled={isPrevButtonEnabled()} onClick={() => {
            setSkip((skip - take) < 0 ? 0 : skip - take)
        }}><ArrowLeft /></Button>
        <Button className="float-right" disabled={isNextButtonEnabled()} onClick={() => {
            setSkip(skip + take)
        }}>
            <ArrowRight />
        </Button></>
}