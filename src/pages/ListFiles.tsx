import { CloudUploadRounded, CancelRounded, DeleteRounded } from "@mui/icons-material";
import AddIconRounded from '@mui/icons-material/Add';
import { Button, IconButton, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { Container } from "@mui/system";
import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useRef, useState } from "react";
import { Files, ShortFiles } from "../models/IFiles";

const ListFiles = () => {
    const inputFile = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File>();
    const [fileKey, setFileKey] = useState<string>();
    const [filenames, setFilenames] = useState<Array<ShortFiles>>();

    const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event) {
            if (event.target.files !== null) {
                var file = event.target.files[0];
                setFile(file)
                setFileKey(file.name);
            }
        }
    }

    useEffect(() => {
        fetchFilenames();
    }, []);

    const fetchFilenames = () => {
        axios.get<Array<ShortFiles>>('http://localhost:8080/findAllFilesShort').then(response => {
            if (response.data !== null && response.data !== undefined && response.data.length > 0)
                setFilenames(response.data)
        });
    }

    const saveFile = () => {
        var formData: any = new FormData();
        formData.append('file', file);

        var config: AxiosRequestConfig = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        axios.post<Files>('http://localhost:8080/saveFile', formData, config).then(response => {
            if (response.data !== null && response.data !== undefined) {
                console.log(response.data.id)
                setFile(undefined);
                setFileKey('');
                fetchFilenames();
            }
        });
    }

    const deleteFile = (id: string) => {
        axios.delete<boolean>('http://localhost:8080/deleteFile', { params: { 'id': id } }).then(response => {
            console.log(response.data)
            fetchFilenames();
        })
    }


    const modifiedFilename = () => {
        if (file) {
            var filename = file.name;
            filename = filename.substring(0, 20);
            filename = file.name.length > filename.length ? filename + '...' : filename;
            return filename;
        }
        return ''
    }
    return (
        <Container>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell sx={{ width: '65%', fontWeight: 'bold', }}>
                            <Typography variant="h4" >
                                List of Files
                            </Typography>
                        </TableCell>
                        <TableCell sx={{ width: '35%' }}>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{ padding: '0', margin: '0', borderBottom: "none" }}>
                                            <Button startIcon={<AddIconRounded />} variant='contained' onClick={e => inputFile.current?.click()}>
                                                <input type='file' id='file' ref={inputFile} style={{ display: 'none' }}
                                                    onChange={e => selectFile(e)} key={fileKey} />Add File
                                            </Button>
                                        </TableCell>
                                        <TableCell sx={{ width: '20%', padding: '0', margin: '0', minWidth: '20ch', display: file ? 'content' : 'none', borderBottom: "none", }}>
                                            {modifiedFilename()}
                                        </TableCell>
                                        <TableCell sx={{ display: file ? 'content' : 'none', padding: '0', margin: '0', borderBottom: "none", }}>
                                            <IconButton onClick={() => { setFile(undefined); setFileKey(''); }}>
                                                <CancelRounded />
                                            </IconButton>
                                            <Button startIcon={<CloudUploadRounded />}
                                                variant='contained'
                                                onClick={(e) => { saveFile() }}>
                                                Upload
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <Table>
                <TableBody>
                    {
                        filenames?.map((filename, index) => {
                            return (<TableRow key={filename.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell id={filename.id}>{filename.document.documentName}</TableCell>
                                <TableCell>{filename.document.extension}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => deleteFile(filename.id)}>
                                        <DeleteRounded />
                                    </IconButton></TableCell>
                            </TableRow>
                            )
                        })}
                </TableBody>
            </Table>

        </Container>
    )
}
export default ListFiles;