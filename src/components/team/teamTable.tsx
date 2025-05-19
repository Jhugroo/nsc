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
import CreateInitiative from "./create";
import { Delete, Pencil, PlusCircle } from "lucide-react";
import { Switch } from "../ui/switch";
import { TeamImageUpload } from "./teamImageUpload";


export default function TeamTable() {
    const { data: team, isLoading, refetch, isRefetching } = api.team.get.useQuery()
    const deleteMember = api.team.delete.useMutation({
        onSuccess: (deletedMember) => {
            toast.success('Member ' + deletedMember.name + ' deleted successfully')
            void refetch()
        },
        onError: () => {
            toast.error("An error occurred while team member you may not have suffieicent authorization")
        }
    });
    const switchActiveMember = api.team.switchActive.useMutation({
        onSuccess: (switchedState) => {
            toast.success(`Member ${switchedState.name} ${switchedState.activated ? 'A' : 'Dea'}ctived successfully`)
            void refetch()
        },
        onError: () => {
            toast.error("An error occurred while switching the initiative, you may not have sufficient authority")
        }
    });
    return (
        <>
            <CreateEditMemberDialog refetch={refetch} />
            <Table>
                <TableCaption>A list of your team(currently shows initiatives)</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead >Title</TableHead>
                        <TableHead >Usage</TableHead>
                        <TableHead >Usage</TableHead>
                        <TableHead >Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!isLoading && team?.map((member) => {
                        return <TableRow key={member.id} >
                            <TableCell className="font-medium">{member.title}</TableCell>
                            <TableCell className="font-medium">
                                <Switch
                                    disabled={switchActiveMember.isLoading || isRefetching}
                                    checked={member.activated}
                                    onCheckedChange={() => { switchActiveMember.mutate({ id: member.id, activated: member.activated }) }}
                                />
                            </TableCell>
                            <TableCell className="font-medium">
                                <TeamImageUpload id={member.id} />
                            </TableCell>
                            <TableCell className="font-medium space-x-2">
                                <CreateEditMemberDialog refetch={refetch} memberId={member.id} />
                                <Button title="Delete initiative" variant="destructive" onClick={() => { deleteMember.mutate(member.id) }}><Delete /></Button>
                            </TableCell>
                        </TableRow>
                    }
                    )}
                </TableBody >
            </Table >
        </>
    )
}



function CreateEditMemberDialog({ refetch, memberId }: {
    memberId?: string,
    refetch?: () => void
}) {
    const typeString: string = memberId ? "Update" : "Create new"
    return <Dialog>
        <DialogTrigger asChild>
            <Button variant="default" title={`${typeString} member`}>        {memberId ? <Pencil /> : <PlusCircle />}</Button>
        </DialogTrigger>
        <DialogContent className="min-w-fit overflow-auto">
            <DialogHeader>
                <DialogTitle className="text-left">
                    {typeString} member
                </DialogTitle>
            </DialogHeader>
            <CreateInitiative refetcher={refetch} id={memberId} CloseTrigger={DialogTrigger} />
        </DialogContent>
    </Dialog>
}