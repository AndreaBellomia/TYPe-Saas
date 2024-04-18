import React from "react";
import { Paper, Typography, List, Box } from "@mui/material";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

import TicketCard from "@/app/admin/ticket/components/TicketCard";

import { NodeDragEventData, NodeTouchEventData } from "@formkit/drag-and-drop";

import { Ticket } from "@/types";

export interface BoardColumnProps {
  groupName: string;
  name: string;
  header: string;
  columnData: Array<Ticket>;
  handleEnd: (
    data: NodeDragEventData<Ticket> | NodeTouchEventData<Ticket>,
  ) => void;
  handleCard: (id: string | null) => void;
}

export function BoardColumn({
  groupName,
  header,
  name,
  handleEnd,
  columnData,
  handleCard,
}: BoardColumnProps) {
  const [dataList, data, setValues] = useDragAndDrop<HTMLUListElement, Ticket>(
    [],
    {
      group: groupName,
      name: name,
      handleEnd: handleEnd,
      sortable: false,
    },
  );

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
      <Box sx={{ p: 1 }}>
        <Typography variant="h5" color="secondary">
          {header}
        </Typography>
      </Box>

      <List ref={dataList} sx={{ height: "100%" }}>
        {data.map((e, index) => (
          <Box
            my={index === 0 ? 0 : 2}
            key={e.id}
            onClick={() => handleCard(String(e.id))}
          >
            <TicketCard
              title={e.label}
              user={e.assigned_to}
              description={e.description}
            />
          </Box>
        ))}
      </List>
    </Paper>
  );
}

export default BoardColumn;
