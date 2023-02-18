type ItemRole = { 
    id: number
    ItemRole: string 
}

type Item = { 
    id: number
    roleId: number
    Item: string
    Role: ItemRole
    ProofId: string
    ReportId: number
}

type ProofStatus = {
     id: number
     status: string 
}

type ProofType = { 
    id: number
    ProofType: string 
}

type Proof =  { 
    id: number
    Status: ProofStatus
    Type: ProofType
    ItemProof: ItemProof[]
    total: number
    StatusId: number
    TypeId: number
    ReportId: number
}

type ItemProof = {
    id?: number
    proof: number
    StartDate: string
    EndDate: string
    Item: Item
    total: number
    ProofId: number
    ItemId: number
}

type CalculationType = {
    id: number
    CalculationType: string
}

type ReportStatus = {
    id: number
    ReportStatus: string
}

type Report = {
    id: number
    name: string
    ReportDate: string
    EligibilityStartDate: string
    EligibilityEndDate: string
    TypeId: number
    Type: CalculationType
    reportStatusId: number
    Status: ReportStatus
    Proof: Proof[]
    Item: Item[]
    total: number
    result: string
    percentage: number
}

export type {
    Proof,
    ProofStatus,
    ProofType,
    Item,
    ItemRole,
    Report,
    CalculationType,
    ItemProof,
    ReportStatus,
}