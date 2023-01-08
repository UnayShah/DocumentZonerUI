import { CancelRounded, DoneRounded } from "@mui/icons-material"
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material"
import { Key, useEffect } from "react"
import { IRectangle } from "../models/IShapes"

interface Props {
    title?: string,
    rectangle?: IRectangle,
    setFieldTitle?: any,
    index?: number,
    id: string,
    key: Key,
}
const RectDetails = (props: Props) => {

    useEffect(() => {
        if (props.rectangle && props.title) {
            if (props.rectangle.width < 0) {
                props.rectangle.x = props.rectangle.x + props.rectangle.width;
                props.rectangle.width = -props.rectangle.width
            }
            if (props.rectangle.height < 0) {
                props.rectangle.y = props.rectangle.y + props.rectangle.height;
                props.rectangle.height = -props.rectangle.height
            }
        }
    }, [])
    return (
        props.rectangle && props.title ?
            <Table>
                <TableHead sx={{ borderBottom: '2px solid gray' }}>
                    <TableRow>
                        <TableCell colSpan={2}>
                            {props.title}
                            {/* <div onDoubleClick={}> */}

                            <TextField
                                value={props.title}
                                onChange={e => props.setFieldTitle(props.index, props.id, e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <div className="flex flex-row">
                                            <IconButton onClick={e => {
                                                console.log('cancel')
                                                props.setFieldTitle(props.index, props.id, ' ')
                                            }}><CancelRounded /></IconButton>
                                            {/* <IconButton onClick={props.setFieldTitle(props.id, '')}><DoneRounded /></IconButton> */}
                                        </div>
                                    )
                                }} />
                            {/* </div> */}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>x</TableCell>
                        <TableCell>{props.rectangle.x.toFixed()}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>y</TableCell>
                        <TableCell>{props.rectangle.y.toFixed()}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>width</TableCell>
                        <TableCell>{props.rectangle.width.toFixed()}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>height</TableCell>
                        <TableCell>{props.rectangle.height.toFixed()}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            :
            <Table sx={{ color: 'transparent', userSelect: 'none', visibility: 'hidden' }}>
                <TableHead>{props.title}</TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>x</TableCell>
                        <TableCell>{1000}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>y</TableCell>
                        <TableCell>{1000}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>width</TableCell>
                        <TableCell>{1000}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>height</TableCell>
                        <TableCell>{1000}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
    )
}

export default RectDetails; 