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
import CreateDepartmentPage from "./create";
import { DepartmentPageImageUpload } from "./departmentPageImageUpload";
import { useSession } from "next-auth/react";

export default function DepartmentPageTable() {
    const { data: department, isLoading, refetch } = api.departmentPage.get.useQuery()
    const currentUser = useSession()
    const isCurrentUserAdmin = currentUser.data?.user?.isAdmin
    const { data: departments } = api.department.get.useQuery(undefined, {
        enabled: isCurrentUserAdmin === true,
    })

    const deleteDepartmentPage = api.departmentPage.delete.useMutation({
        onSuccess: (deletedDepartmentPage) => {
            toast.success('department ' + deletedDepartmentPage.title + ' deleted successfully')
            void refetch()
        },
        onError: () => {
            toast.error("An error occurred while deleting the department")
        }
    });
    return (
        <>
            <CreateEditDepartmentPageDialog refetch={refetch} departments={departments} />
            <Table>
                <TableCaption>A list of your department pages</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead >Title</TableHead>
                        <TableHead >Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!isLoading && department?.map((singleDepartmentPage) => (
                        <TableRow key={singleDepartmentPage.id}>
                            <TableCell className="font-medium">{singleDepartmentPage.title}</TableCell>
                            <TableCell className="font-medium space-x-2">
                                <CreateEditDepartmentPageDialog departments={departments} refetch={refetch} departmentId={singleDepartmentPage.id} />
                                <DepartmentPageImageUpload id={singleDepartmentPage.id} />
                                <Button variant="destructive" onClick={() => { deleteDepartmentPage.mutate(singleDepartmentPage.id) }}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody >

            </Table>
        </>
    )
}


function CreateEditDepartmentPageDialog({ departments, refetch, departmentId }: {
    departments?: {
        id: string;
        code: string;
        label: string;
    }[],
    departmentId?: string,
    refetch?: () => void
}) {
    const typeString: string = departmentId ? "Update" : "Create new"
    return <Dialog>
        <DialogTrigger asChild>
            <Button variant="default">{typeString} department page</Button>
        </DialogTrigger>
        <DialogContent className="min-w-fit overflow-auto">
            <DialogHeader>
                <DialogTitle className="text-left">
                    {typeString} department
                </DialogTitle>
            </DialogHeader>
            <CreateDepartmentPage departments={departments} refetcher={refetch} id={departmentId} CloseTrigger={DialogTrigger} />
        </DialogContent>
    </Dialog>
}