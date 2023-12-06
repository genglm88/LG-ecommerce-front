import React from 'react'
import { ButtonStyle } from './PrimaryBtn'
import styled  from 'styled-components'

const StyButton = styled.div`
${ButtonStyle}
`

const StyledButton = (props) => {
  return (
    <StyButton {...props} />
  )
}

export default StyledButton