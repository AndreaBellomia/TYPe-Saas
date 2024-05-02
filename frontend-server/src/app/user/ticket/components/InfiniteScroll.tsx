// import React, { useEffect, useState, useRef } from "react";
// import {
//   Container,
//   Box,
//   Typography,
//   Backdrop,
//   CircularProgress,
// } from "@mui/material";
// import { DjangoApi } from "@/libs/fetch";

// import TicketCard from "./TicketCard"

// import {Ticket} from "@/types"

// const API = new DjangoApi()

// export default function _() {
//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const [loading, SetLoading] = useState(false);
//   const [page, setPage] = useState(0);

//   const [data, setData] = useState<Ticket[]>([]);

//   useEffect(() => {
//     API.get(
//         "ticket/tickets/list",
//         (response) => {
//             setData(response.data.results)
//             console.log(response.data)
//         },
//         (e) => {
//             console.error(e);
//         }
//     )
//   }, [])

//   const handlerScroll = (event: Event): void => {
//     const target = scrollContainerRef.current as HTMLElement;
//     const len = data.length;
//     const scrollHeight = target.scrollHeight - target.clientHeight;

//     if (scrollHeight <= target.scrollTop + 1) {
//       const newElements = Array(10)
//         .fill(0)
//         .map((e, index) => ({
//           label: data[data.length - 1].label + index,
//         }));

//       SetLoading(true);
//       setTimeout(() => {
//         setData((prev) => [...prev.slice(10), ...newElements]);
//         SetLoading(false);
//         target.scrollTo(0, 10);
//       }, 1000);
//     }

//     if (target.scrollTop <= 1) {
//       const newElements = Array(10)
//         .fill(0)
//         .map((e, index) => ({
//           label: data[data.length - 1].label + index,
//         }));

//       SetLoading(true);
//       setTimeout(() => {
//         setData((prev) => [...newElements, ...prev.slice(0, len - 10)]);
//         SetLoading(false);
//         target.scrollTo(0, scrollHeight - 10);
//       }, 1000);
//     }
//   };

//   return (
//     <>
//       <Box
//         sx={{ maxHeight: "80vh", overflowY: "scroll" }}
//         onScroll={handlerScroll}
//         ref={scrollContainerRef}
//       >
//         {/*@ts-ignore*/}
//         {data && data.map((e, index) => <TicketCard label={e.label} description={e.description} status={e.status} key={index}/>)}
//       </Box>
//       <Backdrop
//         sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
//         open={loading}
//       >
//         <CircularProgress color="inherit" />
//       </Backdrop>
//       </>
//   );
// }
