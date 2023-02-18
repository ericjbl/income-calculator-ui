import { useRouter } from 'next/router'
import { useEffect, useState, useCallback } from 'react'
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
} from '@mui/material'
import { green, red } from '@mui/material/colors'
import { Item, Proof, Report, ItemProof } from 'utils/types'
import { getChipColor } from 'utils/dataUtil'
import WarningIcon from '@mui/icons-material/Warning'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import IncomeAppBar from 'components/IncomeAppBar'

const Report = () => {
  const router = useRouter()
  const { reportId } : any  = router.query
  const [report, setReport] = useState({} as Report)

  useEffect(() => {
    if(!reportId) return
    getReport()
  }, [router.isReady])

  const getReport =  useCallback(async () => {
    const reportResp = await getReportByID(reportId)
    setReport(reportResp)
  },[reportId])

  return (
    <>
        <IncomeAppBar />
        <Card>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: report?.result === 'Eligible' ? green[500] : red[500] }}>{report?.result?.split(' ')[0][0]}</Avatar>}
            title={report?.name}
            subheader={<div>
                <p style={{ margin: 0 }}>Report Date: {new Date(report?.ReportDate).toLocaleDateString("en-US")}</p>
                <p style={{ margin: 0 }}>Report Period: {new Date(report?.EligibilityStartDate).toLocaleDateString("en-US")} - {new Date(report?.EligibilityEndDate).toLocaleDateString("en-US")}</p>
                <p style={{ margin: 0 }}>Type: {report?.Type?.CalculationType}</p>
                </div>}
            action={<div>
                {report?.Status?.ReportStatus === 'Incomplete' ? <WarningIcon fontSize="large" color="error"/> : <CheckCircleIcon fontSize="large" color="success"/>}
                <IconButton aria-label="settings">
                    <MoreVertIcon />
                </IconButton>
            </div>}
          />
          <CardContent>
            <Typography>Total: {report?.total?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} Percentage: {report?.percentage?.toFixed(2)}%</Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>Members</Typography>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table sx={{ minWidth: 450 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Member</TableCell>
                            <TableCell>Role</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {report?.Item?.map((item: Item) => (
                            <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">{item.Item}</TableCell>
                                <TableCell align="left">{item.Role.ItemRole}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                </Table>
            </TableContainer>
            <Typography variant="h5" sx={{ mt: 2, mb: 1}}>Proof</Typography>
            {report?.Proof?.map((proof: Proof) => (
                <Card key={proof.id} >
                    <CardHeader
                        title={proof.Type.ProofType}
                        subheader={
                        <Chip 
                            label={proof.Status.status} 
                            sx={{bgcolor: getChipColor(proof.Status.status), color: 'white'}}
                        />}
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
                                    {proof?.ItemProof?.map((itemProof: ItemProof) => (
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
    </>
  )
}

export default Report