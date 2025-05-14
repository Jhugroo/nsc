import { Skeleton } from "../skeleton"

const FormSkeleton = () => <div >
    <div className="p-1">
        <Skeleton className="w-8 h-4 my-1" />
        <Skeleton className="w-full h-8" />
    </div>
    <div className="p-1">
        <Skeleton className="w-8 h-4 my-1" />
        <Skeleton className="w-full h-8" />
    </div>
    <div className="p-1">
        <Skeleton className="w-8 h-4 my-1" />
        <Skeleton className="w-full h-8" />
    </div>
    <div className="p-1">
        <Skeleton className="w-8 h-4 my-1" />
        <Skeleton className="w-full h-12" />
    </div>
    <div className="p-1 float-right flex space-x-2">
        <Skeleton className="w-12 h-8" />
        <Skeleton className="w-12 h-8" />
    </div>
</div >
export default FormSkeleton