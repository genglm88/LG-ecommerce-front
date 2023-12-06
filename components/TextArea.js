import React from "react"
import styled from "styled-components"

const StyledInput = styled.textarea`
  width: 100%;
  height: 100%;
  padding: 5px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing:boder-box;
  font-family:inherit;
`

const TextArea = (props) => {
  return <StyledInput {...props} />
}

export default TextArea
