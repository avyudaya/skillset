import { Center, CircularProgress } from "@chakra-ui/react";

export default function Loading(){
    return (
        <Center height="90vh" margin="auto" width="90vw">
            <CircularProgress isIndeterminate />
        </Center>
    )
    
}