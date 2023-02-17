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
} from "@mui/material"
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs,{ Dayjs } from 'dayjs'
import { ProofStatus, ProofType } from "utils/types"
import { useState } from "react"
import { calculateTotal, getChipColor, getDaysToInclude, generateItemId } from "utils/dataUtil"

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
        setReportTotal
    }:{
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
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const proofTypeMenuOpen = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
      setAnchorEl(null)
    }

    const addProofTypeInput = () => {
        const input = {
            ProofType: '', ProofStatus: 4, 
            Proof: [{  
                proof: 0,
                StartDate: null,
                EndDate: null,
                Item: {ProofId: generateItemId(),Item: '', Role: ''},
                total: 0
            }] as any
        , total: 0 }
        
        setProofTypeInput([...proofTypeInput , input]) 
    }

    const removeProofType = (index: number) => {
        const data = [...proofTypeInput]
        data.splice(index,1)
        setProofTypeInput(data) 
    }

    const addProof = (index: number) => {
        let data = [...proofTypeInput]
        data[index].Proof.push({  
            proof: 0,
            StartDate: null,
            EndDate: null,
            Item: {Item: '', Role: ''},
            total: 0
        })
  
        setProofTypeInput([...proofTypeInput]) 
    }

    const handleProofStatushange = (index: number, event: SelectChangeEvent) => {
        console.log(index)
        let data = [...proofTypeInput]
        data[index].ProofStatus = event.target.value as string
        setProofTypeInput(data) 
    }

    const ProofTypeDisabled = (option: number) => {
        return proofTypeInput.some((input: { ProofType: number }) => input.ProofType === option)
    }

    const handleItemProofChange = (index: number, indexProof: number, event: SelectChangeEvent) => {
        let data = [...proofTypeInput]
        data[index].Proof[indexProof].Item.Item = event.target.value as string
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

        console.log('Proof len: ', data.length)
        console.log(finalTotal)
        setReportTotal(finalTotal)
        setProofTypeInput(data) 
    }

    return (

        <Card key={index}>
            <CardHeader 
                title={proofType}
                action={
                    <div>
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
                                        label={proofStatusOptions.find((status: ProofStatus) => status.id === parseInt(selected)).status} 
                                        sx={{bgcolor: getChipColor(proofStatusOptions.find((status: ProofStatus) => status.id === parseInt(selected)).status), color: 'white'}}
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
                {input.Proof?.map((proof: { proof: number, StartDate: Dayjs, EndDate: Dayjs, Item: {Item: string, Role: string}, total: number}, indexProof: number) => (
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <Box sx={{ minWidth: 220 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Member</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={proof.Item.Item}
                                label="Role"
                                onChange={(event) => handleItemProofChange(index, indexProof, event)}
                                >
                                    {membersInput.map((member: {Item: '', Role: ''}, index: number) => (
                                        <MenuItem key={index} value={member.Item}>{member.Item}</MenuItem>
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
                    </Stack>
                ))}
        
            </CardContent>
        </Card>

    )
}

export default ProofCardForm