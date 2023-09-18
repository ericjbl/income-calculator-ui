import { 
    Card, 
    CardHeader, 
    CardContent,
    TextField,
    Typography,
    Box,
    Stack,
    FormControl,
    InputLabel,
    Select,
    Menu,
    MenuItem,
    SelectChangeEvent,
    Chip,
    IconButton,
    InputAdornment,
    Alert,
    Collapse,
} from "@mui/material"
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs,{ Dayjs } from 'dayjs'
import { ProofStatus } from "utils/types"
import DeleteIcon from '@mui/icons-material/Delete'
import React, { useState } from "react"
import { calculateTotal, getChipColor, getDaysToInclude, generateItemId } from "utils/dataUtil"
import { HiOutlineXCircle } from "react-icons/hi2";
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from "providers/AuthProvider"

const ProofCardForm = ({
        index, 
        input,
        proofTypeInput, 
        setProofTypeInput, 
        proofType, 
        eligibilityStartDate,
        eligibilityEndDate,
        membersInput,
        proofStatusOptions,
        setReportTotal,
        edit = false,
    }:{
        edit?: boolean,
        index: number,
        input: any,
        proofTypeInput: any, 
        setProofTypeInput: (proofTypeInput: any) => void, 
        proofType: string,
        eligibilityStartDate: Dayjs,
        eligibilityEndDate: Dayjs,
        membersInput: any,
        proofStatusOptions: any
        setReportTotal: (total: number) => void
    }
) => {
    const { user } = useAuth()
    const [alert, setAlert] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const proofTypeMenuOpen = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
      setAnchorEl(null)
    }

    const removeProofType = (index: number) => {
        const data = [...proofTypeInput]

   
        if(edit && input.id !== 0) {
            data[index].Delete = true
            // data.splice(index,1)
     
            const finalTotal = data?.filter((proof: any) => proof.Delete === false).reduce((accumulator: number, object: {total: string}) => {
                return accumulator + parseFloat(object.total)
            },0)
            setReportTotal(finalTotal)
            setProofTypeInput(data) 
        } else {
            data.splice(index,1)
     
            const finalTotal = data?.reduce((accumulator: number, object: {total: string}) => {
                return accumulator + parseFloat(object.total)
            },0)
            setReportTotal(finalTotal)
            setProofTypeInput(data) 

        }
    }

    const addProof = (index: number) => {
        let data = [...proofTypeInput]
        data[index].Proof.push({  
            id: 0,
            proof: 0,
            StartDate: null,
            EndDate: null,
            Item: {ProofId: '', Item: '', Role: ''},
            total: 0,
            delete: false
        })
  
        setProofTypeInput([...proofTypeInput]) 
    }

    const removeProof = (index: number, indexProof: number) => {
        let data = [...proofTypeInput]  
        if(edit &&  data[index].Proof[indexProof].id !== 0) {
            data[index].Proof[indexProof].delete = true
            const proofTotal = data[index].Proof?.filter((itemProof: any) => itemProof.delete === false).reduce((accumulator: number, object: {total: string}) => {
                return accumulator + parseFloat(object.total)
            },0)
            
            data[index].total = proofTotal

            data[index].Proof?.filter((itemProof: any) => itemProof.delete === false).length === 0 ? data[index].Delete = true : null
    
            const finalTotal = data.length > 1 ? data?.reduce((accumulator: number, object: {total: string}) => {
                return accumulator + parseFloat(object.total)
            },0) : proofTotal

            setReportTotal(finalTotal)
            setProofTypeInput(data) 

        } else {
            data[index].Proof.splice(indexProof,1)
            const proofTotal = data[index].Proof?.reduce((accumulator: number, object: {total: string}) => {
                return accumulator + parseFloat(object.total)
            },0)
        
            data[index].total = proofTotal
    
            const finalTotal = data.length > 1 ? data?.reduce((accumulator: number, object: {total: string}) => {
                return accumulator + parseFloat(object.total)
            },0) : proofTotal
    
            setReportTotal(finalTotal)
            setProofTypeInput(data) 

        }
  
    }

    const cancelItemProofRemove = (index: number, indexProof: number) => {
        let data = [...proofTypeInput]  
        data[index].Proof[indexProof].delete = false
        console.log(data[index].Proof[indexProof])
        const proofTotal = data[index].Proof?.filter((itemProof: any) => itemProof.delete === false).reduce((accumulator: number, object: {total: string}) => {
            return accumulator + parseFloat(object.total)
        },0)
        
        data[index].total = proofTotal

        data[index].Proof?.filter((itemProof: any) => itemProof.delete === false).length > 0 ? data[index].Delete = false : null

        const finalTotal = data.length > 1 ? data?.reduce((accumulator: number, object: {total: string}) => {
            return accumulator + parseFloat(object.total)
        },0) : proofTotal

        setReportTotal(finalTotal)
        setProofTypeInput(data)

    }

    const cancelProofRemove = (index: number) => {
        let data = [...proofTypeInput]  
        if(data[index].Proof?.filter((itemProof: any) => itemProof.delete === false).length > 0) {
            data[index].Delete = false     
            const finalTotal = data?.filter((proof: any) => proof.Delete === false).reduce((accumulator: number, object: {total: string}) => {
                return accumulator + parseFloat(object.total)
            },0)
            setReportTotal(finalTotal)
            setProofTypeInput(data) 

        } else {
            setAlert(true)
        }

    }

    const handleProofStatushange = (index: number, event: SelectChangeEvent) => {
        console.log(index)
        let data = [...proofTypeInput]
        data[index].ProofStatus = event.target.value as string
        setProofTypeInput(data) 
    }

    const handleItemProofChange = (index: number, indexProof: number, event: SelectChangeEvent) => {
        let data = [...proofTypeInput]
        data[index].Proof[indexProof].Item.ProofId = event.target.value as string
        setProofTypeInput(data) 
    }

    const handleItemProofStartDateChange = (index: number, indexProof: number, newValue: Dayjs | null = null) => {
        let data = [...proofTypeInput]
        data[index].Proof[indexProof].StartDate = dayjs(newValue)
        setProofTypeInput(data) 
    }

    const handleItemProofEndDateChange = (index: number, indexProof: number, newValue: Dayjs | null = null) => {
        let data = [...proofTypeInput]
        data[index].Proof[indexProof].EndDate = dayjs(newValue)
        setProofTypeInput(data) 
    }

    const handleProofChange = (index: number, indexProof: number, event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let data = [...proofTypeInput]
        data[index].Proof[indexProof].proof = parseFloat(event.target.value)
        data[index].Proof[indexProof].total = calculateTotal(proofType, getDaysToInclude(
            data[index].Proof[indexProof].StartDate,
            data[index].Proof[indexProof].EndDate, 
            eligibilityStartDate,
            eligibilityEndDate
        ), parseFloat(event.target.value))
   
        const proofTotal = data[index].Proof?.reduce((accumulator: number, object: {total: string}) => {
            return accumulator + parseFloat(object.total)
        },0)
    
        data[index].total = proofTotal

        const finalTotal = data.length > 1 ? data?.reduce((accumulator: number, object: {total: string}) => {
            return accumulator + parseFloat(object.total)
        },0) : proofTotal

        setReportTotal(finalTotal)
        setProofTypeInput(data) 
    }

    return (

        <Card>
            <Collapse in={alert}>
                <Alert
                severity="error"
                action={
                    <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                        setAlert(false);
                    }}
                    >
                    <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                sx={{ mb: 2 }}
                >
                Need to have at least one proof to be able to cancel the removal
                </Alert>
            </Collapse>
            <CardHeader 
                title={proofType}
                action={
                    <div>
                       {input.Delete && <Chip sx={{ backgroundColor: "#b32123", color: "#f6e6e9" }} label="REMOVED" icon={<HiOutlineXCircle color={"#f6e6e9"} fontSize={"32px"} onClick={() => cancelProofRemove(index)} />}></Chip>}
                    <IconButton
                        aria-controls={proofTypeMenuOpen ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={proofTypeMenuOpen ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        key={index}
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={proofTypeMenuOpen}
                        onClose={handleClose}
                        MenuListProps={{
                        'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem key={index} onClick={() => addProof(index)}>Add Proof</MenuItem>
                        <MenuItem key={index} onClick={() => removeProofType(index)}>Remove Proof Type</MenuItem>
                    </Menu>
                    </div>
                }
            />
            <CardContent>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Box sx={{ minWidth: 200, mb: 2}}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={input.ProofStatus}
                            label="Role"
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    <Chip key={selected} 
                                        label={proofStatusOptions.find((status: ProofStatus) => status.id === parseInt(selected))?.status} 
                                        sx={{bgcolor: getChipColor(proofStatusOptions.find((status: ProofStatus) => status.id === parseInt(selected))?.status), color: 'white'}}
                                    />
                                </Box>
                            )}
                            onChange={(event) => handleProofStatushange(index, event)}
                            >
                                {proofStatusOptions.map((status: ProofStatus) => (
                                    <MenuItem key={status.id} value={status.id}>{status.status}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Typography sx={{ pt: 2 }}>
                        {input.total?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </Typography>
                </Stack>
                {input.Proof?.map((proof: { proof: number, StartDate: Dayjs, EndDate: Dayjs, Item: {ProofId: string, Item: string, Role: string}, total: number, delete: boolean}, indexProof: number) => (
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }} key={indexProof}>
                        <Box sx={{ minWidth: 220 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Member</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={proof.Item.ProofId}
                                label="Role"
                                onChange={(event) => handleItemProofChange(index, indexProof, event)}
                                >
                                    {membersInput.map((member: {ProofId: string, Item: string, Role: string}, index: number) => (
                                        <MenuItem key={index} value={member.ProofId}>{member.Item}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Start Date"
                                value={proof.StartDate}
                                onChange={(newValue) => handleItemProofStartDateChange(index, indexProof, newValue)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="End Date"
                                value={proof.EndDate}
                                onChange={(newValue) => handleItemProofEndDateChange(index, indexProof, newValue)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                        <TextField
                            id="outlined-name"
                            label="Proof"
                            type="number"
                            InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}
                            value={proof.proof}
                            onChange={(event) => handleProofChange(index, indexProof, event)}
                        />
                        <Typography sx={{ pt: 2 }}>
                            {proof.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </Typography>
                        {proof.delete ? <Chip sx={{ backgroundColor: "#b32123", color: "#f6e6e9" }} label="REMOVED" icon={<HiOutlineXCircle color={"#f6e6e9"} fontSize={"32px"} onClick={() => cancelItemProofRemove(index,indexProof)}/>}></Chip> :
                        <IconButton disabled={edit ? !edit : input.Proof.length === 1} onClick={() => removeProof(index, indexProof)}>
                            <DeleteIcon fontSize="medium" />
                        </IconButton>}
                    </Stack>
                ))}
        
            </CardContent>
        </Card>

    )
}

export default ProofCardForm