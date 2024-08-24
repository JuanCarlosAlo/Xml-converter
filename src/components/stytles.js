import { styled } from "styled-components";
import { COLORS } from "../constants/COLORS";

const StyledHeader = styled.header`
position: fixed;
background-color: ${COLORS.SECONDARY};
width: 100%;
padding: 2rem;
text-align: center;
color:  ${COLORS.MAIN};
`

export{StyledHeader}