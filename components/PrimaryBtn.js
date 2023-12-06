import React from "react"
import styled, { css } from "styled-components"

export const ButtonStyle = css`

  background-color: #5542f6;

  border: 0;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  

  svg {
    height: 16px;
    margin-right: 5px;
  }

  ${(props)=> props.block && css`
  display: block;
  width: 100%;
  `}
  
  ${(props) =>
    props.white &&
    !props.outline &&
    css`
      background-color: #fff;
      color: #000;
    `}

  ${(props) => props.light && !props.outline && css`
  background-color: #e8effc ;
      color: #1241a1;
      border: 1px solid #fff;
      padding: 5px 2px;
  `}

  ${(props) => props.showall && !props.outline && css`
  background-color: transparent ;
      color: #1241a1;
      font-weight:bold;
      border: none;
      padding: 0;
  `}
  

    ${(props) =>
    props.white &&
    props.outline &&
    css`
      background-color: transparent;
      color: #fff;
      border: 1px solid #fff;
    `}

    ${(props) =>
      props.white &&
      !props.outline &&
      css`
        background-color: transparent;
        color: #fff;
        border: 0;
      `}

  ${(props) =>
    props.primary && !props.outline &&
    css`
      background-color: #5542f6;
      color: #fff;
      border: 2px solid #5542f6;
    `}
      

    ${(props) =>
      props.primary && props.outline &&
      css`
        background-color: transparent;
        color: #5542f6;
        border: 1px solid #5542f6;
      `}

      ${(props) =>
        props.primary && props.outline && props.yellow &&
        css`
          background-color: #FFD000;
          color: #000;
          border: none;
        `}

        ${(props) =>
          props.primary && props.outline && props.black &&
          css`
            background-color: transparent;
            color: #000;
            border: 1px solid #ccc;
          `}

  ${(props) =>
    props.size === "l" &&
    css`
      font-size: 1.2rem;
      padding: 10px 16px;
      svg {
        height: 20px;
      }
    `}
`

export const ButtonPrimary = styled.button`
  ${ButtonStyle}
`

const PrimaryBtn = ({ children, ...rest }) => {
  return <ButtonPrimary {...rest}>{children}</ButtonPrimary>
}

export default PrimaryBtn
