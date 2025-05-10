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
import { Badge } from "../ui/badge";
import { MailPlus } from "lucide-react";
import PaginationNavigator from "../ui/custom/paginationNavigator";
type searchDataType = {
    verificationRequested?: boolean
    skip: number
}
export function ViewUsers() {
    const [searchData, setSearchData] = useState<searchDataType>({ skip: 0, verificationRequested: false })
    const { data: users, isLoading, refetch } = api.user.getUsers.useQuery(searchData);
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
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!isLoading ? users?.users?.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name} </TableCell>
                            <TableCell className="flex">{user.email} {user.email && <a className="pl-2" href={`mailto:${user.email}`}><MailPlus /></a>} </TableCell>
                            <TableCell>{user.phone}</TableCell>
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
