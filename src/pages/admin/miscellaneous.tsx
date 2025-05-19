import EventTable from "@/components/event/eventTable";
import InitiativesTable from "@/components/Initiatives/initiativesTable";
import TeamTable from "@/components/team/teamTable";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableRow,
} from "@/components/ui/table"

export default function MiscellaneousPage() {
    return <>
        <Table>
            <TableCaption>A list of your miscellaneous tools</TableCaption>
            <TableBody>
                <TableRow key="misc-1">
                    <TableCell >
                        <h2 className="text-3xl font-bold tracking-tight">Initiatives</h2>
                        <InitiativesTable />
                    </TableCell>
                    <TableCell >
                        <h2 className="text-3xl font-bold tracking-tight">Team</h2>
                        <TeamTable />
                    </TableCell>
                </TableRow>
            </TableBody >

        </Table >
    </>
}