import React, { useContext, useState } from "react"
import styled from "styled-components"
import Center from "./Center"
import Link from "next/link"
import { CartContext } from "./CartContext"
import BarsIcon from "./icons/BarsIcon"

import StyledButton from "./ButtonStyle"
import { useSession } from "next-auth/react"
import SearchIcon from "./icons/SearchIcon"

const StyledHeader = styled.header`
  background-color: #222;
  position: sticky;
  top: 0;
  z-index: 10;
`

const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
  z-index: 3;
`
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  align-items: center;
`

const StyledNav = styled.nav`
  ${(props) => (props.mobileNavActive ? ` display: block;` : `display:none;`)}
  gap: 15px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 50px 20px 20px;
  background-color: #222;
  opacity: 0.9;
  @media screen and (min-width: 768px) {
    display: flex;
    position: static;
    padding: 0;
  }
`

const NavLink = styled(Link)`
  display: block;
  color: #eee;
  text-decoration: none;
  padding: 10px 0;
  @media screen and (min-width: 768px) {
    padding: 0;
  }
`

const NavButton = styled.button`
  background-color: transparent;
  width: 30px;
  height: 30px;
  border: 0;
  color: #aaa;
  cursor: pointer;
  position: relative;
  z-index: 3;
  @media screen and (min-width: 768px) {
    display: none;
  }
`

const SideIcons = styled.div`
  display: flex;
  align-items: center;
`

const Header = () => {
  const {data:session} = useSession()
  const { cartProducts } = useContext(CartContext)
  const [mobileNavActive, setMobileNavActive] = useState(false)
  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href={"/"}>Ecommerce</Logo>
          <StyledNav mobileNavActive={mobileNavActive}>
            <NavLink href={"/"}>Home</NavLink>
            <NavLink href={"/products"}>All products</NavLink>
            <NavLink href={"/categories"}>Categories</NavLink>
            <NavLink href={"/account"}>Account</NavLink>
            <NavLink href={"/cart"}>Cart ({session? cartProducts.length:0})</NavLink>
          </StyledNav>
          <SideIcons>
            <NavLink href={"/search"}>
              <StyledButton white={1}>
                <SearchIcon />
              </StyledButton>
            </NavLink>
            <NavButton onClick={() => setMobileNavActive((prev) => !prev)}>
              <BarsIcon />
            </NavButton>
          </SideIcons>
        </Wrapper>
      </Center>
    </StyledHeader>
  )
}

export default Header
