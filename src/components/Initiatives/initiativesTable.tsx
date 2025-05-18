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
import { Delete, type LucideIcon, Pencil, PlusCircle } from "lucide-react";
import { Switch } from "../ui/switch";
import { componentMap } from "./initiativesList";


export default function InitiativeTable() {
    const { data: initiatives, isLoading, refetch, isRefetching } = api.initiatives.get.useQuery()
    const deleteInitiative = api.initiatives.delete.useMutation({
        onSuccess: (deletedInitiative) => {
            toast.success('initiative ' + deletedInitiative.title + ' deleted successfully')
            void refetch()
        },
        onError: () => {
            toast.error("An error occurred while deleting the initiative, you may not have suffieicent authorization")
        }
    });
    const switchInitiativeActivation = api.initiatives.switchActive.useMutation({
        onSuccess: (switchedState) => {
            toast.success(`initiative ${switchedState.title} ${switchedState.activated ? 'A' : 'Dea'}ctived successfully`)
            void refetch()
        },
        onError: () => {
            toast.error("An error occurred while switching the initiative, you may not have sufficient authority")
        }
    });
    return (
        <>
            <CreateEditInitiativeDialog refetch={refetch} />
            <Table>
                <TableCaption>A list of your initiatives</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead >Title</TableHead>
                        <TableHead >Icon</TableHead>
                        <TableHead >Usage</TableHead>
                        <TableHead >Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!isLoading && initiatives?.map((singleInitiative) => {
                        const Icon: LucideIcon = componentMap[singleInitiative.icon as keyof typeof componentMap];
                        return <TableRow key={singleInitiative.id} >
                            <TableCell className="font-medium">{singleInitiative.title}</TableCell>
                            <TableCell className="font-medium"><Icon className={`h-6 w-6 text-${singleInitiative.iconColor}`} /></TableCell>
                            <TableCell className="font-medium">
                                <Switch
                                    disabled={switchInitiativeActivation.isLoading || isRefetching}
                                    checked={singleInitiative.activated}
                                    onCheckedChange={() => { switchInitiativeActivation.mutate({ id: singleInitiative.id, activated: singleInitiative.activated }) }}
                                />
                            </TableCell>
                            <TableCell className="font-medium space-x-2">
                                <CreateEditInitiativeDialog refetch={refetch} initiativeId={singleInitiative.id} />
                                <Button title="Delete initiative" variant="destructive" onClick={() => { deleteInitiative.mutate(singleInitiative.id) }}><Delete /></Button>
                            </TableCell>
                        </TableRow>
                    }
                    )}
                </TableBody >
            </Table >
        </>
    )
}



function CreateEditInitiativeDialog({ refetch, initiativeId }: {
    initiativeId?: string,
    refetch?: () => void
}) {
    const typeString: string = initiativeId ? "Update" : "Create new"
    return <Dialog>
        <DialogTrigger asChild>
            <Button variant="default" title={`${typeString} initiative`}>        {initiativeId ? <Pencil /> : <PlusCircle />}</Button>
        </DialogTrigger>
        <DialogContent className="min-w-fit overflow-auto">
            <DialogHeader>
                <DialogTitle className="text-left">
                    {typeString} initiative
                </DialogTitle>
            </DialogHeader>
            <CreateInitiative refetcher={refetch} id={initiativeId} CloseTrigger={DialogTrigger} />
        </DialogContent>
    </Dialog>
}