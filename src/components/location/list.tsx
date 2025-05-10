import { api } from "@/utils/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import toast from "react-hot-toast";
import CreateLocation from "./create";
export default function ListLocations() {
    const { data: locations, refetch, isLoading } = api.location.get.useQuery();
    const deleteLocation = api.location.delete.useMutation({
        onSuccess: (deletedLocation) => {
            toast.success('location ' + deletedLocation.label + ' deleted successfully')
            void refetch()
        },
        onError: () => {
            toast.error("location  is referenced in foods and cannot be deleted anymore")
        }
    });
    return <>
        <CreateEditlocationDialog refetch={refetch} />
        <Table>
            <TableCaption>List of locations</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead >Code</TableHead>
                    <TableHead >Label</TableHead>
                    <TableHead >Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {!isLoading && locations?.map((singleLocation) => (
                    <TableRow key={singleLocation.id}>
                        <TableCell className="font-medium">{singleLocation.code}</TableCell>
                        <TableCell className="font-medium">{singleLocation.label}</TableCell>
                        <TableCell className="font-medium">
                            <CreateEditlocationDialog refetch={refetch} locationId={singleLocation.id} />
                            <Button variant="destructive" onClick={() => { deleteLocation.mutate(singleLocation.id) }}>Delete</Button></TableCell>
                    </TableRow>
                ))}
            </TableBody >
            <TableFooter>
            </TableFooter>
        </Table>
    </>
}
function CreateEditlocationDialog({ refetch, locationId }: { locationId?: number, refetch?: () => void }) {
    const typeString: string = locationId ? "Update" : "Create new"
    return <Dialog>
        <DialogTrigger asChild>
            <Button variant="default">{typeString}</Button>
        </DialogTrigger>
        <DialogContent className="h-fit overflow-auto">
            <DialogHeader>
                <DialogTitle className="text-left">
                    {typeString} location
                </DialogTitle>
            </DialogHeader>
            <CreateLocation id={locationId} refetcher={refetch} CloseTrigger={DialogTrigger} />
        </DialogContent>
    </Dialog>
}