import { type ChangeEvent, useState, useEffect } from "react"
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/utils/api"
import { Textarea } from "../ui/textarea";
import type * as DialogPrimitive from "@radix-ui/react-dialog"
import AutocompleteField from "../ui/custom/autocomplete";
type createDepartmentPageType = {
    id: string;
    title: string;
    description: string;
    link: string
    departmentId?: string;
}

const initialiseDepartmentPage: createDepartmentPageType = {
    id: '',
    title: '',
    description: '',
    link: ''
};
export default function CreateDepartementPage({ departments, id, refetcher, CloseTrigger }: {
    departments?: {
        id: string;
        code: string;
        label: string;
    }[],
    id?: string, refetcher?: () => void,
    CloseTrigger: React.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React.RefAttributes<HTMLButtonElement>>
}) {

    const { data: updateDepartmentPageQuery, refetch } = api.departmentPage.getById.useQuery({ id: id });
    const [data, setData] = useState(initialiseDepartmentPage)
    useEffect(() => {
        if (updateDepartmentPageQuery && id) {
            setData({
                id: updateDepartmentPageQuery.id,
                title: updateDepartmentPageQuery.title,
                description: updateDepartmentPageQuery.description,
                link: updateDepartmentPageQuery.link ?? '',
                departmentId: updateDepartmentPageQuery.departmentId ?? undefined
            })
        }
    }, [updateDepartmentPageQuery, id])
    const createDepartmentPage = api.departmentPage.create.useMutation({
        onSuccess: (createdDepartmentPage) => {
            setData(initialiseDepartmentPage)
            refetcher ? void refetcher() : null;
            void refetch()
            toast.success('Department page ' + createdDepartmentPage.title + ' created successfully')
        },
        onError: () => {
            toast.error("Department page could not be created, please fill out all fields correctly")
        }
    });
    const updateDepartmentPage = api.departmentPage.updateById.useMutation({
        onSuccess: (updatedDepartmentPage) => {
            refetcher ? void refetcher() : null;
            toast.success('DepartmentPage ' + updatedDepartmentPage.title + ' updated successfully')
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
            updateDepartmentPage.mutate(data);
        }
        else {
            createDepartmentPage.mutate(data);
        }
    }
    return (
        <div >
            <div className="p-1">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={data.title} onChange={(e) => { updateDataFields(e); }} />
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
            <div className="p-1">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={data.description} onChange={(e) => { updateDataFields(e); }} />
            </div>
            <div className="p-1">
                <Label htmlFor="link">Link</Label>
                <Input id="link" name="link" value={data.link} onChange={(e) => { updateDataFields(e); }} />
            </div>
            <div className="p-1">
                <CloseTrigger asChild>
                    <Button onClick={() => save()}>Save</Button>
                </CloseTrigger>
            </div>
        </div >
    )
}
