import { useRouter } from 'next/router'
import React, { useEffect, useState, useCallback } from 'react'
import { getReportByID } from 'service/IncomeServices'
import { 
    Card, 
    CardHeader, 
    CardContent, 
    Avatar, 
    Typography, 
    Paper, 
    TableContainer, 
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Box
} from '@mui/material'
import { green, red } from '@mui/material/colors'
import { Item, Proof, Report, ItemProof } from 'utils/types'
import { getChipColor } from 'utils/dataUtil'
import WarningIcon from '@mui/icons-material/Warning'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import IncomeAppBar from 'components/IncomeAppBar'
import { useAuth } from 'providers/AuthProvider'
import UpdateReport from 'components/form/UpdateReport'
import Image from 'next/image'

const Report = () => {
  const router = useRouter()
  const { reportId } : any  = router.query
  const [report, setReport] = useState({} as Report)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false)
  const [edit, setEdit] = useState(false)
  const { user } = useAuth(); 

  useEffect(() => {
    if(!reportId) return
    getReport()
  }, [router.isReady])

  const getReport =  useCallback(async () => {
    const reportResp = await getReportByID(user, reportId)
    setReport(reportResp)
  },[reportId])

  const toggleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(!open)
    setAnchorEl(event.currentTarget);
  }

  const closeEdit = () => {
      setEdit(false)
      setOpen(false)
  }

  return (
    <>
        <IncomeAppBar />
        <Box  
            sx={{   
                margin: 2,    
                boxShadow: 3,
                border: 2,
                borderColor: '#80cbc4',
            }}
        >
        {!edit ? <Card>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: report?.result === 'Eligible' ? green[500] : red[500] }}>{report?.result?.split(' ')[0][0]}</Avatar>}
            title={report?.name + ' ' + report?.lastName}
            subheader={<div>
                <p style={{ margin: 0 }}>Report Date: {new Date(report?.ReportDate).toLocaleDateString("en-US")}</p>
                <p style={{ margin: 0 }}>Report Period: {new Date(report?.EligibilityStartDate).toLocaleDateString("en-US")} - {new Date(report?.EligibilityEndDate).toLocaleDateString("en-US")}</p>
                <p style={{ margin: 0 }}>Type: {report?.Type?.CalculationType}</p>
                <p style={{ margin: 0 }}>Entered By: {report?.User?.username}</p>
                </div>}
            action={<div>
                {report?.Status?.ReportStatus === 'Incomplete' ? <WarningIcon fontSize="large" sx={{ color: "#b32123" }}/> : <CheckCircleIcon fontSize="large" sx={{ color: "#27ab4d" }}/>}
                <IconButton aria-label="settings"
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={(e) => toggleMenu(e)}
                >
                    <MoreVertIcon />
                </IconButton>
            </div>}
          />
            <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={() => setOpen(false)}
            MenuListProps={{
                'aria-labelledby': 'basic-menu',
            }}
            >
            {/* <MenuItem>{user.username}</MenuItem> */}
            {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
            <MenuItem onClick={() => setEdit(true)}>Edit</MenuItem>
            </Menu>
          <CardContent>
            <Typography>Total: {report?.total?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} Percentage: {report?.percentage?.toFixed(2)}%</Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>Members</Typography>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table sx={{ minWidth: 450 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Member</TableCell>
                            <TableCell>UID</TableCell>
                            <TableCell>Role</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {report?.Item?.filter((member: { delete: boolean}) => member.delete === false)?.map((item: Item) => (
                            <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">{item.Item}</TableCell>
                                <TableCell component="th" scope="row">{item.ItemUID}</TableCell>
                                <TableCell align="left">{item.Role.ItemRole}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                </Table>
            </TableContainer>
            <Typography variant="h5" sx={{ mt: 2, mb: 1}}>Proof</Typography>
            {report?.Proof?.filter((proof: {Delete: boolean}) => proof.Delete === false)?.map((proof: Proof) => (
                <Card sx={{ marginBottom: 2 }} key={proof.id} >
                    <CardHeader
                        title={proof.Type.ProofType}
                        subheader={
                        <>
                        <Chip 
                            label={proof.Status.status} 
                            sx={{bgcolor: getChipColor(proof.Status.status), color: 'white'}}
                        />
                        <Typography sx={{ pt: 2 }}>
                            Total: {proof.total?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </Typography>
                        </>
                        }
                    />
                    <CardContent>
                     
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 450 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Member</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Start Date</TableCell>
                                        <TableCell>End Date</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {proof?.ItemProof.filter((proof: {delete: boolean}) => proof.delete === false)?.map((itemProof: ItemProof) => (
                                            <TableRow key={itemProof.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell component="th" scope="row">{itemProof.Item.Item}</TableCell>
                                                <TableCell align="left">{itemProof.Item.Role.ItemRole}</TableCell>
                                                <TableCell>{new Date(itemProof.StartDate).toLocaleDateString("en-US")}</TableCell>
                                                <TableCell>{new Date(itemProof.EndDate).toLocaleDateString("en-US")}</TableCell>
                                                <TableCell align="left">{itemProof.proof?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                                <TableCell align="left">{itemProof.total?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                            </TableRow>
                                    ))}
                              </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            ))}
          </CardContent>
        </Card>
        : <>
        <UpdateReport data={report} setEdit={closeEdit} />
        <Image  src="/../public/Eligibee-bee.png"  alt="eligibee" height={300} width={300} style={{ right: 0, position: 'fixed', bottom: 0, }} />
        </>

        }
        </Box>
    </>
  )
}

export default Report