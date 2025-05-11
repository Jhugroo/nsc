import { type ChangeEvent, useState, useEffect } from "react"
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/utils/api"
import type * as DialogPrimitive from "@radix-ui/react-dialog"
type createdepartmentType = { id: string; code: string; label: string }
const initialiseDepartment: createdepartmentType = { id: '', code: '', label: '' };

export default function CreateDepartment(updateData: {
    id?: string, refetcher?: () => void,
    CloseTrigger: React.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React.RefAttributes<HTMLButtonElement>>
}) {

    const { data: updatedDepartmentQuery } = api.department.getById.useQuery({ id: updateData.id });
    const [data, setData] = useState(initialiseDepartment)
    useEffect(() => {
        if (updatedDepartmentQuery?.id) {
            setData(updatedDepartmentQuery)
        }
    }, [updatedDepartmentQuery])
    const createdepartment = api.department.create.useMutation({
        onSuccess: (createdDepartment) => {
            setData(initialiseDepartment)
            updateData.refetcher ? void updateData.refetcher() : null;
            toast.success('department ' + createdDepartment.label + ' created successfully')
        },
        onError: () => {
            toast.error("department could not be created, please fill out all fields correctly")
        }
    });
    const updatedepartment = api.department.updateById.useMutation({
        onSuccess: (updateddepartment) => {
            updateData.refetcher ? void updateData.refetcher() : null;
            toast.success('department ' + updateddepartment.label + ' updated successfully')
        }
    })
    const updateDataFields = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }
    function save() {
        if (data.id.length > 0) {
            updatedepartment.mutate(data);
        }
        else {
            createdepartment.mutate(data);
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
