import { useRouter } from 'next/router'
import { useEffect, useState, useCallback } from 'react'
import { getReportByID } from 'service/IncomeServices'
import { 
    Card, 
    CardHeader, 
    CardContent, 
    Avatar, 
    List, 
    ListItem, 
    Paper, 
    TableContainer, 
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Chip,
} from '@mui/material'
import { green, red } from '@mui/material/colors'
import { Item, Proof, Report, ItemProof } from 'utils/types'
import { groupBy } from 'utils/dataUtil'

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
        <Card>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: report?.result === 'Eligible' ? green[500] : red[500] }}>{report?.result?.split(' ')[0][0]}</Avatar>}
            title={report?.name}
            subheader={<div>
                <p style={{ margin: 0 }}>Report Date: {new Date(report?.ReportDate).toLocaleDateString("en-US")}</p>
                <p style={{ margin: 0 }}>Report Period: {new Date(report?.EligibilityStartDate).toLocaleDateString("en-US")} - {new Date(report?.EligibilityEndDate).toLocaleDateString("en-US")}</p>
                <p style={{ margin: 0 }}>Type: {report?.Type?.CalculationType}</p>
                </div>}
          />
          <CardContent>
            <TableContainer component={Paper}>
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
            {report?.Proof?.map((proof: Proof) => (
                <Card key={proof.id} >
                    <CardHeader
                        title={proof.Type.ProofType}
                        subheader={<Chip label={proof.Status.status} color="primary" />}
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
                                                <TableCell align="left">${itemProof.proof}</TableCell>
                                                <TableCell align="left">${itemProof.total}</TableCell>
                                            </TableRow>
                                    ))}
                              </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            ))}
            Total: ${report?.total}
            Percentage: ${report?.percentage}
          </CardContent>
        </Card>
    </>
  )
}

export default Report