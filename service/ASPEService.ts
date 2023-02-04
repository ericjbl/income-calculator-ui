const API = process.env.NEXT_PUBLIC_ASPE_API_URI
const GET_POVERTY_GUIDELINES_ENDPOINT = `${API}/${new Date().getFullYear()}/us`

export function getPovertyGuidelines(householdSize: number) {
    return fetch(`${GET_POVERTY_GUIDELINES_ENDPOINT}/${householdSize}`, {
        method:'GET'
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}
