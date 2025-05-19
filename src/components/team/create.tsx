import { type ChangeEvent, useState, useEffect } from "react"
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/utils/api"
import type * as DialogPrimitive from "@radix-ui/react-dialog"
import { CheckCircle } from "lucide-react";
import FormSkeleton from "../ui/custom/form-skeleton";
type createTeamMemberType = {
    id: string;
    title: string;
    name: string;
    role: string;
    weight: number
    activated: boolean
}

const initialiseTeamMember: createTeamMemberType = {
    id: '',
    title: '',
    name: '',
    role: '',
    weight: 0,
    activated: true
};

export default function CreateTeam({ id, refetcher, CloseTrigger }: {
    id?: string, refetcher?: () => void,
    CloseTrigger: React.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React.RefAttributes<HTMLButtonElement>>
}) {
    const { data: updateTeamMemberQuery, refetch, isLoading } = api.team.getById.useQuery({ id: id });
    const [data, setData] = useState(initialiseTeamMember)
    useEffect(() => {
        if (updateTeamMemberQuery && id) {
            setData(updateTeamMemberQuery)
        }
    }, [updateTeamMemberQuery, id])
    const createTeamMember = api.team.create.useMutation({
        onSuccess: (createdTeamMember) => {
            setData(initialiseTeamMember)
            refetcher ? void refetcher() : null;
            void refetch()
            toast.success('Team member ' + createdTeamMember.name + ' created successfully')
        },
        onError: () => {
            toast.error("Team member could not be created, please fill out all fields correctly or you may not have sufficient authority")
        }
    });
    const updateTeamMember = api.team.updateById.useMutation({
        onSuccess: (updateTeamMember) => {
            refetcher ? void refetcher() : null;
            toast.success('Team member ' + updateTeamMember.name + ' updated successfully')
            void refetch()
        },
        onError: () => {
            toast.error("Team member could not be updated, please fill out all fields correctly or you may not have sufficient authority")
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
            updateTeamMember.mutate(data);
        }
        else {
            createTeamMember.mutate(data);
        }
    }
    if (isLoading) return <FormSkeleton />
    return (
        <div >
            <div className="p-1">
            </div>
            <div className="p-1">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={data.title} onChange={(e) => { updateDataFields(e); }} />
            </div>
            <div className="p-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={data.name} onChange={(e) => { updateDataFields(e); }} />
            </div>
            <div className="p-1">
                <Label htmlFor="role">Role</Label>
                <Input id="role" name="role" value={data.role} onChange={(e) => { updateDataFields(e); }} />
            </div>
            <div className="p-1 float-right space-x-2">
                <CloseTrigger asChild>
                    <Button onClick={() => save()} variant="secondary" className="bg-green-500 hover hover:bg-green-600"><CheckCircle /></Button>
                </CloseTrigger>
            </div>

        </div >
    )
}
