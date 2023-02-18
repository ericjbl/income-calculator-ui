import { Item, ItemProof, Proof, Report } from "utils/types"

const API = process.env.NEXT_PUBLIC_API_URI
const GET_ALL_REPORTS_ENDPOINT = `${API}/report`
const GET_CALCULATION_TYPES_ENDPOINT = `${API}/calculationTypes`
const GET_REPORT_STATUS_ENDPOINT = `${API}/reportStatus`
const GET_ITEM_ROLES_ENDPOINT = `${API}/itemRoles/`
const GET_PROOF_TYPES_ENDPOINT = `${API}/proofTypes`
const GET_PROOF_STATUS_ENDPOINT = `${API}/proofStatus`
const GET_REPORT_BY_ID = `${API}/report`
const GET_POVERTY_GUIDELINES_ENDPOINT = `${API}/guideline`
const POST_REPORT_ENDPOINT = `${API}/report/add`
const POST_ITEM_ENDPOINT = `${API}/items/add`
const POST_PROOF_ENDPOINT = `${API}/proof/add`
const POST_ITEM_PROOF_ENDPOINT = `${API}/itemproof/add`

export function getCalculationTypes() {
    return fetch(GET_CALCULATION_TYPES_ENDPOINT, {
        method:'GET'
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export function getReportStatus() {
    return fetch(GET_REPORT_STATUS_ENDPOINT, {
        method:'GET'
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export function getReports() {
    return fetch(GET_ALL_REPORTS_ENDPOINT, {
        method:'GET'
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export function getProofTypes() {
    return fetch(GET_PROOF_TYPES_ENDPOINT, {
        method:'GET'
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export function getProofStatus() {
    return fetch(GET_PROOF_STATUS_ENDPOINT, {
        method:'GET'
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export function getItemRoles() {
    return fetch(GET_ITEM_ROLES_ENDPOINT, {
        method:'GET'
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export function getReportByID(reportId: string) {
    return fetch(`${GET_REPORT_BY_ID}/${reportId}`, {
        method:'GET'
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export function getPovertyGuidelines(householdSize: number) {
    return fetch(`${GET_POVERTY_GUIDELINES_ENDPOINT}/${householdSize}`, {
        method:'GET'
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export function addReport(request: Report) {
    return fetch(POST_REPORT_ENDPOINT, {
        method:'POST',
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(request)
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export function addReportMember(request: Item) {
    return fetch(POST_ITEM_ENDPOINT, {
        method:'POST',
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(request)
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export function addReportProof(request: Proof) {
    return fetch(POST_PROOF_ENDPOINT, {
        method:'POST',
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(request)
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export function addReportItemProof(request: ItemProof) {
    return fetch(POST_ITEM_PROOF_ENDPOINT, {
        method:'POST',
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(request)
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}