import { Item, ItemProof, Proof, Report, Login, PasswordReset, User } from "utils/types"

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
const LOGIN_ENDPOINT = `${API}/auth/login`
const LOGOUT_ENDPOINT = `${API}/auth/logout`
const PASSWORD_RESET_ENDPOINT = `${API}/auth/firstLogInReset`
const PROFILE_ENDPOINT = `${API}/auth/profile`
const REFRESH_TOKEN_ENDPOINT = `${API}/auth/refresh`
const PUT_REPORT_ENDPOINT = `${API}/report/update`
const PUT_MEMBER_ENDPOINT = `${API}/items/update`
const PUT_PROOF_ENDPOINT = `${API}/proof/update`
const PUT_ITEMPROOF_ENDPOINT = `${API}/itemproof/update`
const DELETE_PROOF_ENDPOINT = `${API}/proof/delete`
const DELETE_ITEMPROOF_ENDPOINT = `${API}/itemproof/delete`
const DELETE_MEMBER_ENDPOINT = `${API}/items/delete`
const POST_USER_ENDPOINT = `${API}/user`
const GET_USER_ENDPOINT = `${API}/user`
const GET_USERROLES_ENDPOINT = `${API}/user-role`
const DELETE_USER_ENDPOINT = `${API}/user/deactivate`
const PUT_USERRESET_ENDPOINT = `${API}/user/forgotpassword`


export async function getToken() {
    const { access_token, refresh_token, IsAuthenticated } = JSON.parse(localStorage.getItem('user')!)
    if(IsAuthenticated) {
        const access_token_exp = JSON.parse(window.atob(access_token.split('.')[1])).exp
        const refresh_token_exp = JSON.parse(window.atob(refresh_token.split('.')[1])).exp
        const currentTime = new Date().getTime()/1000
        const timeToRefreshToken = access_token_exp - currentTime
        const refreshTokenTime = refresh_token_exp - currentTime
        console.log(timeToRefreshToken)
        console.log("AccessToken Exp:",access_token_exp)
        console.log(new Date().getTime()/1000)
        console.log("RefreshAccessToken Exp:",refresh_token_exp)
        console.log(refreshTokenTime)
        if(timeToRefreshToken <= 0 && refreshTokenTime > 0) {
            const newToken = await refreshToken(refresh_token)
            localStorage.removeItem('user');
            newToken.IsAuthenticated = true;
            if (newToken.statusCode !== 403) {
                localStorage.setItem('user', JSON.stringify(newToken));
            }
            else {
                localStorage.removeItem('user');
                // localStorage.setItem('user', JSON.stringify({IsAuthenticated: false}));
            }
        }
        else if(refreshTokenTime <= 0) {
            localStorage.removeItem('user');
            // localStorage.setItem('user', JSON.stringify({IsAuthenticated: false}));
        } 
    }
 
}

export function refreshToken(token: string) {
    return fetch(REFRESH_TOKEN_ENDPOINT,{
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))

}

