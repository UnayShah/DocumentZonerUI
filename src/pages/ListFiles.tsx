import { CloudUploadRounded, CancelRounded } from "@mui/icons-material";
import AddIconRounded from '@mui/icons-material/Add';
import { Button, IconButton, Table, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import axios from "axios";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { ShortFiles } from "../models/IFiles";

const ListFiles = () => {
    const inputFile = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File>();
    const [filenames, setFilenames] = useState<Array<ShortFiles>>();
    useEffect(() => {
        fetchFilenames();
    }, []);

    const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event) {
            if (event.target.files !== null) {
                var file = event.target.files[0];
                // console.log(file);
                setFile(file)
                console.log(file.name)
            }
        }
    }

    const fetchFilenames = () => {
        axios.get<Array<ShortFiles>>('http://localhost:8080/findAllFilesShort').then(response => {
            if (response.data !== null && response.data !== undefined && response.data.length > 0)
                setFilenames(response.data)
            console.log(filenames)
        });
    }

    const modifiedFilename = () => {
        if (file) {
            var filename = file.name;
            filename = filename.substring(0, 10);
            filename = file.name.length > filename.length ? filename + '...' : filename;
            return filename;
        }
        return ''
    }
    return (
        <div>
            <Table>
                <TableRow>
                    <TableCell sx={{ width: '65%', fontWeight: 'bold', }}>
                        <Typography variant="h4" >
                            List of Files
                        </Typography>
                    </TableCell>
                    <TableCell sx={{ width: '35%' }}>
                        <TableRow>
                            <TableCell sx={{ padding: '0', margin: '0', borderBottom: "none" }}>
                                <Button startIcon={<AddIconRounded />} variant='contained' onClick={e => inputFile.current?.click()}>
                                    <input type='file' id='file' ref={inputFile} style={{ display: 'none' }}
                                        onChange={e => selectFile(e)} />Add File
                                </Button>
                            </TableCell>
                            <TableCell sx={{ width: '40%', padding: '0', margin: '0', minWidth: '15ch', display: file ? 'content' : 'none', borderBottom: "none" }}>
                                {modifiedFilename()}
                            </TableCell>
                            <TableCell sx={{ display: file ? 'content' : 'none', padding: '0', margin: '0', borderBottom: "none" }}>
                                <IconButton onClick={() => setFile(undefined)}>
                                    <CancelRounded />
                                </IconButton>
                                <Button startIcon={<CloudUploadRounded />}
                                    variant='contained'>
                                    Upload
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableCell>
                </TableRow>
            </Table>
            <Table>

                {
                    filenames?.map((filename, index) => {
                        return (<TableRow>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell id={filename.id}>{filename.document.documentName}</TableCell>
                            <TableCell>{filename.document.extension}</TableCell>
                        </TableRow>
                        )
                    })}
            </Table>

        </div>
    )
}
export default ListFiles;