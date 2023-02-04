const API = process.env.NEXT_PUBLIC_API_URI
const GET_CALCULATION_TYPES_ENDPOINT = `${API}/calculationTypes`
const GET_REPORT_BY_ID = `${API}/report`

export function getCalculationTypes() {
    return fetch(GET_CALCULATION_TYPES_ENDPOINT, {
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