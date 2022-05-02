import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Input from "../Input/Input";
import Modal from "../Modal/Modal";
import "./Card.css";

export default function ListingCard(props: any) {
  const [value, setValue] = useState<string>("");
  const [open, setOpen] = useState(false);
  const {
    image,
    name,
    address,
    status,
    btn,
    btn1,
    btn2,
    btn3,
    btn4,
    btn5,
    btn6,
    item,
    index,
    createAuction,
  } = props;
  const {data}=props;

  return (
    <Card className="mt-4" sx={{ maxWidth: 345 }}>
      {image && (
        <CardMedia
          component="img"
          height="280"
          image={image}
          alt="green iguana"
          className="card-image"
        />
      )}
      <CardContent>
        {name && (
          <>
            <Typography gutterBottom variant="h5" component="div">
              name
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {props.name}
            </Typography>
          </>
        )}

        {address && (
          <>
            <Typography gutterBottom variant="h5" component="div">
              Address
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {address.slice(0, 10) + "...."}
            </Typography>
          </>
        )}

        <Typography gutterBottom variant="h5" component="div">
          Status
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {status}
        </Typography>
     
        {
          btn &&
        <Button
          className="mt-3"
          variant="contained"
          onClick={() => {
            if (value === "" && props.btn === "Create Auction") {
              setOpen(true)
              return "";
            }

            props.handler(props.item, props.id, value);
          }}
        >
          {props.btn}
        </Button>
        }
        {btn2 && (
          <Button
            className="mt-3 card-btn "
            variant="contained"
            onClick={() => {
              props.btn2Handler(item, index);
            }}
          >
            {btn2}
          </Button>
        )}
        {btn3 && (
          <Button
            className="mt-3 card-btn"
            variant="contained"
            onClick={() => {
              props.btn3Handler(item, index);
            }}
          >
            {btn3}
          </Button>
        )}
        {btn4 && (
          <Button
            className="mt-3 card-btn"
            variant="contained"
            onClick={() => {
              props.btn4Handler(item, index);
            }}
          >
            {btn4}
          </Button>
        )}
        {btn5 && (
          <Button
            className="mt-3 card-btn"
            variant="contained"
            onClick={() => {
              props.btn5Handler(item, index);
            }}
          >
            {btn5}
          </Button>
        )}
        {btn6 && (
          <Button
            className="mt-3 card-btn"
            variant="contained"
            onClick={() => {
              props.btn6Handler(item, index);
            }}
          >
            {btn6}
          </Button>
        )}
        {createAuction && (
          <Modal
            handleClose={() => setOpen(false)}
            open={open}
            handler={(auctionConfig: any) =>
              props.handler(props.item, props.id, auctionConfig)
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
