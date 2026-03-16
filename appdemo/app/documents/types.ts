// app/(tabs)/documents/types.ts

export interface DocData {
    type: string;
    category: string;
    arrivalDate: string;
    urgency: string;
    department: string;
    creator: string;
    signer: string;
    signerRole: string;
    processingDeadline: string;
    operationType: string;
    language: string;
    pageCount: string;
    note: string;
}

export interface AttachedFile {
    id: string;
    name: string;
    size: number;
    mimeType?: string;
    uri: string;
    status: "uploaded" | "pending" | "error";
}

export interface RelatedDoc {
    id: string;
    docId: string;
    title: string;
    sender: string;
    isUrgent: boolean;
}

export interface Recipient {
    code: string;
    name: string;
    type: "internal" | "external";
}
