import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Stack from "@mui/material/Stack";
import "./Modal.css";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,

  bgcolor: "background.paper",

  boxShadow: 24,
  p: 4,
};

export default function BasicModal(props:any) {

  const [auctionConfig,setAuctionConfig]=React.useState<any>({
    name:"",
    startDate:new Date(),
    endDate:new Date(),
    ceilPrice:"",
    floorPrice:"",
    endAuctionGap:""
  })
  const modalOnchange=(value:any,name:any)=>{
    setAuctionConfig({ ...auctionConfig, [name]: value });
   }
  const Item = styled(Paper)(({ theme }) => ({
    // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const {handleClose,open,handler}=props
  return (
    <div>
     
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography className="text-center" id="modal-modal-title" variant="h4" component="h2">
            Additional Info
          </Typography>
          <Grid container className="mt-2" spacing={2}>
            <Grid item xs={6}>
              <TextField
                id="standard-basic"
                className="w-100"
                label="Auction Name"
                variant="standard"
                type="text"
                name="name"
                required={true}
                value={auctionConfig.name}
                onChange={(e:any)=>modalOnchange(e.target.value,e.target.name)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="standard-basic"
                className="w-100"
                label="Ceil price"
                variant="standard"
                type="number"
                name="ceilPrice"
                required={true}
                value={auctionConfig.ceilPrice}
                onChange={(e:any)=>modalOnchange(e.target.value,e.target.name)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="standard-basic"
                className="w-100"
                label="Floor price"
                variant="standard"
                type="number"
                name="floorPrice"
                required={true}
                value={auctionConfig.floorPrice}
                 onChange={(e:any)=>modalOnchange(e.target.value,e.target.name)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="standard-basic"
                className="w-100"
                label="End Auction Gap"
                variant="standard"
                type="text"
                name="endAuctionGap"
                required={true}
                value={auctionConfig.endAuctionGap}
                 onChange={(e:any)=>modalOnchange(e.target.value,e.target.name)}
              />
            </Grid>
            <Grid item xs={6} className="mt-4">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={3}>
                  <DesktopDatePicker
                    label="Start Date"
                    
                    value={auctionConfig.startDate}
                    minDate={new Date("2017-01-01")}
                    onChange={(newValue: any) => {
                      modalOnchange(newValue,"startDate");
                    }}
                    renderInput={(params: any) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6} className="mt-4">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={3}>
                  <DesktopDatePicker
                    label="End Date"
                    value={auctionConfig.endDate}
                    
                    minDate={new Date("2017-01-01")}
                    onChange={(newValue: any) => {
                        modalOnchange(newValue,"endDate");
                    }}
                    renderInput={(params: any) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Typography className="mt-5" align='center'>
          <Button onClick={()=>{
            handler(auctionConfig);
            handleClose();
            }} className=" text-center" variant="contained">Save</Button>
          </Typography>
 
        </Box>
      </Modal>
    </div>
  );
}
