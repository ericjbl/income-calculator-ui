import { Box, Divider, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { HiOutlineDocumentPlus } from "react-icons/hi2";

interface props {
    title: string
    icon: ReactElement
    route: string
}
const HomeButton = ({ title, icon, route }: props) => {
    const router = useRouter()
    return (
        <Box
            sx={{
                padding: 1,
                borderRadius: 7,
                borderBottom: '3px solid #004d40',
                alignItems: 'center',
                alignContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 3,
                background: '#e0f2f1',
                color:'#004d40',
            }}
            onClick={() => router.push(route)}
        >
            {icon}{/* <HiOutlineDocumentPlus style={{ fontSize: '64px' }} /> */}
            <Divider />
            <Typography>{title}</Typography>
        </Box>
    )
}

export default HomeButton;