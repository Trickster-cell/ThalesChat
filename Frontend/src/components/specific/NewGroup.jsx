import { useInputValidation } from "6pp";
import {
  CameraAlt as CameraAltIcon,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { setIsNewGroup } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const NewGroup = () => {
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const groupName = useInputValidation("");

  const [selectedMembers, setSelectedMembers] = useState([]);

  const errors = [
    {
      isError,
      error,
    },
  ];

  useErrors(errors);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");

    if (selectedMembers.length < 2)
      return toast.error("Please Select Atleast 3 Members");

    newGroup("Creating New Group...", {
      name: groupName.value,
      members: selectedMembers,
    });

    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input's click event
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      if (file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const json = JSON.parse(e.target.result); // Parse the JSON content
            // console.log("File content:", json); // Log the parsed JSON object
            localStorage.setItem("pvt_key", json);
            toast.success("Private Key updated successfully");
            // dispatch(setIsNewGroup(false));
          } catch (error) {
            console.error("Invalid JSON file", error); // Handle parse errors
          }
        };
        reader.readAsText(file); // Read the file as text
      } else {
        console.error("Invalid file type. Please select a JSON file.");
        event.target.value = ""; // Clear the file input
      }
    }
  };
  const isPrivateKeyPresent = localStorage.getItem("pvt_key");

  const handleDownload = () => {
    // console.log();
    const keyData = localStorage.getItem("pvt_key"); // Retrieve the data from localStorage
    const blob = new Blob([keyData], { type: "application/json" }); // Create a Blob with the data
    const url = URL.createObjectURL(blob); // Generate a download URL
    const a = document.createElement("a"); // Create an anchor element
    a.href = url;
    a.download = `private_key.json`; // File name
    document.body.appendChild(a); // Append the anchor to the document
    a.click(); // Trigger the download
    document.body.removeChild(a); // Clean up by removing the anchor
    URL.revokeObjectURL(url); // Revoke the URL
  };

  return (
    <Dialog onClose={closeHandler} open={isNewGroup}>
      <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant="h4">
          Account Settings
        </DialogTitle>

        {/* <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
        /> */}

        <Paper
          elevation={3} // Adds a shadow for a card-like effect
          sx={{
            padding: 2,
            borderRadius: 2,
            backgroundColor: isPrivateKeyPresent ? "#e8f5e9" : "#ffebee", // Green for present, red for not found
          }}
        >
          <Stack
            direction={"row"}
            justifyContent={"space-evenly"}
            alignItems={"center"}
            spacing={2} // Adds spacing between elements
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                color: isPrivateKeyPresent ? "#2e7d32" : "#c62828", // Dark green or red text
              }}
            >
              {isPrivateKeyPresent
                ? "Private Key Present"
                : "Private Key Not Found"}
              {isPrivateKeyPresent && (
                <IconButton
                  sx={{
                    position: "absolute",
                    // bottom: "0",
                    right: "2px",
                    color: "white",
                    bgcolor: "rgba(0,0,0,0.5)",
                    ":hover": {
                      bgcolor: "rgba(0,0,0,0.7)",
                    },
                  }}
                  onClick={handleDownload}
                  component="label"
                >
                  <>
                    <FileDownloadIcon />
                  </>
                </IconButton>
              )}
            </Typography>
          </Stack>
        </Paper>

        {/* <Stack>
          {isLoading ? (
            <Skeleton />
          ) : (
            data?.friends?.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          )}
        </Stack> */}

        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button
            variant="text"
            color="error"
            size="large"
            onClick={closeHandler}
          >
            Cancel
          </Button>
          <IconButton>
            <Button
              variant="contained"
              size="large"
              onClick={handleButtonClick} // Open the file input on button click
              disabled={isLoadingNewGroup}
            >
              Change
            </Button>
            <input
              type="file"
              ref={fileInputRef} // Attach the ref to the input
              style={{ display: "none" }} // Hide the input
              onChange={handleFileSelect}
              accept=".json"
            />
          </IconButton>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
