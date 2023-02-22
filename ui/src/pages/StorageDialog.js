import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function StorageDialog(props) {

    const { open, filePath, handleDialogClick, onInputChange, handleUploadObject } = props;
    //   const [open, setOpen] = React.useState(false);

    //   const handleClickOpen = () => {
    //     setOpen(true);
    //   };

    //   const handleClose = () => {
    //     setOpen(false);
    //   };

    return (
        <div>
            <Dialog open={open}>
                <DialogTitle>Select the File To Upload</DialogTitle>
                <DialogContent>
                    <TextField id="standard-basic" variant="standard" value={filePath.name}/>
                    <Button variant="contained" component="label">
                        Select
                        <input hidden  type="file" onChange={e => onInputChange(e)} />
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClick}>Cancel</Button>
                    <Button onClick={() => handleUploadObject()}>Upload</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}