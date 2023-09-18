import { HiOutlineDocumentPlus, HiOutlineDocumentMagnifyingGlass } from "react-icons/hi2";
import { Container, Stack, Box } from "@mui/material";
import IncomeAppBar from "components/IncomeAppBar";
import React from "react";
import HomeButton from "components/HomeButton";
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { useAuth } from "providers/AuthProvider";
import Image from "next/image";

const Home = () => {
    const { user } = useAuth()
    return(
        <>
        <IncomeAppBar />
        <Box  
            // direction="row"
            // spacing={1}
            sx={{   
                margin: 2,  
                display: 'flex'  
                // boxShadow: 3,
                // border: 2,
                // borderColor: '#80cbc4',
            }}
        >
            <Stack direction="row" spacing={3} p={3} >
                <HomeButton title="New Application" icon={ <HiOutlineDocumentPlus style={{ fontSize: '64px' }} />} route="/reports/add" />
                <HomeButton title="My Applications" icon={ <HiOutlineDocumentMagnifyingGlass style={{ fontSize: '64px' }} />} route="/reports/" />
                {user.roles.role === 'Admin' && <HomeButton title="Admin Portal" icon={ <SupervisorAccountIcon style={{ fontSize: '64px' }} />} route="/admin" />}
            </Stack>
        </Box>
        <Image  src="/Eligibee-bee.png"  alt="eligibee" height={300} width={300} style={{ right: 0, position: 'fixed', bottom: 0, }} />

    
        </>
    )
}

export default  Home;