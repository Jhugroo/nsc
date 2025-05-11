import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { api } from "@/utils/api";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import CreateEvent from "./create";
import { EventUploadImage } from "./eventImageUpload";
import { dateFormatterDisplay } from "@/lib/utils";

export default function EventTable() {
    const { data: event, isLoading, refetch } = api.event.get.useQuery()
    const { data: departments } = api.department.get.useQuery()


    const deleteEvent = api.event.delete.useMutation({
        onSuccess: (deletedEvent) => {
            toast.success('event ' + deletedEvent.title + ' deleted successfully')
            void refetch()
        },
        onError: () => {
            toast.error("An error occurred while deleting the event")
        }
    });
    return (
        <>
            <CreateEditEventDialog refetch={refetch} departments={departments} />
            <Table>
                <TableCaption>A list of your events</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead >Title</TableHead>
                        <TableHead >Event Date</TableHead>
                        <TableHead >Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!isLoading && event?.map((singleEvent) => (
                        <TableRow key={singleEvent.id}>
                            <TableCell className="font-medium">{singleEvent.title}</TableCell>
                            <TableCell className="font-medium">{dateFormatterDisplay(singleEvent.eventDate)}</TableCell>
                            <TableCell className="font-medium space-x-2">
                                <CreateEditEventDialog refetch={refetch} eventId={singleEvent.id} departments={departments} />
                                <EventUploadImage id={singleEvent.id} />
                                <Button variant="destructive" onClick={() => { deleteEvent.mutate(singleEvent.id) }}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody >

            </Table>
        </>
    )
}


function CreateEditEventDialog({ refetch, eventId, departments }: {
    departments: {
        id: string;
        code: string;
        label: string;
    }[], eventId?: string, refetch?: () => void
}) {
    const typeString: string = eventId ? "Update" : "Create new"
    return <Dialog>
        <DialogTrigger asChild>
            <Button variant="default">{typeString} event</Button>
        </DialogTrigger>
        <DialogContent className="min-w-fit overflow-auto">
            <DialogHeader>
                <DialogTitle className="text-left">
                    {typeString} event
                </DialogTitle>
            </DialogHeader>
            <CreateEvent refetcher={refetch} id={eventId} CloseTrigger={DialogTrigger} departments={departments} />
        </DialogContent>
    </Dialog>
}