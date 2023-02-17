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
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    InputAdornment,
} from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs,{ Dayjs } from 'dayjs'
import { useState, useEffect } from "react"
import { CalculationType, ItemRole, ProofType } from "utils/types"
import { getCalculationTypes, getItemRoles, getProofStatus, getProofTypes } from "service/IncomeServices"
import ProofCardForm from "components/form/ProofCardForm"
import MemberForm from "components/form/MemberForm"
import { generateItemId } from "utils/dataUtil";
import { getPovertyGuidelines } from "service/ASPEService";

const AddReport = () => {
    const [reportDate, setReportDate] = useState<Dayjs>(dayjs())
    const [eligibilityStartDate, setEligibilityStartDate] = useState<Dayjs>(dayjs().startOf('month').subtract(1,'year'))
    const [eligibilityEndDate, setEligibilityEndDate] = useState<Dayjs>(dayjs().startOf('month').subtract(1,'day'))
    const [name, setName] = useState("")
    const [type, setType] = useState("")
    const [reportTotal, setReportTotal] = useState(0)
    const [typeOptions, setTypeOpitons] = useState([] as any)
    const [itemRolesOptions, setItemRolesOpitons] = useState([] as any)
    const [proofTypesOptions, setProofTypesOptions] = useState([] as any)
    const [proofStatusOptions, setProofStatusOptions] = useState([] as any)
    const [membersInput, setMembersInput] = useState([{ProofId: generateItemId(), Item: '', Role: ''}] as any)
    const [proofTypeInput, setProofTypeInput] = useState([{
        ProofType: '', ProofStatus: 4, 
        Proof: [{  
            proof: 0,
            StartDate: null,
            EndDate: null,
            Item: {ProofId: generateItemId() ,Item: '', Role: ''},
            total: 0
        }] as any
    , total: 0 }] as any)

    useEffect(() => {
        const getTypeOptions = async () => {
            const types = await getCalculationTypes()
            setTypeOpitons(types)
        }
        const getRolesOptions = async () => {
            const roles = await getItemRoles()
            setItemRolesOpitons(roles)
        }
        const getProofTypesOptions = async () => {
            const proofTypes = await getProofTypes()
            setProofTypesOptions(proofTypes)
        }
        const getProofStatusOptions = async () => {
            const proofStatus = await getProofStatus()
            setProofStatusOptions(proofStatus)
        }
        getTypeOptions()
        getProofStatusOptions()
        getProofTypesOptions()
        getRolesOptions()
    },[])

    useEffect(() => {
        const getProvertyThreshold = async () => {
            const thresholdResp = await getPovertyGuidelines(membersInput.length)
            const result = reportTotal <= thresholdResp.data.poverty_threshold 
            console.log(result)
        }
        getProvertyThreshold()
    },[membersInput])

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    const handleReportDateChange = (newValue: Dayjs | null = null) => {
        let date: Dayjs
        if (newValue != null) {
            date = dayjs(newValue) 
            setReportDate(date)
            const startDate = date.startOf('month').subtract(1,'year')
            const endDate = date.startOf('month').subtract(1,'day')
            setEligibilityStartDate(startDate)
            setEligibilityEndDate(endDate)
        }
    }

    const handleTypeChange = (event: SelectChangeEvent) => {
        setType(event.target.value as string)
    }
    
    const addMembersInput = ()=>{
        const input = {
            ProofId: generateItemId(),
            Item: '', 
            Role: '',
        } 
        setMembersInput([...membersInput, input]) 
    }

    const addProofTypeInput = () => {
        const input = {
            ProofType: '', ProofStatus: 4, 
            Proof: [{  
                proof: 0,
                StartDate: null,
                EndDate: null,
                Item: {Item: '', Role: ''},
                total: 0
            }] as any
        , total: 0 }
        
        setProofTypeInput([...proofTypeInput , input]) 
    }


    const handleProofTypeChange = (index: number, event: SelectChangeEvent) => {
        let data = [...proofTypeInput]
        data[index].ProofType = event.target.value as string
        setProofTypeInput(data) 
    }

    const ProofTypeDisabled = (option: number) => {
        return proofTypeInput.some((input: { ProofType: number }) => input.ProofType === option)
    }

    return (
        <Card>
            <CardHeader 
                title="General Information"
                subheader={`Report Period: ${eligibilityStartDate?.format('MM/DD/YYYY')}  - ${eligibilityEndDate?.format('MM/DD/YYYY')}`}
            />
            <CardContent>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <TextField
                        id="outlined-name"
                        label="Name"
                        value={name}
                        onChange={handleNameChange}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Report Date"
                            
                            value={reportDate}
                            onChange={(newValue) => handleReportDateChange(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <Box sx={{ minWidth: 220 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Type</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={type}
                            label="Type"
                            onChange={handleTypeChange}
                            >
                                {typeOptions.map((type: CalculationType) => (
                                    <MenuItem key={type.id} value={type.id}>{type.CalculationType}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    
                </Stack>
                <Accordion sx={{ mb: 2 }}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                        <Typography sx={{ width: '85%', flexShrink: 0 }}>Add Members</Typography>
                        <Typography sx={{ color: 'text.secondary' }}>Total: {membersInput.length}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {membersInput.map((input: {Item: string, Role: string}, index: number) => (
                            <MemberForm 
                                key={index}
                                input={input}
                                index={index}
                                setMembersInput={setMembersInput}
                                membersInput={membersInput}
                                itemRolesOptions={itemRolesOptions}
                            />
                      
                        ))}
                        <IconButton>
                            <AddCircleOutlineIcon fontSize="medium" onClick={addMembersInput}/>
                        </IconButton>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                        <Typography sx={{ width: '85%', flexShrink: 0 }}>Add Proof</Typography>
                        <Typography sx={{ color: 'text.secondary' }}>Total: {reportTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {proofTypeInput.map((input: 
                            {ProofType: string, 
                            ProofStatus: string, 
                            Proof: [{ proof: number, StartDate: Dayjs, EndDate: Dayjs, Item: {Item: string, Role: string}, total: number}],
                            total: number}
                        ,index: number) => (
                        <Stack direction="column" spacing={2} sx={{ mb: 2 }} key={index}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={input.ProofType}
                                label="Role"
                                disabled={input.ProofType != ''}
                                onChange={(event) => handleProofTypeChange(index, event)}
                                >
                                    {proofTypesOptions.map((types: ProofType) => (
                                        <MenuItem key={types.id} value={types.id} disabled={ProofTypeDisabled(types.id)}>{types.ProofType}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {input.ProofType != '' &&
                                <ProofCardForm 
                                    index={index}
                                    input={input}
                                    proofTypeInput={proofTypeInput} 
                                    setProofTypeInput={setProofTypeInput} 
                                    proofType={proofTypesOptions.find((type:{ id: number}) => type.id === parseInt(input.ProofType)).ProofType}
                                    eligibilityStartDate={eligibilityStartDate}
                                    eligibilityEndDate={eligibilityEndDate}
                                    membersInput={membersInput}
                                    proofStatusOptions={proofStatusOptions}
                                    setReportTotal={setReportTotal}
                                />
                            
                            }
                        </Stack>
                        ))}
                        <IconButton>
                            <AddCircleOutlineIcon fontSize="medium" onClick={addProofTypeInput}/>
                        </IconButton>
                    </AccordionDetails>
                </Accordion>
            </CardContent>
        </Card>
    )
}

export default AddReport