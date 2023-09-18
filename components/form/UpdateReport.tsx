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
    Avatar,
    MenuItem,
    SelectChangeEvent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Button,
    Snackbar,
    Alert,
    ButtonGroup,
    AlertTitle
} from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs,{ Dayjs } from 'dayjs'
import React, { useState, useEffect } from "react"
import { CalculationType, Item, ItemProof, Proof, ProofType, Report, ReportStatus } from "utils/types"
import { 
    getCalculationTypes, 
    getItemRoles, 
    getProofStatus, 
    getProofTypes, 
    getPovertyGuidelines,
    getReportStatus,
    addReport,
    addReportMember,
    addReportProof,
    addReportItemProof,
    getToken,
    updateReport,
    updateMember,
    updateReportItemProof,
    updateReportProof,
    deleteProof,
    deleteItemProof,
    deleteMember,
 } from "service/IncomeServices"
import ProofCardForm from "components/form/ProofCardForm"
import MemberForm from "components/form/MemberForm"
import { generateItemId } from "utils/dataUtil"
import { useRouter } from "next/router"
import { green, red } from "@mui/material/colors"
import IncomeAppBar from "components/IncomeAppBar"
import { useAuth } from "providers/AuthProvider"

const UpdateReport = ({ data, setEdit } : {data: Report, setEdit: () => void}) => {
    const router = useRouter()
    const { user } = useAuth()
    const [alert, setAlert]= useState(false)
    const [alertMessage, setAlertMessage] = useState({} as any)
    const [reportDate, setReportDate] = useState<Dayjs>(dayjs(data.ReportDate))
    const [eligibilityStartDate, setEligibilityStartDate] = useState<Dayjs>(dayjs(data.EligibilityStartDate))
    const [eligibilityEndDate, setEligibilityEndDate] = useState<Dayjs>(dayjs(data.EligibilityEndDate))
    const [name, setName] = useState(data.name)
    const [lastName, setLastName] = useState(data.lastName)
    const [type, setType] = useState(data.Type.id.toString())
    const [reportStatus, setReportStatus] = useState(data.Status.id.toString())
    const [reportTotal, setReportTotal] = useState(data.total)
    const [reportResult, setReportResult] = useState(data.result)
    const [reportPercentage, setReportPercentage] =useState(data.percentage)
    const [typeOptions, setTypeOpitons] = useState([] as any)
    const [itemRolesOptions, setItemRolesOpitons] = useState([] as any)
    const [proofTypesOptions, setProofTypesOptions] = useState([] as any)
    const [proofStatusOptions, setProofStatusOptions] = useState([] as any)
    const [reportStatusOptions, setReportStatusOptions] = useState([] as any)
    const [membersInput, setMembersInput] = useState(
        data.Item.map((item: Item) => ({
            id: item.id, ProofId: item.ProofId, Item: item.Item, Role: item.Role.id.toString(), ItemUID: item.ItemUID, delete: item.delete
        }
        ))
    )
    const [proofTypeInput, setProofTypeInput] = useState(
        data.Proof.map((proof: Proof) =>  ( 
            {
                id: proof.id,
                ProofType: proof.Type.id.toString(), 
                ProofStatus: proof.Status.id, 
                Proof: proof.ItemProof.map((itemProof: ItemProof) => (
                {   
                    id: itemProof.id,
                    proof: itemProof.proof,
                    StartDate: dayjs(itemProof.StartDate),
                    EndDate: dayjs(itemProof.EndDate),
                    Item: { ProofId: itemProof.Item.ProofId, Item: itemProof.Item.Item, Role: itemProof.Item.Role.ItemRole, ItemUID: '', },
                    total: itemProof.total,
                    delete: itemProof.delete
                }))
                , total: proof.total,
                Delete: proof.Delete
            }
        ))
   )

    useEffect(() => {
        const getTypeOptions = async () => {
            await getToken()
            const types = await getCalculationTypes()
            setTypeOpitons(types)
        }
        const getRolesOptions = async () => {
            await getToken()
            const roles = await getItemRoles()
            setItemRolesOpitons(roles)
        }
        const getProofTypesOptions = async () => {
            await getToken()
            const proofTypes = await getProofTypes()
            setProofTypesOptions(proofTypes)
        }
        const getProofStatusOptions = async () => {
            await getToken()
            const proofStatus = await getProofStatus()
            setProofStatusOptions(proofStatus)
        }
        const getReportStatusOptions = async () => {
            await getToken()
            const reportStatus = await getReportStatus()
            setReportStatusOptions(reportStatus)
        }
        getReportStatusOptions()
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
            setReportResult(result ? 'Eligible' : 'Ineligible')
            setReportPercentage(reportTotal/thresholdResp.data.poverty_threshold )
        }
        getProvertyThreshold()
    },[membersInput,reportTotal])

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value)
        setLastName(event.target.value)
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
        setType(event.target.value)
    }

    const handleStatusChange = (event: SelectChangeEvent) => {
        setReportStatus(event.target.value as string)
    }
    
    const addMembersInput = ()=>{
        const input = {
            id: 0,
            ProofId: generateItemId(),
            Item: '', 
            Role: '',
            ItemUID: '',
            delete: false,
        } 
        setMembersInput([...membersInput, input]) 
    }

    const addProofTypeInput = () => {
        const input = {
            id: 0,
            ProofType: '', ProofStatus: 1, 
            Proof: [{ 
                id: 0 , 
                proof: 0,
                StartDate: null,
                EndDate: null,
                Item: {ProofId: '', Item: '', Role: '', ItemUID: '',},
                total: 0
            }] as any
        , total: 0, Delete: false
     }
        
        setProofTypeInput([...proofTypeInput , input]) 
    }


    const handleProofTypeChange = (index: number, event: SelectChangeEvent) => {
        let data = [...proofTypeInput]
        data[index].ProofType = event.target.value as string
        setProofTypeInput(data) 
    }

    const ProofTypeDisabled = (option: string) => {
        console.log(option)
        console.log(proofTypeInput)
        return proofTypeInput.some((input: { ProofType: string }) => input.ProofType === option)
    }

    const submit = async () => {
        const report: Report = {} as Report
        report.name = name
        report.lastName = lastName
        report.ReportDate = reportDate.format('MM/DD/YYYY')
        report.EligibilityStartDate = eligibilityStartDate.format('MM/DD/YYYY')
        report.EligibilityEndDate = eligibilityEndDate.format('MM/DD/YYYY')
        report.TypeId = parseInt(type)
        report.reportStatusId = parseInt(reportStatus)
        report.total = reportTotal
        report.result = reportResult
        report.percentage = reportPercentage
        report.userId = data.User.username
        report.updateby = user.username

        console.log('Update total:', reportTotal)

        const updateResult = await updateReport(report, data.id, user)
        membersInput.forEach(async (member: {
            id: number,
            ProofId: string,
            Item: string, 
            Role: string,
            ItemUID: string,
            delete: boolean,
        }) => {
            const memberData : Item = {} as Item
            memberData.ReportId = data.id
            memberData.Item = member.Item
            memberData.ItemUID = member.ItemUID
            memberData.roleId = parseInt(member.Role)
            memberData.delete = false
            if(member.id === 0){
                memberData.ProofId = member.ProofId + data.id
                await addReportMember(memberData)
            } else if(!member.delete) {
                memberData.ProofId = member.ProofId
                await updateMember(memberData,member.id,user)
            } else {
                await deleteMember(member.id,user)
            }
        
        });

        proofTypeInput.forEach(async (proofType: any
        //     {
        //     ProofType: string, ProofStatus: number, 
        //     Proof: [{  
        //         proof: number,
        //         StartDate: Dayjs,
        //         EndDate: Dayjs,
        //         Item: {ProofId: string, Item: string, Role: number},
        //         total: number
        //     }]
        // , total: number}
        ) => {
            const proofTypeData : Proof = {} as Proof
            proofTypeData.total = proofType.total
            proofTypeData.ReportId = data.id
            proofTypeData.StatusId = proofType.ProofStatus
            proofTypeData.TypeId = parseInt(proofType.ProofType)
            proofTypeData.Delete = false
            if(proofType.id === 0){
                const addProofTypeResp = await addReportProof(proofTypeData)
                console.log('addProof...', addProofTypeResp)
                if(addProofTypeResp.id) {
                    proofType.Proof.forEach(async (itemProof: {  
                        proof: number,
                        StartDate: Dayjs,
                        EndDate: Dayjs,
                        Item: { id: number,ProofId: string, Item: string, Role: number},
                        total: number
                    }) => {
                        const itemProofData : ItemProof = {} as ItemProof
                        itemProofData.total = itemProof.total
                        itemProofData.proof = itemProof.proof
                        itemProofData.ItemId =  membersInput.filter((member: { id: number, ProofId: string}) => member.ProofId === itemProof.Item.ProofId)[0].id === 0 ? 
                            parseInt(itemProof.Item.ProofId + data.id) : parseInt(itemProof.Item.ProofId)
                        itemProofData.ProofId = addProofTypeResp.id
                        itemProofData.StartDate = itemProof.StartDate.format('MM/DD/YYYY')
                        itemProofData.EndDate = itemProof.EndDate.format('MM/DD/YYYY')

                        const addItemProofResp = await addReportItemProof(itemProofData)
                        console.log('addItemProof...', addItemProofResp)
                    })
                }
            } else if(!proofType.Delete) {
                await updateReportProof(proofTypeData, proofType.id, user)
                proofType.Proof.forEach(async (itemProof: {  
                    id: number,
                    proof: number,
                    StartDate: Dayjs,
                    EndDate: Dayjs,
                    Item: {id: number,ProofId: string, Item: string, Role: number},
                    total: number
                    delete: boolean
                }) => {
                    const itemProofData : ItemProof = {} as ItemProof
                    itemProofData.total = itemProof.total
                    itemProofData.proof = itemProof.proof
                    itemProofData.ItemId =  membersInput.filter((member: { id: number, ProofId: string}) => member.ProofId === itemProof.Item.ProofId)[0].id === 0 ? 
                        parseInt(itemProof.Item.ProofId + data.id) : parseInt(itemProof.Item.ProofId)
                    itemProofData.ProofId = proofType.id
                    itemProofData.StartDate = itemProof.StartDate.format('MM/DD/YYYY')
                    itemProofData.EndDate = itemProof.EndDate.format('MM/DD/YYYY')
                    itemProofData.delete = false

                    if(itemProof.id === 0) {
                        await addReportItemProof(itemProofData)
                    } else if (!itemProof.delete) {
                        await updateReportItemProof(itemProofData,itemProof.id,user)
                    }
                    else {
                        await deleteItemProof(itemProof.id,user)
                    }
                })

            } else {
                await deleteProof(proofType.id, user)
                proofType.Proof.forEach(async (itemProof: { id: number }) => {
                    await deleteItemProof(itemProof.id,user)
                })
            }
        
        })
        
        setAlert(true)
        setAlertMessage({message: 'Application was succesfully updated', status: 'success'})

        console.log('update...',updateResult)
    }

    return (
        <>
        {alert &&   
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={alert}
                autoHideDuration={4000}
                onClose={() => router.reload()}
            >
                <Alert onClose={() => router.reload()} severity={alertMessage.status} sx={{ width: '100%' }}>
                    {alertMessage.message}
                </Alert>
            </Snackbar>
        }
        <Card 
             sx={{       
                boxShadow: 3,
                border: 1,
                borderColor: '#80cbc4',
            }}
        >
            <CardHeader 
                avatar={<Avatar sx={{ bgcolor: reportResult === 'Eligible' ? green[500] : red[500] }}>{reportResult.split(' ')[0][0]}</Avatar>}
                title="General Information"
                subheader={`Report Period: ${eligibilityStartDate?.format('MM/DD/YYYY')}  - ${eligibilityEndDate?.format('MM/DD/YYYY')}`}
                action={
                // <Button variant="contained" color="success" onClick={submit}>Save</Button>
                <ButtonGroup>
                    <Button sx={{ marginRight: 1, backgroundColor: "#b32123", color: "#f6e6e9" }} variant="contained" onClick={() => setEdit()}>Cancel</Button>
                    <Button sx={{ backgroundColor: "#27ab4d", color: "#e5f5e9" }} variant="contained" onClick={submit}>Update</Button>
                </ButtonGroup>
                }
            />
            <CardContent>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <TextField
                        id="outlined-name"
                        label="Name"
                        value={name}
                        onChange={handleNameChange}
                    />
                    <TextField
                        id="outlined-name"
                        label="Last Name"
                        value={lastName}
                        onChange={handleLastNameChange}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Report Date"
                            disabled
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
                    <Box sx={{ minWidth: 220 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Report Status</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={reportStatus}
                            label="Type"
                            onChange={handleStatusChange}
                            >
                                {reportStatusOptions.map((status: ReportStatus) => (
                                    <MenuItem key={status.id} value={status.id}>{status.ReportStatus}</MenuItem>
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
                        <Typography sx={{ color: 'text.secondary' }}>Total: {data.Item.length}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {membersInput.map((input: {ProofId: string,Item: string, Role: string, delete: boolean, ItemUID: string}, index: number) => (
                            <MemberForm 
                                key={index}
                                input={input}
                                index={index}
                                setMembersInput={setMembersInput}
                                membersInput={membersInput}
                                itemRolesOptions={itemRolesOptions}
                                edit={true}
                            />
                      
                        ))}
                        <IconButton onClick={addMembersInput}>
                            <AddCircleOutlineIcon fontSize="medium" />
                        </IconButton>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                        <Typography sx={{ width: '65%', flexShrink: 0 }}>Add Proof</Typography>
                        <Typography sx={{ color: 'text.secondary' }}>Total: {reportTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} Percentage: {reportPercentage.toFixed(2)}%</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {proofTypeInput.map((input: any
                            // {
                            //     ProofType: string, 
                            //     ProofStatus: number, 
                            //     Proof: [{ proof: number, StartDate: Dayjs, EndDate: Dayjs, Item: {Item: string, Role: string}, total: number}],
                            //     total: number
                            // }
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
                                        <MenuItem key={types.id} value={types.id} disabled={ProofTypeDisabled(types.id.toString())}>{types.ProofType}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {input.ProofType != '' &&
                                <ProofCardForm
                                    index={index}
                                    input={input}
                                    proofTypeInput={proofTypeInput} 
                                    setProofTypeInput={setProofTypeInput} 
                                    proofType={proofTypesOptions.find((type:{ id: number}) => type.id === parseInt(input.ProofType))?.ProofType}
                                    eligibilityStartDate={eligibilityStartDate}
                                    eligibilityEndDate={eligibilityEndDate}
                                    membersInput={membersInput}
                                    proofStatusOptions={proofStatusOptions}
                                    setReportTotal={setReportTotal}
                                    edit={true}
                                />
                            
                            }
                        </Stack>
                        ))}
                        <IconButton onClick={addProofTypeInput}>
                            <AddCircleOutlineIcon fontSize="medium" />
                        </IconButton>
                    </AccordionDetails>
                </Accordion>
            </CardContent>
        </Card>
        </>
    )
}

export default UpdateReport