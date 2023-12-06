import Center from "@/components/Center"
import Header from "@/components/Header"
import InputPrimary from "@/components/InputPrimary"
import { ProductsGrid, Title } from "@/components/NewProducts"
import ProductBox from "@/components/ProductBox"
import Spinner from "@/components/Spinner"
import axios from "axios"
import { debounce } from "lodash"
import { RevealWrapper } from "next-reveal"
import React, { useCallback, useEffect, useRef, useState } from "react"
import styled from "styled-components"

const SearchInput = styled(InputPrimary)`
  font-size: 1.2rem;
  margin: 25px 0;
`

const InputWrapper = styled.div`
  position: sticky;
  top: 62px;

  z-index: 15;
  background-color: #jjj;
  @media screen and (min-width: 768px) {
    top: 42px;
  }
`

const SearchPage = () => {
  const [phrase, setPhrase] = useState("")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const searchProducts = async (phrase) => {
    const { data } = await axios.get(
      "/api/products?phrase=" + encodeURIComponent(phrase)
      // "/api/products?phrase=" + phrase
    )

    setProducts(data)
    setLoading(false)
  }

  const debounceSearch = useCallback(
    //debounce((phrase) => searchProducts(phrase), 500),
    debounce(searchProducts, 500),
    []
  )

  useEffect(() => {
    const searchPhases = async () => {
      try {
        debounceSearch(phrase)
      } catch (err) {
        console.error("axios error", err)
      }
    }

    if (phrase.length > 0) {
      setLoading(true)
      searchPhases()
    } else {
      setProducts([])
    }
  }, [phrase])

  return (
    <div>
      <Header />
      <Center>
        <InputWrapper>
          <SearchInput
            autoFocus
            placeholder={"Product search ..."}
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
          />
        </InputWrapper>

        {loading ? (
          <Spinner fullWidth />
        ) : products.length > 0 ? (
          <ProductsGrid>
            {products.map((product, index) => {
              return (
                <RevealWrapper key={index} delay={index * 60}>
                  <ProductBox product={product} />
                </RevealWrapper>
              )
            })}
          </ProductsGrid>
        ) : phrase.length > 0 ? (
          // eslint-disable-next-line react/no-unescaped-entities
          <Title>Sorry, no products found for "{phrase}". </Title>
        ) : (
          <Title></Title>
        )}
      </Center>
    </div>
  )
}

export default SearchPage
