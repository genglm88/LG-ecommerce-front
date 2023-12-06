import Image from "next/image"
import React, { useContext, useEffect, useRef, useState } from "react"
import styled, { css } from "styled-components"
import { ButtonPrimary, ButtonStyle } from "./PrimaryBtn"
import CartIcon from "./icons/CartIcon"
import ButtonLink from "./ButtonLink"
import Link from "next/link"
import { CartContext } from "./CartContext"
import StyledButton from "./ButtonStyle"
import HeartIcon from "./icons/HeartIcon"
import axios from "axios"
//import FlyingButton from "react-flying-item"

const ProductWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
  svg {
    width: 30px;
  }
`

const Box = styled(Link)`
  display: flex;

  background-color: #fff;
  padding: 0px;
  img {
    width: 100%;
    height: 480px;
    object-fit: cover;
    border-radius: 5px;
  }

  @media screen and (min-width: 480px) {
    img {
      height: 150px;
    }
  }

  @media screen and (min-width: 768px) {
    img {
      height: 150px;
    }
  }
`

const Heart = styled.button`
  position: absolute;
  top: 3%;
  left: 70%;
  z-axis: 1;
  border: 0;
  background-color: transparent;
  cursor: pointer;
`

const Bigbox = styled.div`
  display: flex;

  gap: 10px;
  background-color: #fff;
  padding: 0px;
  img {
    width: 360px;
    height: 360px;
    object-fit: cover;
    border-radius: 5px;
  }
  @media screen and (min-width: 480px) {
    img {
      width: 480px;
      height: 480px;
    }
  }
`

const ImageDis = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap:wrap;
  gap: 10px;
  img {
    wdith: 100%;
    max-height: 80px;
    object-fit: cover;
    border-radius: 2px;
    cursor: pointer;
  
`
const ImageButton = styled.div`
  border:4px solid #ccc;
 ${(props) =>
   props.active
     ? `border-color:#ccc;`
     : `border-color:transparent;opacity:0.8;`}
    wdith: 100%;
    max-height: 80px;
    object-fit: cover;
    border-radius: 5px;
   
    cursor: pointer;
  }
`

const Title = styled(Link)`
  font-weight: normal;
  font-size: 0.9rem;
  margin: 0;
  color: inherit;
  text-decoration: none;
`

const ProductInfoBox = styled.div`
  margin-top: 5px;
`

const PriceRow = styled.div`
  margin-top: 3px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Price = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
`
const StyledFlyingButton = styled.div`
  @keyframes flyButton {
    100% {
      top: 0;
      left: 65%;
      opacity: 0;
      display: none;
      max-width: 50px;
      max-height: 50px;
    }
  }

  img {
    display: none;
    // doesn't work if not none
    max-width: 150px;
    max-height: 150px;
    opacity: 1;
    position: fixed;
    z-index: 5;
    animation: flyButton 1s;
  }

  // @keyframes fly {
  //   100% {
  //     top: 0;
  //     left: 65%;
  //     opacity: 0;
  //     display: none;
  //     max-width: 50px;
  //     max-height: 50px;
  //   }
  // }
  // img {
  //   display: none;
  //   max-width: 100px;
  //   max-height: 100px;
  //   opacity: 1;
  //   position: fixed;
  //   z-index: 5;
  //   animation: fly 1s;
  //   border-radius: 10px;
  // }

  svg {
    color: blue;
  }

  button {
    border: 0;
    background-color: #fff;
  }
`

const ProductBox = ({
  product,
  liked,
  removeUnlikedProducts = () => {},
  detail = false,
}) => {
  const [mainImgIdx, setMainImgIdx] = useState(0)
  const { _id, title, desccription, price, images } = product
  const url = "/product/" + _id
  const { addProduct } = useContext(CartContext)
  const imgRef = useRef()
  const [like, setLike] = useState(liked)

  //for animation
  const sendImageToCart = (ev) => {
    //console.log(ev)
    imgRef.current.style.display = "inline-block"
    //the current position of the image
    imgRef.current.style.left = ev.clientX - 150 + "px"
    imgRef.current.style.top = ev.clientY - 150 + "px"
    //to hide image after animation is done -wait 1s
    setTimeout(() => {
      imgRef.current.style.display = "none"
    }, 1000)
    //console.log({ ev, imageSrc })
    //the parent has a transformation, needs to be turned off after the animation is done.
  }

  const handleLike = async (e) => {
    e.preventDefault()
    e.stopPropagation() // prevent click to trigger the link funtion
    const updatedLike = !like
    removeUnlikedProducts(_id)
    //console.log("removedId  " + _id)

    try {
      //console.log({product})
      await axios.post("/api/likedProduct", { product: _id })
      setLike(updatedLike)
    } catch (err) {
      "error accessing like API", err
    }
    
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const isImageshown = imgRef.current?.closest("div[data-sr-id]")
      //console.log(isImageshown)
      if (isImageshown?.style.opacity === "1") {
        //visible
        isImageshown.style.transform = "none"
        clearInterval(interval)
      }
    }, 100)
    //return () => clearInterval(interval)
  }, [])

  return (
    <ProductWrapper>
      {detail ? (
        <>
          <Bigbox>
            <img src={images[mainImgIdx]} alt="" />
          </Bigbox>
          <ImageDis>
            {images?.map((image, index) => (
              <ImageButton key={index} active={index === mainImgIdx}>
                <img src={image} onClick={() => setMainImgIdx(index)} alt="" />
              </ImageButton>
            ))}
          </ImageDis>
        </>
      ) : (
        <Box href={url}>
          <img src={images[0]} alt="" />
        </Box>
      )}

      <ProductInfoBox>
        <Title href={url}>{title}</Title>
        <PriceRow>
          <Price>${price}</Price>
          <StyledFlyingButton>
            <StyledButton
              primary={1}
              outline={1}
              onClick={() => addProduct(_id)}
            >
              <img src={images[mainImgIdx]} alt="" ref={imgRef} />

              <button onClick={(ev) => sendImageToCart(ev)}>
                <CartIcon />
              </button>
            </StyledButton>
          </StyledFlyingButton>
        </PriceRow>
      </ProductInfoBox>
      <Heart onClick={handleLike}>
        <HeartIcon like={like} />
      </Heart>
    </ProductWrapper>
  )
}

export default ProductBox
