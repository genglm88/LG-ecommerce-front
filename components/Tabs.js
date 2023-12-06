import { Cursor } from "mongoose"
import React from "react"
import styled from "styled-components"

const StyledTabs = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 20px;
`

const StyledTab = styled.h2`
  ${(props) =>
    props.active
      ? `color:#000;cursor: pointer; border-bottom:2px solid #aaa`
      : `color:#ccc;cursor: pointer;`}
`

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <StyledTabs>
      {tabs.map((tab, index) => (
        <StyledTab
          active={tab === activeTab}
          onClick={() => setActiveTab(tab)}
          key={index}
        >
          {tab}
        </StyledTab>
      ))}
    </StyledTabs>
  )
}

export default Tabs
