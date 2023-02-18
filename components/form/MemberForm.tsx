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
} from "@mui/material"
import { ItemRole } from "utils/types"
import DeleteIcon from '@mui/icons-material/Delete'
import { generateItemId } from "utils/dataUtil"

const MemberForm = ({
    input,
    index,
    setMembersInput,
    membersInput,
    itemRolesOptions
}: {
    input: any,
    index: number,
    membersInput: any,
    itemRolesOptions: any
    setMembersInput: (membersInput: any) => void
}) => {
    const removeMember = (index: number) => {
        const data = [...membersInput]
        data.splice(index,1)
        setMembersInput(data) 
    }

    const handleItemChange = (index: number, event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        console.log(index, event.target.value)
        let data = [...membersInput]
        data[index].ProofId = generateItemId()
        data[index].Item = event.target.value
        setMembersInput(data) 
    }

    const handleItemRoleChange = (index: number, event: SelectChangeEvent) => {
        console.log(index, event.target.name)
        let data = [...membersInput]
        data[index].Role = event.target.value as string
        setMembersInput(data) 
    }

    return (
        <Stack direction="row" spacing={2} key={index} sx={{ mb: 2 }}>
            <TextField
                id="outlined-name"
                label="Item name"
                value={input.Item}
                onChange={(event) => handleItemChange(index, event)}
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
            <IconButton disabled={membersInput.length === 1} onClick={() => removeMember(index)}>
                <DeleteIcon fontSize="medium" />
            </IconButton>
        </Stack>

    )
}

export default MemberForm