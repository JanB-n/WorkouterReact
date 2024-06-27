import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal, Box, TextField } from "@mui/material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function Exercise() {
  const location = useLocation();
  const { id, name } = location.state || {};
  const { axiosPrivate } = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {}, []);

  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [repsAndWeight, setRepsAndWeight] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getPreviousSessions();
  }, []);

  const addSet = () => {
    setRepsAndWeight([...repsAndWeight, { reps, weight }]);
  };

  const completeExercise = async () => {
    try {
      const response = await axiosPrivate.post(
        "/" + id + "/training",
        JSON.stringify(repsAndWeight),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      getPreviousSessions();
      setRepsAndWeight([]);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
    setReps("");
    setWeight("");
  };

  const getPreviousSessions = async () => {
    try {
      const response = await axiosPrivate.get("/" + id + "/trainings", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      var previousExercises = response.data;
      previousExercises.sort((a, b) => b.idTraining - a.idTraining);
      setHistory(previousExercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  if (!location) {
    return <div>Error: Exercise data not found.</div>;
  }

  return (
    <Container>
      <h2>{name}</h2>
      <Paper elevation={3} style={{ padding: 16, marginBottom: 16 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addSet();
          }}
        >
          <TextField
            label="Reps"
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Weight (kg)"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">
            Add Set
          </Button>
        </form>
      </Paper>
      <SetTable sets={repsAndWeight} />
      <Button
        style={{ margin: 5 }}
        variant="contained"
        color="secondary"
        onClick={completeExercise}
      >
        Save Sets
      </Button>

      <h2>History</h2>
      <History history={history} getPreviousSessions={getPreviousSessions} />
    </Container>
  );
}

function SetTable({ sets }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Reps</TableCell>
          <TableCell>Weight (kg)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sets.map((set, index) => (
          <TableRow key={index}>
            <TableCell>{set.reps}</TableCell>
            <TableCell>{set.weight}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function History({ history, getPreviousSessions }) {
    const { axiosPrivate } = useAxiosPrivate();
    const handleDelete = async (idTraining) => {
        try{
        const response = await axiosPrivate
        .delete(`/training/${idTraining}`, {
            headers: {
            "Content-Type": "application/json",
            },
        })
        .then(() => {
        getPreviousSessions();
      });
    }
    catch(err){
        console.log(err);
    }
      };
  return (
    <>
      {history.map((session, index) => (
        <div key={index}>
          <h2>{session.date}
          <Button style={{marginLeft: 10}} variant="contained" color="error" onClick={() => handleDelete(session.idTraining)}>
              Delete
            </Button>
          </h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reps</TableCell>
                <TableCell>Weight (kg)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {session.data.map((set, i) => (
                <TableRow key={i}>
                  <TableCell>{set.reps}</TableCell>
                  <TableCell>{set.weight}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </>
  );
}
