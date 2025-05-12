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
import { useEffect } from "react";
import { useDepartmentsStore } from "@/state/department";

export default function DepartmentPageTable() {
    const { data: department, isLoading, refetch } = api.departmentPage.get.useQuery()
    const currentUser = useSession()
    const isCurrentUserAdmin = currentUser.data?.user?.isAdmin
    const { data: departments } = api.department.get.useQuery(undefined, {
        enabled: isCurrentUserAdmin === true,
    })
    const { setDepartments } = useDepartmentsStore()
    useEffect(() => {
        if (departments) {
            setDepartments(departments)
        }
    }, [departments])
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
            <CreateEditDepartmentPageDialog refetch={refetch} />
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
                                <CreateEditDepartmentPageDialog refetch={refetch} departmentId={singleDepartmentPage.id} />
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


function CreateEditDepartmentPageDialog({ refetch, departmentId }: {
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
            <CreateDepartmentPage refetcher={refetch} id={departmentId} CloseTrigger={DialogTrigger} />
        </DialogContent>
    </Dialog>
}