const API = process.env.NEXT_PUBLIC_API_URI
const GET_CALCULATION_TYPES_ENDPOINT = `${API}/calculationTypes`

export function getCalculationTypes() {
    return fetch(GET_CALCULATION_TYPES_ENDPOINT, {
        method:'GET'
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}