import { type ChangeEvent, useState, useEffect } from "react"
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/utils/api"
import { Textarea } from "../ui/textarea";
import type * as DialogPrimitive from "@radix-ui/react-dialog"
import AutocompleteField from "../ui/custom/autocomplete";
import { CheckCircle } from "lucide-react";
import FormSkeleton from "../ui/custom/form-skeleton";
type createInitiativeType = {
    id: string;
    title: string;
    description: string;
    icon: string;
    iconColor: string;
    weight: number
    activated: boolean
}

const initialiseInitiave: createInitiativeType = {
    id: '',
    title: '',
    description: '',
    icon: '',
    iconColor: '',
    weight: 0,
    activated: true
};
const icons = [
    { value: 'Calendar', label: 'Calendar' },
    { value: 'Users', label: 'Users' },
    { value: 'BookOpen', label: 'Book Open' },
    { value: 'Award', label: 'Award' },
]
export default function CreateInitiave({ id, refetcher, CloseTrigger }: {
    id?: string, refetcher?: () => void,
    CloseTrigger: React.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React.RefAttributes<HTMLButtonElement>>
}) {
    const { data: updateInitiativeQuery, refetch, isLoading } = api.initiatives.getById.useQuery({ id: id });
    const [data, setData] = useState(initialiseInitiave)
    useEffect(() => {
        if (updateInitiativeQuery && id) {
            setData(updateInitiativeQuery)
        }
    }, [updateInitiativeQuery, id])
    const createInitiave = api.initiatives.create.useMutation({
        onSuccess: (createdInitiative) => {
            setData(initialiseInitiave)
            refetcher ? void refetcher() : null;
            void refetch()
            toast.success('Initiative ' + createdInitiative.title + ' created successfully')
        },
        onError: () => {
            toast.error("Initiative could not be created, please fill out all fields correctly or you may not have sufficient authority")
        }
    });
    const updateInitiative = api.initiatives.updateById.useMutation({
        onSuccess: (updateInitiative) => {
            refetcher ? void refetcher() : null;
            toast.success('Initiative ' + updateInitiative.title + ' updated successfully')
            void refetch()
        },
        onError: () => {
            toast.error("Initiative could not be updated, please fill out all fields correctly or you may not have sufficient authority")
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
            updateInitiative.mutate(data);
        }
        else {
            createInitiave.mutate(data);
        }
    }
    if (isLoading) return <FormSkeleton />
    return (
        <div >
            <div className="p-1">
                <table>
                    <tr>
                        <td >
                            <AutocompleteField showLabel={true} displayName="Icon" hideInput={true} onValueChange={(e) => {
                                setData({
                                    ...data,
                                    icon: e
                                })
                            }} value={data.icon} fieldName="icon"
                                options={icons} />
                        </td>
                        <td>
                            <div className="ml-2">
                                <Label htmlFor="iconColor">Icon color</Label>
                                <Input id="iconColor" name="iconColor" value={data.iconColor} onChange={(e) => { updateDataFields(e); }} />
                            </div>
                        </td>
                    </tr>
                </table>


            </div>
            <div className="p-1">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={data.title} onChange={(e) => { updateDataFields(e); }} />
            </div>

            <div className="p-1">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={data.description} onChange={(e) => { updateDataFields(e); }} />
            </div>

            <div className="p-1 float-right space-x-2">
                <CloseTrigger asChild>
                    <Button onClick={() => save()} variant="secondary" className="bg-green-500 hover hover:bg-green-600"><CheckCircle /></Button>
                </CloseTrigger>
            </div>

        </div >
    )
}
