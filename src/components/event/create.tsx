import { type ChangeEvent, useState, useEffect } from "react"
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/utils/api"
import { Textarea } from "../ui/textarea";
import type * as DialogPrimitive from "@radix-ui/react-dialog"
import { dateFormatter } from "@/lib/utils";
import AutocompleteField from "../ui/custom/autocomplete";
import { useDepartmentsStore } from "@/state/department";
import { EventUploadImage } from "./eventImageUpload";
import { CheckCircle } from "lucide-react";
type createEventType = {
    id: string;
    title: string;
    eventDate: number;
    location: string;
    description: string;
    link: string
    departmentId?: string;
}

const initialiseEvent: createEventType = {
    id: '',
    title: '',
    eventDate: (new Date()).getTime(),
    location: '',
    description: '',
    link: ''
};
export default function CreateEvent({ id, refetcher, CloseTrigger }: {
    id?: string, refetcher?: () => void,
    CloseTrigger: React.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React.RefAttributes<HTMLButtonElement>>
}) {
    const { departments } = useDepartmentsStore()
    const { data: updateEventQuery, refetch } = api.event.getById.useQuery({ id: id });
    const [data, setData] = useState(initialiseEvent)
    useEffect(() => {
        if (updateEventQuery && id) {
            setData({
                id: updateEventQuery.id,
                title: updateEventQuery.title,
                eventDate: (updateEventQuery.eventDate).getTime(),
                location: updateEventQuery.location,
                description: updateEventQuery.description,
                link: updateEventQuery.link ?? '',
                departmentId: updateEventQuery.departmentId ?? undefined
            })
        }
    }, [updateEventQuery, id])
    const createEvent = api.event.create.useMutation({
        onSuccess: (createdEvent) => {
            setData(initialiseEvent)
            refetcher ? void refetcher() : null;
            void refetch()
            toast.success('Event ' + createdEvent.title + ' created successfully')
        },
        onError: () => {
            toast.error("Event could not be created, please fill out all fields correctly")
        }
    });
    const updateEvent = api.event.updateById.useMutation({
        onSuccess: (updatedEvent) => {
            refetcher ? void refetcher() : null;
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
            {departments !== undefined && <div className="p-1">
                <AutocompleteField showLabel={true} displayName="Department" hideInput={true} onValueChange={(e) => {
                    setData({
                        ...data,
                        departmentId: e
                    })
                }} value={data.departmentId} fieldName="departmentId"
                    options={departments.map(department => ({ value: department.id, label: department.label }))} />
            </div>}
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
            <div className="p-1 float-right space-x-2">
                {id && <EventUploadImage id={id} />}
                <CloseTrigger asChild>
                    <Button onClick={() => save()} variant="secondary" className="bg-green-500 hover hover:bg-green-600"><CheckCircle /></Button>
                </CloseTrigger>
            </div>


        </div >
    )
}