export function profile(request: Login) {
    return fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(request)
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export function login(request: Login) {
    return fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(request)
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function logOut() {
    return fetch(LOGOUT_ENDPOINT, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem('user')!).access_token}`,
            "Content-Type": "application/json;charset=UTF-8",
        },
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function passwordReset(request: PasswordReset) {
    return fetch(PASSWORD_RESET_ENDPOINT, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem('user')!).access_token}`,
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(request)
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function getCalculationTypes() {
    return fetch(GET_CALCULATION_TYPES_ENDPOINT, {
        headers:{
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem('user')!).access_token}`,
        },
        method:'GET'
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function getReportStatus() {
    return fetch(GET_REPORT_STATUS_ENDPOINT, {
        headers:{
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem('user')!).access_token}`,
        },
        method:'GET'
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function getReports(user: { access_token: string}) {
    return fetch(GET_ALL_REPORTS_ENDPOINT, {
        headers:{
            "Authorization": `Bearer ${user.access_token}`,
        },
        method:'GET'
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function getProofTypes() {
    return fetch(GET_PROOF_TYPES_ENDPOINT, {
        headers:{
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem('user')!).access_token}`,
        },
        method:'GET'
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function getProofStatus() {
    return fetch(GET_PROOF_STATUS_ENDPOINT, {
        headers:{
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem('user')!).access_token}`,
        },
        method:'GET'
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function getItemRoles() {
    return fetch(GET_ITEM_ROLES_ENDPOINT, {
        headers:{
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem('user')!).access_token}`,
        },
        method:'GET'
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function getReportByID(user: { access_token: string},reportId: string) {
    return fetch(`${GET_REPORT_BY_ID}/${reportId}`, {
        headers:{
            "Authorization": `Bearer ${user.access_token}`,
        },
        method:'GET'
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function getPovertyGuidelines(householdSize: number) {
    return fetch(`${GET_POVERTY_GUIDELINES_ENDPOINT}/${householdSize}`, {
        headers:{
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem('user')!).access_token}`,
        },
        method:'GET'
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function addReport(request: Report) {
    return fetch(POST_REPORT_ENDPOINT, {
        method:'POST',
        headers: {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem('user')!).access_token}`,
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(request)
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function addReportMember(request: Item) {
    return fetch(POST_ITEM_ENDPOINT, {
        method:'POST',
        headers: {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem('user')!).access_token}`,
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(request)
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function addReportProof(request: Proof) {
    return fetch(POST_PROOF_ENDPOINT, {
        method:'POST',
        headers: {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem('user')!).access_token}`,
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(request)
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function addReportItemProof(request: ItemProof) {
    return fetch(POST_ITEM_PROOF_ENDPOINT, {
        method:'POST',
        headers: {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem('user')!).access_token}`,
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(request)
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function updateReport(request: Report, reportId: number, user: { access_token: string}) {
    return fetch(`${PUT_REPORT_ENDPOINT}/${reportId}`, {
        method:'PUT',
        headers: {
            "Authorization": `Bearer ${user.access_token}`,
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(request)
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function updateMember(request: Item, id: number, user: { access_token: string}) {
    return fetch(`${PUT_MEMBER_ENDPOINT}/${id}`, {
        method:'PUT',
        headers: {
            "Authorization": `Bearer ${user.access_token}`,
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(request)
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function updateReportProof(request: Proof, id: number, user: { access_token: string}) {
    return fetch(`${PUT_PROOF_ENDPOINT}/${id}`, {
        method:'PUT',
        headers: {
            "Authorization": `Bearer ${user.access_token}`,
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(request)
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function updateReportItemProof(request: ItemProof, id: number, user: { access_token: string}) {
    return fetch(`${PUT_ITEMPROOF_ENDPOINT}/${id}`, {
        method:'PUT',
        headers: {
            "Authorization": `Bearer ${user.access_token}`,
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(request)
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function deleteProof(id: number, user: { access_token: string}) {
    return fetch(`${DELETE_PROOF_ENDPOINT}/${id}`, {
        method:'PUT',
        headers: {
            "Authorization": `Bearer ${user.access_token}`,
            "Content-Type": "application/json;charset=UTF-8",
        }
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function deleteItemProof(id: number, user: { access_token: string}) {
    return fetch(`${DELETE_ITEMPROOF_ENDPOINT}/${id}`, {
        method:'PUT',
        headers: {
            "Authorization": `Bearer ${user.access_token}`,
            "Content-Type": "application/json;charset=UTF-8",
        }
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function deleteMember(id: number, user: { access_token: string}) {
    return fetch(`${DELETE_MEMBER_ENDPOINT}/${id}`, {
        method:'PUT',
        headers: {
            "Authorization": `Bearer ${user.access_token}`,
            "Content-Type": "application/json;charset=UTF-8",
        }
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function registerUser(request: User, user: { access_token: string}) {
    return fetch(POST_USER_ENDPOINT, {
        method:'POST',
        headers: {
            "Authorization": `Bearer ${user.access_token}`,
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(request)
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function getUsers(user: { access_token: string}) {
    return fetch(GET_USER_ENDPOINT, {
        method:'GET',
        headers: {
            "Authorization": `Bearer ${user.access_token}`,
            "Content-Type": "application/json;charset=UTF-8",
        },
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function getUserRoles(user: { access_token: string}) {
    return fetch(GET_USERROLES_ENDPOINT, {
        method:'GET',
        headers: {
            "Authorization": `Bearer ${user.access_token}`,
            "Content-Type": "application/json;charset=UTF-8",
        },
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function deactiveUserAccount(id: number, user: { access_token: string}) {
    return fetch(`${DELETE_USER_ENDPOINT}/${id}`, {
        method:'PUT',
        headers: {
            "Authorization": `Bearer ${user.access_token}`,
            "Content-Type": "application/json;charset=UTF-8",
        },
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

export async function forgotPassword(request: {password: string}, id: number, user: { access_token: string}) {
    return fetch(`${PUT_USERRESET_ENDPOINT}/${id}`, {
        method:'PUT',
        headers: {
            "Authorization": `Bearer ${user.access_token}`,
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(request)
    })
    .then((response) => response.json())
    .catch((err) => console.log(err))
}

