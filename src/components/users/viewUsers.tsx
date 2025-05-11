import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { api } from "@/utils/api"
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { LoadingSpinner } from "../ui/custom/spinner";
import { MailPlus, CircleEllipsis } from "lucide-react";
import PaginationNavigator from "../ui/custom/paginationNavigator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import SwitchDepartment from "./switchDepartment";
import { Badge } from "../ui/badge";
type searchDataType = {
    verificationRequested?: boolean
    skip: number
}
export function ViewUsers() {
    const [searchData, setSearchData] = useState<searchDataType>({ skip: 0, verificationRequested: false })
    const { data: users, isLoading, refetch } = api.user.getUsers.useQuery(searchData);
    const { data: departments } = api.department.get.useQuery()
    const currentUser = useSession()
    const [disableButtons, setDisableButtons] = useState(false)
    const mutateUsers = api.user.userStatus.useMutation({
        onSuccess: (user) => {
            void refetch()
            setDisableButtons(false)
            toast.dismiss()
            toast.success(user.name + " modified successfully")
        }
    })
    const [skip, setSkip] = useState(0)
    useEffect(() => {
        setSearchData({ ...searchData, skip: skip })
    }, [skip])

    return (
        <>
            <div className="p-1 pt-4">
                <Checkbox className="mr-1" id="verificationRequested" checked={searchData?.verificationRequested} onClick={() => { setSearchData({ ...searchData, verificationRequested: !searchData.verificationRequested }) }} />
                <Label htmlFor="verificationRequested">View Verification requests</Label>
            </div>
            <div className="p-1 pt-4">
                <PaginationNavigator take={50} isLoading={isLoading} isNextNull={users?.isNextNull} skip={skip} setSkip={setSkip} />
            </div>
            <Table>
                <TableCaption>A list of your users.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead >E-mail</TableHead>
                        <TableHead >Phone</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!isLoading ? users?.users?.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name} </TableCell>
                            <TableCell className="flex">{user.email} {user.email && <a className="pl-2" href={`mailto:${user.email}`}><MailPlus /></a>} </TableCell>
                            <TableCell>{user.phone}</TableCell>
                            <TableCell ><Badge className="text-md" variant="outline">{(user.Department as { label: string } | null)?.label ?? 'N/A'}</Badge> {departments === undefined ? <LoadingSpinner /> : <ModifyDepartment departments={departments} user={({ ...user, name: user.name ?? 'N/A' })} refetch={refetch} />}</TableCell>
                            <TableCell>
                                {user.id === currentUser.data?.user.id ? <>That's you!</> : (
                                    searchData?.verificationRequested ? <Button disabled={disableButtons} onClick={() => { toast.loading("Confirming user"); setDisableButtons(true); mutateUsers.mutate({ id: user.id, current: false, status: "isVerified" }) }}>Accept</Button>
                                        :
                                        <>
                                            <Button variant={!user.isVerified ? "destructive" : "default"} className="mr-2" disabled={disableButtons} onClick={() => { toast.loading((user.isVerified ? "Unconfirm" : "Confirm") + "ing user"); setDisableButtons(true); mutateUsers.mutate({ id: user.id, current: user.isVerified ?? false, status: "isVerified" }) }}    >{user.isVerified ? "Unconfirm" : "Confirm"}</Button>
                                            <Button variant={!user.isAdmin ? "destructive" : "default"} disabled={disableButtons} onClick={() => { toast.loading((user.isAdmin ? "Demot" : "Promot") + "ing user"); setDisableButtons(true); mutateUsers.mutate({ id: user.id, current: user.isAdmin ?? false, status: "isAdmin" }) }}>{user.isAdmin ? "Demote" : "Promote"}</Button>
                                        </>)}
                            </TableCell>
                        </TableRow>
                    )) :
                        <TableRow key="awaiter">
                            <TableCell className="font-medium"><LoadingSpinner /></TableCell>
                            <TableCell><LoadingSpinner /></TableCell>
                            <TableCell><LoadingSpinner /></TableCell>
                            <TableCell><LoadingSpinner /></TableCell>
                            <TableCell><LoadingSpinner /></TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table >
        </>
    )
}
function ModifyDepartment({ departments, user, refetch }: {
    departments: {
        id: string;
        code: string;
        label: string;
    }[],
    user: {
        Department: {
            label: string;
            id: string;
        } | null;
        name: string;
        id: string;
    }, refetch?: () => void
}) {
    const unassignDepartment = api.department.switchDepartment.useMutation({
        onSuccess: (updatedUser) => {
            refetch ? void refetch() : null;
            toast.success(`user ${updatedUser.name}'s department unassigned successfully`)
        },
        onError: () => {
            toast.error("user's department could not be unassigned, please try again later")
        }
    });
    console.log(user.Department)
    return <Dialog>
        <DialogTrigger asChild>
            <Button variant="ghost"><CircleEllipsis /> </Button>
        </DialogTrigger>
        <DialogContent className="h-fit overflow-auto">
            <DialogHeader>
                <DialogTitle className="text-left">
                    Current Department for  {user.name}  → <Badge>{(user.Department as { label: string } | null)?.label ?? 'N/A'}</Badge>
                </DialogTitle>
            </DialogHeader>

            <SwitchDepartment departments={departments} user={user} refetcher={refetch} CloseTrigger={DialogTrigger} />
            {user.Department && <div className="p-1">
                <DialogTrigger asChild>
                    <Button variant="destructive" onClick={() => unassignDepartment.mutate({ userId: user.id })}>Unassign Department</Button>
                </DialogTrigger>
            </div>}
        </DialogContent>
    </Dialog>
}