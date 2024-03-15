"use client";
import { useEffect, useState, useRef } from "react";
import {
    Container,
    Box,
  } from "@mui/material";

import TicketCard, { TicketStatus } from "@/app/user/ticket/components/TicketCard"
import { number } from "yup";

export default function _() {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [scrollPosition, setScrollPosition] = useState(0)

    const [scrollLen, setScrollLen] = useState(Array(20).fill(0).map((e, index) => ({
        label : index
    }))) 

    const compNum = Array()

    const [scrollTop, setScrollTop] = useState(0);




    const handlerScroll = (event: Event): void => {
        const target = event.target as HTMLElement;

        const scrollHeight = target.scrollHeight - target.clientHeight

        if (scrollHeight <= target.scrollTop + 1) {

            const newElement = Array(10).fill(0).map((e, index) => ({
                label : scrollLen[scrollLen.length - 1].label + index
            }))

            const actualArray = scrollLen.slice(scrollLen.length -10 , scrollLen.length)

            setScrollLen([...actualArray, ...newElement])

            console.log(scrollHeight / 2)

            target.scrollTo(0, scrollHeight / 2)

        }



    }

    return (
        <>
        <Container>
            <Box sx={{ maxHeight: "100vh", overflowY: "scroll" }} onScroll={handlerScroll} ref={scrollContainerRef} >
                {scrollLen.map((e, index) => <TicketCard label={`${e.label}`} description="prova" status={TicketStatus.COMPLETED} key={index} />)}
            </Box>
        </Container>
        </>
    )
}