import IncomeAppBar from "components/IncomeAppBar"
import { Chip, Box, TableContainer, Paper, Table, TableHead, TableBody, TableCell, TableRow, Typography, Stack, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, MenuItem, Select, SelectChangeEvent, IconButton, Checkbox } from '@mui/material'
import { useAuth } from "providers/AuthProvider";
import React, { useState, useCallback, useEffect } from "react";
import { getUsers, getUserRoles, registerUser, forgotPassword, deactiveUserAccount } from "service/IncomeServices";
import { Report, User, UserRole } from "utils/types";
import VerifiedIcon from '@mui/icons-material/Verified';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { HiUserPlus } from "react-icons/hi2";
import { HiUserMinus } from "react-icons/hi2";
import { GrPowerReset } from "react-icons/gr";
import { useRouter } from "next/router";
import CircleIcon from '@mui/icons-material/Circle';
import Image from "next/image";

const AdminPortal = () => {
    const { user } = useAuth()
    const router = useRouter()
    const [userRoles, setUserRoles] = useState([] as any)
    const [users, setUsers] = useState([] as any)
    const [openUserForm, setOpenUserForm] = useState(false)
    const [openRemoveUserForm, setOpenRemoveUserForm] = useState(false)
    const [openResetUserForm, setOpenResetUserForm] = useState(false)
    const [selectedUser, setSelectedUser] = useState({} as User)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [selectedRole, setSelectedRole] = useState("")

    useEffect(() => {
        getUsersData()
        getUserRolesData()
    },[])

    const getUsersData = useCallback(async () => {
        const resp = await getUsers(user)
        setUsers(resp)
    },[])

    const getUserRolesData = useCallback(async () => {
        const resp = await getUserRoles(user)
        console.log(resp)
        setUserRoles(resp)
    },[])

    const handleUserRoleChange = (event: SelectChangeEvent) => {
        setSelectedRole(event.target.value)
    }

    const isSelected = (userId: number) => selectedUser.userId === userId;

    const handleUserSelect = (event: React.MouseEvent<unknown>, userId: number) => {
        isSelected(userId) ?
        setSelectedUser({} as User)
        :
        setSelectedUser(users.filter((user: User) => user.userId === userId)[0])
    }


    const submit = async () => {
        const newUser : User = {} as User
        newUser.firstName = firstName
        newUser.lastName = lastName
        newUser.email = email
        newUser.username = username
        newUser.password = password
        newUser.role_id = Number(selectedRole)

        await registerUser(newUser, user)
        router.reload()
    }

    const deactive = async () => {
        await deactiveUserAccount(selectedUser.userId, user)
    }

    const reset = async () => {
        await forgotPassword({password: password},selectedUser.userId, user)
    }

    return (
        <>
        <IncomeAppBar />
        <Box sx={{ margin: 2, padding: 1 }}>
            <Stack direction="row" spacing={2} mb={2}>
                <Typography variant="h4" color="#004d40" >Users</Typography>
                <IconButton onClick={() => {  setSelectedUser({} as User); setOpenUserForm(true); }}>
                    <HiUserPlus color="#004d40" fontSize="28px" />
                </IconButton>
                <IconButton onClick={() => setOpenRemoveUserForm(true)}>
                    <HiUserMinus color="#b32123" fontSize="28px" />
                </IconButton>
                <IconButton onClick={() => setOpenResetUserForm(true)}>
                    <GrPowerReset color="#004d40" fontSize="28px" />
                </IconButton>
            </Stack>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650, boxShadow: 3, border: 2, borderColor: '#80cbc4'  }} size="small" aria-label="a dense table" >
                <TableHead sx={{ backgroundColor: "#b0dfef" }}>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>First Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell>Username</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Active User</TableCell>
                        <TableCell align="center">Has Logged In</TableCell>
                        <TableCell align="center">Last Logged In</TableCell>
                        <TableCell align="center">Open Applications</TableCell>
                        <TableCell align="center">Completed Applications</TableCell>
                        <TableCell align="center">Total Applications</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {users.map((userData: User) => {
                    const isItemSelected = isSelected(userData?.userId);
                    return (
                        <TableRow 
                            key={userData?.userId}
                            hover
                            onClick={(event) => handleUserSelect(event, userData?.userId)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            selected={isItemSelected}
                        >
                            <TableCell padding="checkbox">
                                <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                // inputProps={{
                                //     'aria-labelledby': labelId,
                                // }}
                                />
                            </TableCell>
                            <TableCell component="th" scope="row">{userData?.firstName}</TableCell>
                            <TableCell>{userData?.lastName}</TableCell>
                            <TableCell>{userData?.username}</TableCell>
                            <TableCell>{userData?.email}</TableCell>
                            <TableCell>{userData?.Role?.role}</TableCell>
                            <TableCell><Chip sx={{ backgroundColor: userData?.active ? "#27ab4d" : "#b32123", color: userData?.active ? "#e5f5e9" : "#f6e6e9" }} label={userData?.active ? "Active" : "Inactive"} icon={<CircleIcon sx={{ color: userData?.active ? "#e5f5e9 !important" : "#f6e6e9 !important" }}/>} /></TableCell>
                            <TableCell align="center">{userData?.HasLoggedIn ? <VerifiedIcon sx={{ color:"#27ab4d" }} /> : <ErrorOutlineIcon sx={{ color: "#b32123" }} /> }</TableCell>
                            <TableCell align="center">{userData?.LastLoggedInDate ? new Date(userData?.LastLoggedInDate).toLocaleString('en-US') : ''}</TableCell>
                            <TableCell align="center">{userData?.Reports?.filter((report: Report) => report.Status?.ReportStatus === "Incomplete").length}</TableCell>
                            <TableCell align="center">{userData?.Reports?.filter((report: Report) => report.Status?.ReportStatus === "Completed").length}</TableCell>
                            <TableCell align="center">{userData?.Reports?.length}</TableCell>
                        </TableRow>
                    )}
                )}
                </TableBody>
            </Table>
            </TableContainer>
        </Box>
        <Dialog open={openUserForm} onClose={() => setOpenUserForm(false)}>
            <DialogTitle>Add User</DialogTitle>
            <DialogContent>
            {/* <DialogContentText>
                To subscribe to this website, please enter your email address here. We
                will send updates occasionally.
            </DialogContentText> */}
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="First Name"
                    value={firstName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFirstName(event.target.value)}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Last Name"
                    value={lastName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLastName(event.target.value)}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email Address"
                    value={email}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                    type="email"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="username"
                    value={username}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Password"
                    value={password}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                    type="password"
                    fullWidth
                    variant="standard"
                />
                <Select
                    fullWidth
                    variant="standard"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedRole}
                    label="UserRole"
                    onChange={handleUserRoleChange}
                >
                    {userRoles.map((userRole: UserRole) => (
                        <MenuItem key={userRole.roleId} value={userRole.roleId}>{userRole.role}</MenuItem>
                    ))}
                    
                </Select>
            </DialogContent>
            <DialogActions> 
            <Button onClick={() => setOpenUserForm(false)}>Cancel</Button>
            <Button onClick={submit}>Create</Button>
            </DialogActions>
        </Dialog>
        <Dialog open={openRemoveUserForm} onClose={() => setOpenRemoveUserForm(false)}>
            <DialogTitle>Deactivate User</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to deactive {selectedUser.username} accounts?
                </DialogContentText>
            </DialogContent>
            <DialogActions> 
                <Button onClick={() => setOpenRemoveUserForm(false)}>Cancel</Button>
                <Button onClick={deactive}>Deactivate</Button>
            </DialogActions>
        </Dialog>
        <Dialog open={openResetUserForm} onClose={() => setOpenResetUserForm(false)}>
            <DialogTitle>Reset User</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to reset {selectedUser.username} password?
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Password"
                    value={password}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                    type="password"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions> 
                <Button onClick={() => setOpenResetUserForm(false)}>Cancel</Button>
                <Button onClick={reset}>Reset</Button>
            </DialogActions>
        </Dialog>
        <Image  src="/Eligibee-bee.png"  alt="eligibee" height={300} width={300} style={{ right: 0, position: 'fixed', bottom: 0, }} />
        </>
    )
}

export default AdminPortal;