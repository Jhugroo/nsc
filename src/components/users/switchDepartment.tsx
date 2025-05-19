import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button"
import { api } from "@/utils/api"
import type * as DialogPrimitive from "@radix-ui/react-dialog"
import AutocompleteField from "../ui/custom/autocomplete";
import { useState } from 'react';

export default function SwitchDepartment({ departments, user, refetcher, CloseTrigger }: {
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
    },
    refetcher?: () => void,
    CloseTrigger: React.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React.RefAttributes<HTMLButtonElement>>
}) {
    const [currentDepartment, setCurrentDepartment] = useState(user.Department?.id ?? '')
    const switchDepartment = api.department.switchDepartment.useMutation({
        onSuccess: (updatedUser) => {
            refetcher ? void refetcher() : null;
            toast.success(`user ${updatedUser.name}'s department updated successfully`)
        },
        onError: () => {
            toast.error("user's department could not be updated, please try again later")
        }
    });
    return (
        <>
            <div className="p-1">
                <AutocompleteField fieldName="department" value={currentDepartment} onValueChange={(e) => setCurrentDepartment(e)} displayName="Department" showLabel={true} options={departments.map(department => ({ value: department.id, label: department.label }))} />
            </div>
            <div className="p-1">
                <CloseTrigger asChild>
                    <Button onClick={() => switchDepartment.mutate({ userId: user.id, departmentId: currentDepartment })}>Update</Button>
                </CloseTrigger>
            </div>
        </>
    )
}
