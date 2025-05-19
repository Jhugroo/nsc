import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { LoadingSpinner } from "../ui/custom/spinner";
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button"
import { api } from "@/utils/api"
import { Badge } from "../ui/badge";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { BookImage } from "lucide-react";
import { type imageType } from "../type";

export function TeamImageUpload({ id }: {
    id: string,
}) {
    const [title, setTitle] = useState('title')

    return <Dialog>
        <DialogTrigger asChild>
            <Button variant="secondary" title="Upload images to department"><BookImage /></Button>
        </DialogTrigger>
        <DialogContent className="min-w-full  max-h-screen overflow-auto">

            <DialogHeader>
                <DialogTitle className="text-left">
                    <h1 className="text-2xl font-bold">Upload Images</h1>
                    <p className="text-sm text-muted-foreground">Upload images for department <Badge variant="secondary">{title}</Badge></p>
                </DialogTitle>
                <ImageUploaderViewer id={id} titleSetter={setTitle} />
                <DialogDescription />
            </DialogHeader>

        </DialogContent>
    </Dialog>
}

function ImageUploaderViewer({ id, titleSetter }: { id: string, titleSetter: (title: string) => void }) {
    const { data: images, refetch } = api.team.getById.useQuery({ id: id });
    const uploadImage = api.team.addImage.useMutation({
        onSuccess: () => {
            toast.success("Image added successfully")
            refetch && void refetch()
        },
        onError: () => {
            toast.error("Image could not be added, please ensure you have correct accesses")
        },
    })
    useEffect(() => {
        titleSetter(images?.title ?? '')
    }, [images])
    return <>
        {images?.image ? <ImageList images={images.image as imageType[]} refetch={refetch} /> : <LoadingSpinner />}
        <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
                id !== undefined &&
                    uploadImage.mutate({ id: id, files: res.map(({ key, name, url, type }) => { return { key: key, name: name, url: url, type: type } }) })
            }}
            onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
            }}
        /></>
}

function ImageList({ images, refetch }: {
    refetch?: () => void,
    images?: imageType[],
}) {
    const deleteImage = api.team.deleteImage.useMutation({
        onSuccess: () => {
            toast.success("Image deleted")
            refetch && void refetch()
        },
        onError: () => {
            toast.error("Image could not be deleted, please ensure you have correct accesses")
        },
    })
    return <section className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:p-6">
        {images?.map((image) => {
            return <div key={image.key} className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2" >
                <Button variant="destructive" onClick={() => deleteImage.mutate({ id: image.id, key: image.key })} className="relative position top-9 float-right m-0 p-1 px-2 ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" strokeLinejoin="round" className="lucide lucide-circle-x"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg></Button>
                <Image
                    src={image.url}
                    alt={image.name}
                    width="400"
                    height="300"
                    className="object-cover w-full h-64"
                    style={{ aspectRatio: "400/300", objectFit: "cover" }}
                />
            </div>
        }
        )}
    </section >
}
