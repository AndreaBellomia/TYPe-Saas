import React from "react";
import { Paper, Typography, List, Box, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

import TicketCard from "@/app/admin/ticket/components/TicketCard";

import { NodeDragEventData, NodeTouchEventData } from "@formkit/drag-and-drop";

import { Statuses, Ticket } from "@/models/Ticket";
import { StatusesType } from "@/models/Ticket";

export interface BoardColumnProps {
  groupName: string;
  name: Exclude<StatusesType, Statuses.BACKLOG>;
  header: string;
  columnData: Array<Ticket>;
  handleEnd: (data: NodeDragEventData<Ticket> | NodeTouchEventData<Ticket>) => void;
  handleCard: (id: string | null) => void;
  handleCreate: (state: StatusesType) => void;
}

export function BoardColumn({ groupName, header, name, handleEnd, columnData, handleCard, handleCreate }: BoardColumnProps) {
  const [dataList, data, setValues] = useDragAndDrop<HTMLUListElement, Ticket>([], {
    group: groupName,
    name: name,
    handleEnd: handleEnd,
    sortable: false,
  });

  React.useEffect(() => {
    setValues(columnData);
  }, [columnData]);

  return (
    <Paper
      sx={{
        height: "100%",
        padding: 2,
        display: "flex",
        flexDirection: "column",
      }}
      variant="outlined"
    >
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" color="grey.600">
          {header}
        </Typography>
        <IconButton aria-label="" onClick={() => handleCreate(name)}>
          <AddIcon/>
        </IconButton>
      </Box>

      <List ref={dataList} sx={{ height: "100%" }}>
        {data.map((e, index) => (
          <Box my={index === 0 ? 0 : 2} key={e.id} onClick={() => handleCard(String(e.id))}>
            <TicketCard title={e.label} user={e.assigned_to} description={e.description} category={e.type.name} id={String(e.id)} />
          </Box>
        ))}
      </List>
    </Paper>
  );
}

export default BoardColumn;
