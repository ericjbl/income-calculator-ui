type ItemRole = { 
    id: number
    ItemRole: string 
}

type UserRole = {
    roleId: number
    role: string
    description: string
    active: boolean
}

type User = {
    userId: number
    username: string
    firstName: string
    lastName: string
    email: string
    password: string
    HasLoggedIn: boolean
    LastLoggedInDate: Date
    createdAt: Date
    Role: UserRole
    role_id: number
    Reports: Report[]
    active: boolean
}

type Login = {
    username: string
    password: string
}

type PasswordReset = {
    oldPassword: string
    newPassword: string
}

type Item = { 
    id: number
    roleId: number
    Item: string
    Role: ItemRole
    ProofId: string
    ReportId: number
    ItemUID: string
    delete: boolean
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
    Delete: boolean
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
    delete: boolean
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
    lastName: string
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
    userId: string
    updateby: string
    User: User
    UpdatedBy: User
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
    Login,
    PasswordReset,
    User,
    UserRole,
}