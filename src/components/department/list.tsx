import { api } from "@/utils/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import toast from "react-hot-toast";
import CreateDepartment from "./create";
import { Delete, Pencil, PlusCircle } from "lucide-react";
export default function ListDepartments() {
    const { data: departments, refetch, isLoading } = api.department.get.useQuery();
    const deleteDepartment = api.department.delete.useMutation({
        onSuccess: (deletedDepartment) => {
            toast.success('department ' + deletedDepartment.label + ' deleted successfully')
            void refetch()
        },
        onError: () => {
            toast.error("department is referenced somewhere and cannot be deleted anymore")
        }
    });
    return <>
        <CreateEditdepartmentDialog refetch={refetch} />
        <Table>
            <TableCaption>List of departments</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead >Code</TableHead>
                    <TableHead >Label</TableHead>
                    <TableHead >Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {!isLoading && departments?.map((singleDepartment) => (
                    <TableRow key={singleDepartment.id}>
                        <TableCell className="font-medium">{singleDepartment.code}</TableCell>
                        <TableCell className="font-medium">{singleDepartment.label}</TableCell>
                        <TableCell className="font-medium space-x-2">
                            <CreateEditdepartmentDialog refetch={refetch} departmentId={singleDepartment.id} />
                            <Button variant="destructive" onClick={() => { deleteDepartment.mutate(singleDepartment.id) }}><Delete /></Button></TableCell>
                    </TableRow>
                ))}
            </TableBody >
            <TableFooter>
            </TableFooter>
        </Table>
    </>
}
function CreateEditdepartmentDialog({ refetch, departmentId }: { departmentId?: string, refetch?: () => void }) {
    const typeString: string = departmentId ? "Update" : "Create new"
    return <Dialog>
        <DialogTrigger asChild>
            <Button variant="default" title={`${typeString} department page`}>{departmentId ? <Pencil /> : <PlusCircle />}</Button>
        </DialogTrigger>
        <DialogContent className="h-fit overflow-auto">
            <DialogHeader>
                <DialogTitle className="text-left">
                    {typeString} department
                </DialogTitle>
            </DialogHeader>
            <CreateDepartment id={departmentId} refetcher={refetch} CloseTrigger={DialogTrigger} />
        </DialogContent>
    </Dialog>
}