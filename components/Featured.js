import React, { useContext } from "react"
import styled from "styled-components"
import Center from "./Center"
import ButtonLink from "./ButtonLink"
import CartIcon from "./icons/CartIcon"
import { CartContext } from "./CartContext"
import { RevealWrapper } from "next-reveal"

const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 3rem;
  @media screen and (min-width: 768px) {
    font-size: 3rem;
  }
`

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`
const Desc = styled.p`
  color: #aaa;
  font-size: 0.8rem;
`

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;

  gap: 40px;
  grid-item {
    margin: auto;
  }
  img {
    max-width: 100%;
    object-fit: cover;
    border-radius:5px;
  }
  div:nth-child(1) {
    order: 1;
  }
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr 1fr;
    div:nth-child(1) {
      order: 0;
    }
  }
`

const ContentDiv = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap:10px;
`

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 15px;
`

const Column = styled.div`
  display: flex;
  align-items: center;
`

const Featured = ({ featuredProduct }) => {
  const { title, description, images, _id } = featuredProduct

  const { addProduct } = useContext(CartContext)

  return (
    <Bg>
      <Center>
        <ColumnsWrapper>
          <RevealWrapper duration={200} origin="left">
            <ContentDiv>
              <Title> {title}</Title>
              <Desc>{description}</Desc>
              <ButtonsWrapper>
                <ButtonLink href={"/product/" + _id} outline={1} white>
                  Read more
                </ButtonLink>
                <ButtonLink
                  href={""}
                  primary={1}
                  onClick={() => addProduct(_id)}
                >
                  <CartIcon />
                  Add to cart
                </ButtonLink>
              </ButtonsWrapper>
            </ContentDiv>
          </RevealWrapper>
          <RevealWrapper duration={200}>
            <Column>
              <img src={images[0]} alt="" />
            </Column>
          </RevealWrapper>
        </ColumnsWrapper>
      </Center>
    </Bg>
  )
}

export default Featured
