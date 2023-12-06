import React from "react"
import styled from "styled-components"
import ProductBox from "./ProductBox"
import ButtonLink from "./ButtonLink"
import { RevealWrapper } from "next-reveal"

export const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  padding-top: 0px;
  @media screen and (min-width: 480px) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`

export const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 20px 0 20px;
`

export const BoxTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 60px 0 20px;
`

const ShowAll = styled.div`
  display: flex;
  gap: 20px;
  svg {
    max-height: 30px;
  }
  align-items: center;
  h2 {
    font-size: 2rem;
    font-weight: 700;
  }
  margin: 40px 0 0 0;
`

const NewProducts = ({
  newProducts,
  allLikedProducts,
  removeUnlikedProducts=()=>{},
  displayTitle,
  showAll = false,
  url = "",
}) => {
  return (
    <>
      {showAll ? (
        <ShowAll>
          <h2>{displayTitle}</h2>
          <ButtonLink showall href={url}>
            <p>ShowAll</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-1 h-1"
            >
              <path
                fillRule="evenodd"
                d="M10.21 14.77a.75.75 0 01.02-1.06L14.168 10 10.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M4.21 14.77a.75.75 0 01.02-1.06L8.168 10 4.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </ButtonLink>
        </ShowAll>
      ) : (
        <BoxTitle>{displayTitle}</BoxTitle>
      )}

      <ProductsGrid>
        {newProducts?.length > 0 &&
          newProducts.map((product, index) => {
            return (
              <RevealWrapper key={index} delay={index * 50}>
                <ProductBox
                  product={product}
                  liked={allLikedProducts?.includes(product._id.toString())}
                  removeUnlikedProducts= { removeUnlikedProducts}
                />
              </RevealWrapper>
            )
          })}
      </ProductsGrid>
    </>
  )
}

export default NewProducts
