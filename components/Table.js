import styled from "styled-components"

const StyledTable = styled.table`
width: 100%;
th{
    text-align: left;
    text-transform: uppercase;
    color: #aaa;
    font-weight: 600;
}
td{
    border-top: 1px solid white;
}

`

export default function Table(props) {
  return <StyledTable {...props} />
}
