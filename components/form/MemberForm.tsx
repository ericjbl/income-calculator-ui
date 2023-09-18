import { 
    TextField,
    Box,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    IconButton,
    Chip,
} from "@mui/material"
import { ItemRole } from "utils/types"
import DeleteIcon from '@mui/icons-material/Delete'
import { generateItemId } from "utils/dataUtil"
import { HiOutlineXCircle } from "react-icons/hi2";
import CloseIcon from '@mui/icons-material/Close';

const MemberForm = ({
    edit = false,
    input,
    index,
    setMembersInput,
    membersInput,
    itemRolesOptions
}: {
    edit?: boolean,
    input: any,
    index: number,
    membersInput: any,
    itemRolesOptions: any
    setMembersInput: (membersInput: any) => void
}) => {
    const removeMember = (index: number) => {
        const data = [...membersInput]
        if(edit && data[index].id !== 0) {
            data[index].delete = true
            setMembersInput(data) 
        }
        else {
            data.splice(index,1)
            setMembersInput(data) 
        }
    }

    const cancelRemoveMember = (index: number) => {
        const data = [...membersInput]
        data[index].delete = false
        setMembersInput(data) 
    }

    const handleItemChange = (index: number, event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        console.log(index, event.target.value)
        let data = [...membersInput]
        data[index].ProofId = generateItemId()
        data[index].Item = event.target.value
        setMembersInput(data) 
    }

    const handleItemUIDChange = (index: number, event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        console.log(index, event.target.value)
        let data = [...membersInput]
        data[index].ItemUID = event.target.value
        setMembersInput(data) 
    }

    const handleItemRoleChange = (index: number, event: SelectChangeEvent) => {
        console.log(index, event.target.name)
        let data = [...membersInput]
        data[index].Role = event.target.value as string
        setMembersInput(data) 
    }

    return (
        <Stack  direction="row" spacing={2} sx={{ mb: 2 }}>
            <>
            <TextField
                id="outlined-name"
                label="Item name"
                value={input.Item}
                onChange={(event) => handleItemChange(index, event)}
            />
            <TextField
                id="outlined-name"
                label="Item uid"
                value={input.ItemUID}
                onChange={(event) => handleItemUIDChange(index, event)}
            />
            <Box sx={{ minWidth: 220 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={input.Role}
                    label="Role"
                    onChange={(event) => handleItemRoleChange(index, event)}
                    >
                        {itemRolesOptions.map((role: ItemRole) => (
                            <MenuItem key={role.id} value={role.id}>{role.ItemRole}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            {input.delete ? 
            <Chip sx={{ backgroundColor: "#b32123", color: "#f6e6e9" }} label="REMOVED" icon={<HiOutlineXCircle color={"#f6e6e9"} fontSize={"32px"} onClick={() => cancelRemoveMember(index)}/>}></Chip> :
            <IconButton disabled={edit ? !edit : membersInput.length === 1} onClick={() => removeMember(index)}>
                <DeleteIcon fontSize="medium" />
            </IconButton>}
            {/* <IconButton disabled={edit ? !edit : membersInput.length === 1} onClick={() => removeMember(index)}>
                <DeleteIcon fontSize="medium" />
            </IconButton> */}
            </>
        </Stack>
    )
}

export default MemberForm