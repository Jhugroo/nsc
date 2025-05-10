import { type ChangeEvent, useState, useEffect } from "react"
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/utils/api"
import type * as DialogPrimitive from "@radix-ui/react-dialog"
type createlocationType = { id: number; code: string; label: string }
const initialiselocation: createlocationType = { id: -1, code: '', label: '' };

export default function CreateLocation(updateData: {
    id?: number, refetcher?: () => void,
    CloseTrigger: React.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React.RefAttributes<HTMLButtonElement>>
}) {
    const { data: updatelocationQuery } = api.location.getById.useQuery({ id: updateData.id });
    const [data, setData] = useState(initialiselocation)
    useEffect(() => {
        if (updatelocationQuery?.id) {
            setData(updatelocationQuery)
        }
    }, [updatelocationQuery])
    const createlocation = api.location.create.useMutation({
        onSuccess: (createdlocation) => {
            setData(initialiselocation)
            updateData.refetcher ? void updateData.refetcher() : null;
            toast.success('location monitoring type ' + createdlocation.label + ' created successfully')
        },
        onError: () => {
            toast.error("location monitoring type could not be created, please fill out all fields correctly")
        }
    });
    const updatelocation = api.location.updateById.useMutation({
        onSuccess: (updatedlocation) => {
            updateData.refetcher ? void updateData.refetcher() : null;
            toast.success('location monitoring type' + updatedlocation.label + ' updated successfully')
        }
    })
    const updateDataFields = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }
    function save() {
        if (data.id > -1) {
            updatelocation.mutate(data);
        }
        else {
            createlocation.mutate(data);
        }
    }
    return (
        <>
            <div className="p-1">
                <Label htmlFor="code">Code</Label>
                <Input id="code" disabled={updateData.id ? true : false} name="code" value={data.code} onChange={(e) => { updateDataFields(e); }} />
            </div>
            <div className="p-1">
                <Label htmlFor="label">Label</Label>
                <Input id="label" name="label" value={data.label} onChange={(e) => { updateDataFields(e); }} />
            </div>
            <div className="p-1">
                <updateData.CloseTrigger asChild>
                    <Button onClick={() => save()}>Save</Button>
                </updateData.CloseTrigger>
            </div>
        </>
    )
}
