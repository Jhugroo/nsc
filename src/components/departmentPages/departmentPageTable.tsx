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
import { useEffect, useState } from "react";
import { useDepartmentsStore } from "@/state/department";
import AutocompleteField from "../ui/custom/autocomplete";
import { Delete, Pencil, PlusCircle } from "lucide-react";
import { Switch } from "../ui/switch";


export default function DepartmentPageTable() {
    const [currentDepartment, setCurrentDepartment] = useState<string | undefined>(undefined)
    const currentUser = useSession()
    const isCurrentUserAdmin = currentUser.data?.user?.isAdmin
    const { data: departments } = api.department.get.useQuery(undefined, {
        enabled: isCurrentUserAdmin === true,
    })
    const { data: departmentPages, isLoading, refetch, isRefetching } = api.departmentPage.get.useQuery({ search: { departmentId: currentDepartment } })

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
            toast.error("An error occurred while deleting the department, you may not have suffieicent authorization")
        }
    });
    const switchDepartmentPageActivation = api.departmentPage.switchActive.useMutation({
        onSuccess: (switchedState) => {
            toast.success(`department ${switchedState.title} ${switchedState.activated ? 'A' : 'Dea'}ctived successfully`)
            void refetch()
        },
        onError: () => {
            toast.error("An error occurred while switching the department, you may not have sufficient authority")
        }
    });
    return (
        <>
            {departments !== undefined && departments.length > 0 && <div className="p-1 flex my-4">
                <AutocompleteField showLabel={false} displayName="Department" hideInput={true} onValueChange={(e) => { setCurrentDepartment(e) }} value={currentDepartment} fieldName="departmentId"
                    options={departments.map(department => ({ value: department.id, label: department.label }))} />
                <Button disabled={currentDepartment ? false : true} onClick={() => setCurrentDepartment(undefined)}>Show All</Button>
            </div>}
            <CreateEditDepartmentPageDialog refetch={refetch} />
            <Table>
                <TableCaption>A list of your department pages</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead >Title</TableHead>
                        <TableHead >Usage</TableHead>
                        <TableHead >Images</TableHead>
                        <TableHead >Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!isLoading && departmentPages?.map((singleDepartmentPage) => (
                        <TableRow key={singleDepartmentPage.id}>
                            <TableCell className="font-medium">{singleDepartmentPage.title}</TableCell>
                            <TableCell className="font-medium">
                                <Switch
                                    disabled={switchDepartmentPageActivation.isLoading || isRefetching}
                                    checked={singleDepartmentPage.activated}
                                    onCheckedChange={() => { switchDepartmentPageActivation.mutate({ id: singleDepartmentPage.id, departmentId: singleDepartmentPage.departmentId ?? '', activated: singleDepartmentPage.activated }) }}
                                />
                            </TableCell>
                            <TableCell className="font-medium">
                                <DepartmentPageImageUpload id={singleDepartmentPage.id} />
                            </TableCell>
                            <TableCell className="font-medium space-x-2">
                                <CreateEditDepartmentPageDialog refetch={refetch} departmentId={singleDepartmentPage.id} />
                                <Button title="Delete department page" variant="destructive" onClick={() => { deleteDepartmentPage.mutate(singleDepartmentPage.id) }}><Delete /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody >

            </Table >
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
            <Button variant="default" title={`${typeString} department page`}>        {departmentId ? <Pencil /> : <PlusCircle />}</Button>
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