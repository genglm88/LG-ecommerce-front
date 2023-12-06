import React, { useState } from "react"
import StarOutline from "./icons/StarOutline"
import StarSolid from "./icons/StarSolid"
import styled from "styled-components"

const StarRow = styled.div`
  ${(props) => props.size === "md" && `font-size: 1.1rem;`}
  ${(props) => props.size === "sm" && `font-size: 0.8rem;`}
  display: flex;
  align-items: center;
  gap: 1px;
`
const StarWrapper = styled.button`
  ${(props) =>
    props.size === "md" &&
    `height: 1.3rem;
    width: 1.3rem;`}
  ${(props) =>
    props.size === "sm" &&
    `height: 1rem;
    width: 1rem;
    color: #FFD700;`}
  
    ${(props) =>
    !props.disabled &&
    `
    cursor: pointer;
    `}
  padding: 0;

  background: transparent;
  border: 0;
`
const StarsRating = ({
  numStars = 0,
  setNumStars,
  disabled = false,
  size = "md",
}) => {
  const five = [1, 2, 3, 4, 5]

  const changeStar = (index, disabled) => {
    if (disabled) return
setNumStars(index)
    // if (numStars > index - 1) {
    //   setNumStars((prev) => prev - 1)
    // } else {
    //   setNumStars((prev) => prev + 1)
    // }
  }

  return (
    <StarRow size={size}>
      {five.map((index) => (
        <StarWrapper
          key={index}
          size={size}
          disabled={disabled}
          onClick={() => changeStar(index, disabled, setNumStars)}
        >
          {numStars > index - 1 ? <StarSolid /> : <StarOutline />}
        </StarWrapper>
      ))}
    </StarRow>
  )
}

export default StarsRating
