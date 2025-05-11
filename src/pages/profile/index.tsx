
import { api } from "@/utils/api"
import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Card,
    CardContent,
    CardHeader,
    CardDescription,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/custom/spinner"
type userType = {
    id: string;
    name: string | null;
    email: string | null;
    isAdmin: boolean;
    isVerified: boolean;
    emailVerified: Date | null;
    image: string | null;
    phone: string | null;
    verificationRequested: boolean;
} | null | undefined
export default function ProfilePage() {

    const { data: user, refetch, isLoading } = api.user.get.useQuery()
    const mutateUsers = api.user.userStatus.useMutation({
        onSuccess: () => {
            toast.dismiss()
            void refetch()
            toast.success("Verification request sent")
        }
    })
    function sendVerificationRequest() {
        mutateUsers.mutate()
    }
    return <div className="mx-4 pb-4 pt-8">
        <Card className="flex rounded-lg flex-col" >
            <CardHeader>
                <CardTitle>
                    My info
                </CardTitle>
                <CardDescription>
                    {!isLoading ? (
                        <>
                            <div className="p-1">
                                <Label ><strong>Department:</strong> {(user?.Department as { label: string } | null)?.label ?? 'N/A'}</Label>
                            </div>
                            <div className="p-1">
                                <Label ><strong>Email:</strong> {user?.email}</Label>
                            </div>
                            <div className="p-1">
                                <Label ><strong>Name:</strong> {user?.name}</Label>
                            </div>
                            <div className="p-1">
                                <Label ><strong>Phone:</strong> {user?.phone}</Label>
                            </div>
                            <div className="p-1">
                                <UpdateAccount refetch={refetch} user={user} verify={sendVerificationRequest} />
                            </div>
                            <VerificationRequestButton user={user} verify={sendVerificationRequest} />
                        </>
                    ) : <LoadingSpinner />}
                </CardDescription>
            </CardHeader>
        </Card >
    </div >
}
function VerificationRequestButton({ user, verify }: { user: userType, verify: () => void }) {
    const [disabled, setDisabled] = useState(true)
    useEffect(() => {
        if (!user?.name || !user.phone) {
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    }, [user])
    return <div className="p-1">
        {user?.isVerified ? <div> Your account has been verified </div> :
            user?.verificationRequested ? <Label ><strong>Verification request sent, please wait while we verify you</strong> </Label> :
                <Button disabled={disabled} variant="secondary" onClick={() => { toast.loading("Sending verification request"); verify() }}>Send verification request</Button>
        }
    </div>
}

function UpdateAccount({ refetch, user, verify }: {
    refetch: () => void,
    user: userType,
    verify: () => void
}) {
    const mutateUser = api.user.updateUserData.useMutation({
        onSuccess: () => {
            toast.success('Account details updated')
            refetch && void refetch()
        },
        onError: () => {
            toast.error("An error occured during details update, please try again later.")
        }
    });
    const [data, setData] = useState<{ phone: string, name: string }>({ phone: '', name: '' });

    useEffect(() => {
        setData({ phone: user?.phone ?? '', name: user?.name ?? '' })
    }, [user])

    return <Dialog>
        <DialogTrigger asChild>
            <Button variant="secondary">Update Account</Button>
        </DialogTrigger>
        <DialogContent className="overflow-auto">
            <Card className="mt-2"  >
                <CardHeader>
                    <CardTitle>
                        Update your account
                    </CardTitle>
                </CardHeader>
                <CardContent >
                    <div className="p-1">
                        <Label htmlFor="name">Full Name</Label>
                        <Input disabled={user?.isVerified} id="name" name="name" value={data.name} onChange={(e) => { setData({ ...data, ['name']: e.target.value }) }} />
                    </div>
                    <div className="p-1 pt-4">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="number" name="phone" value={data.phone} onChange={(e) => { setData({ ...data, ['phone']: e.target.value }) }} />
                    </div>

                    <div className="p-1 pt-4">
                        <Button onClick={() => { mutateUser.mutate({ name: data.name, phone: data.phone, id: user?.id }) }}>Update</Button>
                    </div>
                    <VerificationRequestButton user={user} verify={verify} />
                </CardContent>
            </Card >
            <DialogFooter >
            </DialogFooter>
        </DialogContent>
    </Dialog>
}
