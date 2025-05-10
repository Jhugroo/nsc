import { type ChangeEvent, useState, useEffect } from "react"
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/utils/api"
import { Textarea } from "../ui/textarea";
import type * as DialogPrimitive from "@radix-ui/react-dialog"
import { dateFormatter } from "@/lib/utils";
type createEventType = {
    id: string;
    title: string;
    eventDate: number;
    location: string;
    description: string;
    link: string
}

const initialiseEvent: createEventType = {
    id: '',
    title: '',
    eventDate: (new Date()).getTime(),
    location: '',
    description: '',
    link: ''
};
export default function CreateEvent(updateData: {
    id?: string, refetcher?: () => void,
    CloseTrigger: React.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React.RefAttributes<HTMLButtonElement>>
}) {
    const { data: updateEventQuery, refetch } = api.event.getById.useQuery({ id: updateData.id });
    const [data, setData] = useState(initialiseEvent)
    useEffect(() => {
        if (updateEventQuery && updateData.id) {
            setData({
                id: updateEventQuery.id,
                title: updateEventQuery.title,
                eventDate: (updateEventQuery.eventDate).getTime(),
                location: updateEventQuery.location,
                description: updateEventQuery.description,
                link: updateEventQuery.link
            })
        }
    }, [updateEventQuery, updateData.id])
    const createEvent = api.event.create.useMutation({
        onSuccess: (createdEvent) => {
            setData(initialiseEvent)
            updateData.refetcher ? void updateData.refetcher() : null;
            void refetch()
            toast.success('Event ' + createdEvent.title + ' created successfully')
        },
        onError: () => {
            toast.error("Event could not be created, please fill out all fields correctly")
        }
    });
    const updateEvent = api.event.updateById.useMutation({
        onSuccess: (updatedEvent) => {
            updateData.refetcher ? void updateData.refetcher() : null;
            toast.success('Event ' + updatedEvent.title + ' updated successfully')
            void refetch()
        }
    })
    const updateDataFields = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }
    function save() {
        if (data.id) {
            updateEvent.mutate(data);
        }
        else {
            createEvent.mutate(data);
        }
    }
    return (
        <div >
            <div className="p-1">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={data.title} onChange={(e) => { updateDataFields(e); }} />
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={data.location} onChange={(e) => { updateDataFields(e); }} />
            </div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" name="eventDate" value={data.eventDate > 0 ? (new Date(data.eventDate)).toISOString().split('T')[0] : (new Date()).toISOString().split('T')[0]} onChange={(e) => { setData({ ...data, eventDate: dateFormatter(e.target.value) }) }} />
            <div className="p-1">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={data.description} onChange={(e) => { updateDataFields(e); }} />
            </div>
            <div className="p-1">
                <Label htmlFor="link">Registration Link</Label>
                <Input id="link" name="link" value={data.link} onChange={(e) => { updateDataFields(e); }} />
            </div>
            <div className="p-1">
                <updateData.CloseTrigger asChild>
                    <Button onClick={() => save()}>Save</Button>
                </updateData.CloseTrigger>
            </div>
        </div >
    )
}
