type ItemRole = { 
    id: number
    ItemRole: string 
}

type Item = { 
    id: number
    Item: string
    Role: ItemRole
    ProofId: number
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
}

type ItemProof = {
    id: number
    proof: number
    StartDate: string
    EndDate: string
    Item: Item
    total: number
}

type CalculationType = {
    id: number
    CalculationType: string
}

type Report = {
    name: string
    ReportDate: string
    EligibilityStartDate: string
    EligibilityEndDate: string
    Type: CalculationType
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
}