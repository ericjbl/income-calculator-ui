import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { getReports, getToken } from 'service/IncomeServices'
import SideMenu from 'components/SideMenu'
import { 
  Paper, 
  TableContainer, 
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Box,
  TableFooter,
  TablePagination,
  Typography,
} from '@mui/material'
import { DataGrid, GridColDef, GridValueFormatterParams, GridRenderCellParams, GridSelectionModel} from '@mui/x-data-grid'
import { Report, ReportStatus, User } from 'utils/types'
import WarningIcon from '@mui/icons-material/Warning'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import IncomeAppBar from 'components/IncomeAppBar'
import { useAuth } from 'providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [reports,setReports] = useState([] as any)
  // const [selectedRow, setSelectedRow] = useState({} as Report)
  // const [page, setPage] = useState(0)
  // const [rowsPerPage, setRowsPerPage] = useState(10)
  const [pageSize, setPageSize] = useState(10);
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])
  const [selectedRow, setSelection] = useState(null as any);
  const router = useRouter()
  const { user } = useAuth(); 

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1,},
    { field: 'lastName', headerName: 'Last Name', flex: 1,},
    { field: 'ReportDate', headerName: 'Report Date', flex: 1,
    valueFormatter: (params: GridValueFormatterParams<Date>) => {
      if (params.value == null) {
        return '';
      }

      const valueFormatted = new Date(params.value).toLocaleDateString("en-US");
      return `${valueFormatted}`;
    },
    },
    { field: 'EligibilityStartDate', headerName: 'Eligible Start Date', flex: 1,
    valueFormatter: (params: GridValueFormatterParams<Date>) => {
      if (params.value == null) {
        return '';
      }

      const valueFormatted = new Date(params.value).toLocaleDateString("en-US");
      return `${valueFormatted}`;
    },
    },
    { field: 'EligibilityEndDate', headerName: 'Eligible End Date', flex: 1,
    valueFormatter: (params: GridValueFormatterParams<Date>) => {
      if (params.value == null) {
        return '';
      }

      const valueFormatted = new Date(params.value).toLocaleDateString("en-US");
      return `${valueFormatted}`;
    },
    },
    { field: 'total', headerName: 'Total', flex: 1,
    valueFormatter: (params: GridValueFormatterParams<number>) => {
      if (params.value == null) {
        return '';
      }

      const valueFormatted = Number(params.value).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      return `${valueFormatted}`;
    },
    },
    { field: 'percentage', headerName: 'Percentage', flex: 1,
    valueFormatter: (params: GridValueFormatterParams<number>) => {
      if (params.value == null) {
        return '';
      }

      const valueFormatted = Number(params.value * 100).toFixed(2);
      return `${valueFormatted} %`;
    },
    },
    { field: 'result', headerName: 'Result', flex: 1,
    renderCell: (params: GridRenderCellParams<String>) => (
      <Chip label={params.value} sx={{ backgroundColor: params.value === 'Ineligible' ? "#b32123" : "#27ab4d", color: params.value === 'Ineligible' ? "#f6e6e9" : "#e5f5e9" }} icon={params.value === 'Ineligible' ? <WarningIcon sx={{ color: "#f6e6e9 !important" }} /> : <CheckCircleIcon sx={{ color: "#e5f5e9 !important" }} />} />
    )                
    },
    { field: 'Status', headerName: 'Status', flex: 1,
    valueFormatter: (params: GridValueFormatterParams<ReportStatus>) => {
      if (params.value?.ReportStatus == null) {
        return '';
      }

      const valueFormatted = params.value?.ReportStatus;
      return `${valueFormatted}`;
    },

    renderCell: (params: GridRenderCellParams<ReportStatus>) => (
      <Chip label={params.value?.ReportStatus} sx={{ backgroundColor: params.value?.ReportStatus === 'Incomplete' ? "#b32123" : "#27ab4d", color: params.value?.ReportStatus === 'Incomplete' ? "#f6e6e9" : "#e5f5e9" }} icon={params.value?.ReportStatus === 'Incomplete' ? <WarningIcon sx={{ color: "#f6e6e9 !important" }} /> : <CheckCircleIcon sx={{ color: "#e5f5e9 !important" }} />} />
    ) 
    },
    { field: 'User', headerName: 'Entered By', flex: 1,
    valueFormatter: (params: GridValueFormatterParams<User>) => {
      if (params.value == null) {
        return '';
      }

      const valueFormatted = params.value?.firstName + ' ' + params.value?.lastName;
      return `${valueFormatted}`;
    },
    },
  ];

  useEffect(()=>{
    getReportsResp()
  },[])

  const getReportsResp = useCallback(async () => {
    // await getToken()
    const resp = await getReports(user)
    setReports(resp)
  },[])

  // const handleChangePage = (event: unknown, newPage: number) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  return (
    <>
      <Head>
        <title>Income Calculation App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <IncomeAppBar />
      {/* <main className={styles.main}> */}
      <Box sx={{ margin: 2, padding: 1 }}>

        <Typography variant="h4" color="#004d40" ml={3}>Applications</Typography>
       
        {reports && 
        <Box sx={{ height: 600, width: 1600, m: 3 }}>
        
          <DataGrid
          sx={{       
            boxShadow: 3,
            border: 2,
            borderColor: '#80cbc4',
          }}
          rows={reports}
          columns={columns}
          pageSize={pageSize}
          pagination
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10,20,30]}
          onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
            router.push('/reports/'+newSelectionModel[0])
          }}
          selectionModel={selectionModel}
          // onSelectionChange={(newSelectedRow: any) => {
          //   // setSelectedRowID(selectedRow.rowIds[0])}
          //   router.push('/reports/'+newSelectedRow[0])
          //   console.log(newSelectedRow)
          // }}
          // selectionModel={selectedRow}
          // onSelectionModelChange={(newSelectionModel) => {
          //   setSelectionModel(newSelectionModel);
          //   router.push('/reports/'+newSelectionModel[0])
          //   console.log(newSelectionModel)
          // }}
          // keepNonExistentRowsSelected
        />
        </Box>
        }
{/*     
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
              <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Report Date</TableCell>
                  <TableCell>Eligible Start Date</TableCell>
                  <TableCell>Eligible End Date</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Percentage</TableCell>
                  <TableCell>Result</TableCell>
                  <TableCell>Status</TableCell>
              </TableRow>
          </TableHead>
          <TableBody>
            {
            (rowsPerPage > 0
              ? reports?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : reports
            )
            // reports?
            .map((row : Report) => {
              const isItemSelected =  selectedRow.id === row.id;
              return(
                <TableRow 
                  hover
                  onClick={() => setSelectedRow(row)}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell style={{ width: 160 }} >
                    {new Date(row.ReportDate).toLocaleDateString("en-US")}
                  </TableCell>
                  <TableCell style={{ width: 160 }} >
                    {new Date(row.EligibilityStartDate).toLocaleDateString("en-US")}
                  </TableCell>
                  <TableCell style={{ width: 160 }} >
                    {new Date(row.EligibilityEndDate).toLocaleDateString("en-US")}
                  </TableCell>
                  <TableCell style={{ width: 160 }} >
                    {row.total?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </TableCell>
                  <TableCell style={{ width: 160 }} >
                    {row.percentage?.toFixed(2)}%
                  </TableCell>
                  <TableCell style={{ width: 160 }} >
                    <Chip label={row.result} color={row.result === 'Ineligible' ? "error" : "success"} icon={row.result === 'Ineligible' ? <WarningIcon /> : <CheckCircleIcon/>} />
                  </TableCell>
                  <TableCell style={{ width: 160 }} >
                    <Chip label={row.Status?.ReportStatus} color={row.Status?.ReportStatus === 'Incomplete' ? "error" : "success"} icon={row.Status?.ReportStatus === 'Incomplete' ? <WarningIcon /> : <CheckCircleIcon />} />
                  </TableCell>
                </TableRow>
              )
              
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={3}
                count={reports?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                // ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer> */}
       
      {/* </main> */}
      </Box>
      <Image  src="/Eligibee-bee.png"  alt="eligibee" height={300} width={300} style={{ right: 0, position: 'fixed', bottom: 0, }} />

    </>
  )
}
