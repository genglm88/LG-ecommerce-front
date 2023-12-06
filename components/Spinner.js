import React from "react"
import { BeatLoader } from "react-spinners"
import {BounceLoader} from "react-spinners";
import styled from "styled-components"

const SpinnerWrapper = styled.div`
  ${props =>props.fullWidth
      ? `

        display: flex;
        justify-content: center;

      `: `
border: 5px solid blue;
`}
`



const Spinner = ({ fullWidth }) => {
  return (
    <SpinnerWrapper fullWidth={fullWidth}>
      <BeatLoader speedMultiplier={1} color="#36d7b7" /> 
      {/* <BounceLoader speedMultiplier={3} color={'#555'} /> */}
    </SpinnerWrapper>
  )
}

export default Spinner