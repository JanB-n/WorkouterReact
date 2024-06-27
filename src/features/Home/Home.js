import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal, Box, TextField } from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [exercises, setExercises] = useState([{ id: 1, data: [{}] }]);
  const [adminExercises, setAdminExercises] = useState([{ id: 1, data: [{}] }]);
  const [open, setOpen] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const { axiosPrivate } = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    getExercises();
    getAdminExercises();
  }, []);

  const getExercises = async () => {
    try {
      const response = await axiosPrivate.get("/exercise", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const userExercises = response.data?.map((row) => ({
        id: row.id,
        name: row.name,
        isUserExercise: true,
      }));
      console.log(userExercises)
      setExercises(userExercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const getAdminExercises = async () => {
    try {
      const response = await axiosPrivate.get("/adminexercise", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const adminExercises = response.data?.map((row) => ({
        id: row.id,
        name: row.name,
      }));
      setAdminExercises(adminExercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const addExercise = async () => {
    if (exerciseName.length > 0) {
      try {
        await axiosPrivate.post(
          "/exercise",
          {
            name: exerciseName,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        getExercises();
        getAdminExercises();
        setOpen(false);
        setExerciseName("");
      } catch (error) {
        console.error("Error adding exercise:", error);
      }
    }
  };

  const removeExercise = async (id) => {
    try{
    const response = await axiosPrivate
      .delete(`/exercise/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        getExercises();
        getAdminExercises();
      });
    }
    catch(err){
      console.log(err);
    }
  };

  const handleRowClick= (params) => {
    navigate(`/` + params.row.name, { state: { id: params.row.id, name: params.row.name } });
  }

  const columns = [
    { field: "name", headerName: "Exercise Name", flex: 1 },
    {
      field: "action",
      headerName: "",
      flex: 1,
      renderCell: (params) =>
        params.row.isUserExercise ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={(e) => {e.stopPropagation(); removeExercise(params.row.id)}}
          >
            Remove
          </Button>
        ) : null,
    },
  ];
  const columns2 = [{ field: "name", headerName: "Exercise Name", flex: 1 }];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <Button
        variant="contained"
        color="primary"
        style={{ margin: 5 }}
        onClick={() => setOpen(true)}
      >
        Add Exercise
      </Button>
      <h2>My exercises</h2>
      <DataGrid
        getRowId={(row) => row.id}
        rows={exercises}
        columns={columns}
        localeText={{ noRowsLabel: "" }}
        sx={{
          "& .MuiDataGrid-columnHeaderTitleContainerContent": {
            overflow: "initial",
          },
          "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
          "& .MuiDataGrid-row:hover": {
            cursor: "pointer",
          },
        }}
        pageSizeOptions={[10]}
        onRowClick={handleRowClick}
      />
      <h2>Recommended exercises</h2>
      <DataGrid
        getRowId={(row) => row.id}
        rows={adminExercises}
        columns={columns2}
        localeText={{ noRowsLabel: "" }}
        sx={{
          "& .MuiDataGrid-columnHeaderTitleContainerContent": {
            overflow: "initial",
          },
          "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
          "& .MuiDataGrid-row:hover": {
            cursor: "pointer",
          },
        }}
        pageSizeOptions={[10]}
        onRowClick={handleRowClick}
      />
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Exercise name</h2>
          <TextField
            fullWidth
            variant="outlined"
            label="Exercise Name"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
          />
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={addExercise}>
              Create
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpen(false)}
              style={{ marginLeft: "10px" }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
