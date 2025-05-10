import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "../scroll-area"
import { LoadingSpinner } from "./spinner"
type fieldType = {
    fieldName: string;
    onValueChange?(value: string): void;
    onTextChange?(value: string): void;
    options: { value: string; label: string }[];
    value?: string;
    optionsLoading?: boolean;
    displayName?: string;
    showLabel?: boolean;
    hideInput?: boolean;
    listClassName?: string;
}
type commandType = {
    setOpen(value: boolean): void;
    fieldName: string;
    optionsLoading?: boolean;
    onValueChange?(value: string): void;
    onTextChange?(value: string): void;
    options: { value: string; label: string }[];
    value?: string;
    displayName?: string;
    showLabel?: boolean;
    hideInput?: boolean;
    listClassName?: string;
}
export default function AutocompleteField({ listClassName = "", fieldName, optionsLoading, showLabel = true, onValueChange, onTextChange, options, value, displayName, hideInput = false }: fieldType) {
    const [open, setOpen] = useState(false)

    return (
        <>
            {showLabel && <Label htmlFor={fieldName}>{displayName ? displayName : fieldName}</Label>}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {(value && options)
                            ? options.find((option) => option.value === value)?.label
                            : (displayName ? `Sélectionner ${displayName}...` : `Sélectionner ${fieldName}...`)}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                    <CommandStuff optionsLoading={optionsLoading} listClassName={listClassName} hideInput={hideInput} setOpen={setOpen} showLabel={showLabel} onTextChange={onTextChange} onValueChange={onValueChange} value={value} fieldName={fieldName} options={options} />
                </PopoverContent>
            </Popover >
        </>
    )
}
function CommandStuff({ listClassName, optionsLoading, value, fieldName, onValueChange, onTextChange, setOpen, options, displayName, hideInput = false }: commandType) {

    return <Command>
        {
            (!hideInput) && <>
                <CommandInput onValueChange={(e) => { onTextChange && onTextChange(e ?? "") }} placeholder={(displayName ? `Search ${displayName}...` : `Search ${fieldName}...`)}
                    className="h-9" />
                <CommandEmpty>  {!optionsLoading ? <>No {displayName ? displayName : fieldName} found.</> : <LoadingSpinner />}</CommandEmpty>
            </>
        }
        <CommandGroup className={listClassName}>
            <ScrollArea className="max-h-48 overflow-auto">
                {options?.map((option) => (
                    <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={() => {
                            onValueChange ? onValueChange(option.value) : null;
                            setOpen(false)
                        }}
                    >
                        {option.label}
                        <CheckIcon
                            className={cn(
                                "ml-auto h-4 w-4",
                                value === option.value ? "opacity-100" : "opacity-0"
                            )}
                        />
                    </CommandItem>
                ))}
            </ScrollArea>
        </CommandGroup>
    </Command>
}