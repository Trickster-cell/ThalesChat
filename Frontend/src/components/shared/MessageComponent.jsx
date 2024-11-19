import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import moment from "moment";
import React, { memo } from "react";
import { lightBlue } from "../../constants/color";
import { finalDecrypt } from "../../lib/cryptoModule";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";

const MessageComponent = ({ message, user }) => {
  const {
    sender,
    content,
    enc_content,
    self_content,
    attachments = [],
    createdAt,
  } = message;

  // console.log("11", enc_content);

  const sameSender = sender?._id === user?._id;

  const timeAgo = moment(createdAt).fromNow();

  return (
    <motion.div
      initial={{ opacity: 0, x: "-100%" }}
      whileInView={{ opacity: 1, x: 0 }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: "white",
        color: "black",
        borderRadius: "5px",
        padding: "0.5rem",
        width: "fit-content",
      }}
    >
      {!sameSender && (
        <Typography color={lightBlue} fontWeight={"600"} variant="caption">
          {sender.name}
        </Typography>
      )}

      {/* {content && <Typography>{content}</Typography>} */}
      {self_content && enc_content && (
        <Typography>
          {finalDecrypt(
            sameSender ? JSON.parse(self_content) : JSON.parse(enc_content),
            JSON.parse(localStorage.getItem("pvt_key"))
          )}
        </Typography>
      )}

      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);

          return (
            <Box key={index}>
              <a
                href={url}
                target="_blank"
                download
                style={{
                  color: "black",
                }}
              >
                {RenderAttachment(file, url)}
              </a>
            </Box>
          );
        })}

      <Typography variant="caption" color={"text.secondary"}>
        {timeAgo}
      </Typography>
    </motion.div>
  );
};

export default memo(MessageComponent);
