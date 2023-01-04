import { Document, ShortDocument } from "./IDocument";
import { Zone } from "./IZones";

export interface ShortFiles {
    id: string,
    document: ShortDocument,
    zones: Array<Zone>
}
export interface Files {
    id: string,
    document: Document,
    zones: Array<Zone>
}