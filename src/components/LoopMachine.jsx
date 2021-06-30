import React, { useState, useEffect, useRef } from "react";
import Pad from "./Pad";
import playSegment from "../utils/playSegment";
import { Box, Card, Grid, IconButton } from "@material-ui/core";
import AlbumIcon from "@material-ui/icons/Album";
import FiberManualRecordRoundedIcon from "@material-ui/icons/FiberManualRecordRounded";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import StopRoundedIcon from "@material-ui/icons/StopRounded";

const LoopMachine = () => {
  const [beats] = useState([
    {
      filePath: "beat_samples/120_future_funk_beats_25.mp3",
      caption: "Funk",
    },
    {
      filePath: "beat_samples/120_stutter_breakbeats_16.mp3",
      caption: "Shutter",
    },
    {
      filePath: "beat_samples/Bass Warwick heavy funk groove on E 120 BPM.mp3",
      caption: "Warwick",
    },
    {
      filePath: "beat_samples/electric guitar coutry slide 120bpm - B.mp3",
      caption: "Guitar",
    },
    {
      filePath: "beat_samples/FUD_120_StompySlosh.mp3",
      caption: "Stompy",
    },
    {
      filePath: "beat_samples/GrooveB_120bpm_Tanggu.mp3",
      caption: "Tanggu",
    },
    {
      filePath: "beat_samples/MazePolitics_120_Perc.mp3",
      caption: "Maze",
    },
    {
      filePath: "beat_samples/PAS3GROOVE1.03B.mp3",
      caption: "Groove",
    },
    {
      filePath: "beat_samples/SilentStar_120_Em_OrganSynth.mp3",
      caption: "Star",
    },
  ]);

  const [pads, setPads] = useState(
    beats.map((beat) => {
      return {
        isOn: false,
        caption: beat.caption,
      };
    })
  );

  const [sources] = useState(
    beats.map((beat) => {
      return {
        audio: new Audio(beat.filePath),
      };
    })
  );

  const loopCounterInitalState = 0;
  const [loopCounter, setLoopCounter] = useState(loopCounterInitalState); // Counts completed loops.
  const loopCounterRef = useRef(loopCounterInitalState);
  const [isLoopMachineTurnedOn, setIsLoopMachineTurnedOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [recording, setRecording] = useState([]); // Array that each index is a loop. Each loop is an array that each index contains an object with start (true or false) and end (time, null or false) of each beat.
  const [machineLoopInterval, setMachineLoopInterval] = useState();

  useEffect(() => {
    loopCounterRef.current = loopCounter;
  });

  const turnMachineOn = () => {
    // starts the machine
    setLoopCounter(0);
    setRecording([]);
    startLoop();
    let machineLoopSetInterval = setInterval(() => {
      startLoop();
      setLoopCounter(loopCounterRef.current + 1);
    }, 8000);
    setMachineLoopInterval(machineLoopSetInterval);
  };

  const startLoop = () => {
    // initiate each loop
    let loopRecordingArray = [];
    for (let beatIndex = 0; beatIndex < beats.length; beatIndex++) {
      sources[beatIndex].audio.currentTime = 0;
      if (pads[beatIndex].isOn) {
        sources[beatIndex].audio.play();
        if (isRecording) {
          loopRecordingArray[beatIndex] = { start: true, end: null };
        }
      } else {
        if (isRecording) {
          loopRecordingArray[beatIndex] = { start: false, end: false };
        }
      }
    }
    if (isRecording) {
      setRecording((record) => [...record, loopRecordingArray]);
    }
  };

  const turnMachineOff = () => {
    // stops the machine
    clearInterval(machineLoopInterval);
    setMachineLoopInterval();
    let lastRecordingLoopArray = isRecording ? recording[loopCounter] : false;
    for (let beatIndex = 0; beatIndex < beats.length; beatIndex++) {
      if (
        isRecording &&
        lastRecordingLoopArray[beatIndex].start && // check if the beat was playing in the current loop
        !lastRecordingLoopArray[beatIndex].end // check if the beat was paused on the current loop before stopping the machine
      ) {
        lastRecordingLoopArray[beatIndex].end =
          sources[beatIndex].audio.currentTime; // changes the final time for the beat final time
        stopPlayingBeat(beatIndex);
      }
    }
    if (isRecording) {
      let newRecordingArray = recording;
      newRecordingArray[loopCounter] = lastRecordingLoopArray;
      setRecording(newRecordingArray); // sets the beats final time on the last loop
    }
    setLoopCounter(0);
    turnOffAllPads();
  };

  const stopPlayingBeat = (beatIndex) => {
    // stops the beat and reset it
    sources[beatIndex].audio.pause();
    sources[beatIndex].audio.currentTime = 0;
  };

  const changeMachineState = () => {
    // turn off and on the machine
    if (isLoopMachineTurnedOn) {
      setIsLoopMachineTurnedOn(false);
      turnMachineOff();
    } else {
      setIsLoopMachineTurnedOn(true);
      turnMachineOn();
    }
  };

  const changeRecordingState = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
    }
  };

  const changeReplayingState = () => {
    if (isReplaying) {
      setIsReplaying(false);
      stopPlayingRecording();
    } else {
      setIsReplaying(true);
      playRecording();
    }
  };

  const handleChangePadStatus = (padIndex) => {
    let newPadsState = [...pads];
    newPadsState[padIndex].isOn = pads[padIndex].isOn ? false : true;
    if (isLoopMachineTurnedOn && !newPadsState[padIndex].isOn) {
      // only runs this code if the machine is turned on and if the pad was on
      let lastRecordingLoopArray = isRecording ? recording[loopCounter] : false;
      if (
        isRecording &&
        lastRecordingLoopArray[padIndex].start && // check if the beat was playing in the current loop
        !lastRecordingLoopArray[padIndex].end // check if the beat was paused on the current loop, turned on and off the pad on the same loop
      ) {
        lastRecordingLoopArray[padIndex].end =
          sources[padIndex].audio.currentTime;
        stopPlayingBeat(padIndex);
      }
    }
    setPads(newPadsState);
  };

  const turnOffAllPads = () => {
    let newPadsState = [...pads];
    for (let padIndex = 0; padIndex < pads.length; padIndex++) {
      newPadsState[padIndex].isOn = false;
    }
    setPads(newPadsState);
  };

  const playRecording = () => {
    turnOffAllPads();
    setLoopCounter(1);
    playRecordingLoop(0);
  };

  useEffect(() => {
    let replayingLoopSetInterval;
    if (isReplaying) {
      replayingLoopSetInterval = setInterval(() => {
        setLoopCounter(loopCounterRef.current + 1);
        if (loopCounterRef.current < recording.length) {
          playRecordingLoop(loopCounterRef.current);
        } else {
          stopPlayingRecording();
        }
      }, 8000);
    }
    return () => {
      clearInterval(replayingLoopSetInterval);
    };
  }, [isReplaying, loopCounterRef]);

  const playRecordingLoop = (loopIndex) => {
    for (
      let beatIndex = 0;
      beatIndex < recording[loopIndex].length;
      beatIndex++
    ) {
      if (recording[loopIndex][beatIndex].start) {
        if (recording[loopIndex][beatIndex].end) {
          playSegment(
            sources[beatIndex].audio,
            0,
            recording[loopIndex][beatIndex].end
          );
        } else {
          sources[beatIndex].audio.play();
        }
      } else {
        sources[beatIndex].audio.pause();
      }
      sources[beatIndex].audio.currentTime = 0;
    }
  };

  const stopPlayingRecording = () => {
    setIsReplaying(false);
    for (let beatIndex = 0; beatIndex < beats.length; beatIndex++) {
      stopPlayingBeat(beatIndex);
    }
    setLoopCounter(0);
  };

  return (
    <Card style={{ backgroundColor: "lightgray" }}>
      <Box padding="5%">
        {!isReplaying ? (
          <>
            <IconButton
              onClick={() => changeMachineState()}
              variant="contained"
              component="label"
            >
              {isLoopMachineTurnedOn ? (
                <StopRoundedIcon />
              ) : (
                <PlayArrowRoundedIcon />
              )}
            </IconButton>

            <IconButton
              onClick={() => changeRecordingState()}
              variant="contained"
              component="label"
              disabled={isLoopMachineTurnedOn ? true : false}
            >
              <FiberManualRecordRoundedIcon
                color={isRecording ? "secondary" : "disabled"}
              />
            </IconButton>
          </>
        ) : (
          <></>
        )}
        {!isLoopMachineTurnedOn && recording.length ? (
          <IconButton
            onClick={() => changeReplayingState()}
            variant="contained"
            component="label"
          >
            <AlbumIcon color={isReplaying ? "secondary" : "disabled"} />
          </IconButton>
        ) : (
          <></>
        )}
        <Box marginTop={3}>
          <Grid container justify="center" alignItems="center">
            {pads.map((pad, i) => (
              <Pad
                key={i}
                pad={pad}
                changePadStatus={() => handleChangePadStatus(i)}
              />
            ))}
          </Grid>
        </Box>
      </Box>
    </Card>
  );
};

export default LoopMachine;
