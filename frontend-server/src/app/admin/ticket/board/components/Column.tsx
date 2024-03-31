import React from "react";
import { Paper, Typography, List, Box } from "@mui/material";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

import TicketCard from "@/app/admin/ticket/components/TicketCard";

import { NodeDragEventData, NodeTouchEventData } from "@formkit/drag-and-drop";

interface ComponentProps {
  groupName: string;
  name: string;
  header: string;
  columnData: Array<ListElement>;
  handleEnd: (
    data: NodeDragEventData<ListElement> | NodeTouchEventData<ListElement>,
  ) => void;
}

interface ListElement {
  label: string;
  id: number;
}

export default function _({
  groupName,
  header,
  name,
  handleEnd,
  columnData,
}: ComponentProps) {


  const [dataList, data, setValues] = useDragAndDrop<HTMLUListElement, ListElement>(
    [],
    {
      group: groupName,
      name: name,
      handleEnd: handleEnd,
      
    },
  );

  React.useEffect(() => {
    setValues(columnData)
  }, [columnData])

  

  return (
    <Paper
      sx={{
        height: "100%",
        padding: 1,
        display: "flex",
        flexDirection: "column",
      }}
      elevation={5}
    >
      <Typography variant="h5" color="initial">
        {header}
      </Typography>

      <Paper
        sx={{
          marginBottom: 0,
          backgroundColor: "gray",
          padding: 1,
          height: "100%",
        }}
        elevation={0}
      >
        <List ref={dataList} sx={{ height: "100%" }}>
          {data.map((e, index) => (
            <Box my={index === 0 ? 0 : 2} key={e.id}>
              <TicketCard title={e.label} />
            </Box>
          ))}
        </List>
      </Paper>
    </Paper>
  );
}
