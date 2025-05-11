
import { useState, useEffect } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import type { CarouselApi } from "@/components/ui/carousel"

interface carouselItems {
    id: string
    key: string
    image: string
}

interface BackgroundCarouselProps {
    items: carouselItems[]
    className?: string
    autoPlay?: boolean
    interval?: number
}

export function BackgroundCarousel({ items, className, autoPlay = true, interval = 5000 }: BackgroundCarouselProps) {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)

    // Handle autoplay
    useEffect(() => {
        if (!autoPlay || !api) return

        const intervalId = setInterval(() => {
            api.scrollNext()
        }, interval)

        return () => clearInterval(intervalId)
    }, [api, autoPlay, interval])

    // Update current slide index when scrolling
    useEffect(() => {
        if (!api) return

        const onSelect = () => {
            setCurrent(api.selectedScrollSnap())
        }

        api.on("select", onSelect)
        return () => {
            api.off("select", onSelect)
        }
    }, [api])

    return (
        <div className={cn("relative w-full", className)}>
            <Carousel
                setApi={setApi}
                className="w-full"
                opts={{
                    loop: true,
                }}
            >
                <CarouselContent className="h-[500px] md:h-[600px] lg:h-[700px]">
                    {items.map((item) => (
                        <CarouselItem key={item.key} className="relative overflow-hidden">
                            <div className="absolute inset-0 w-full h-full">
                                <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.id}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className="left-4 bg-white/20 hover:bg-white/30 text-white border-none" />
                <CarouselNext className="right-4 bg-white/20 hover:bg-white/30 text-white border-none" />

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                    {items.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => api?.scrollTo(index)}
                            className={cn("w-3 h-3 rounded-full transition-all", current === index ? "bg-white" : "bg-white/50")}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </Carousel>
        </div>
    )
}
