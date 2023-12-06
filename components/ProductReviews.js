import React, { useEffect, useState } from "react"
import styled from "styled-components"
import StarsRating from "./StarsRating"
import InputPrimary from "./InputPrimary"
import TextArea from "./TextArea"
import { ButtonPrimary } from "./PrimaryBtn"
import axios from "axios"
import Spinner from "./Spinner"
import { RevealWrapper } from "next-reveal"

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 5px;
`
const SubTitle = styled.h3`
  font-size: 1.2rem;
  color: #666;
`

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap:40px;
  }
`

const StyledSmallNoteposted = styled.div`
  font-size: 0.8rem;
  color: #aaa;
  text-align: right;
`
const StyledSmallDesc = styled.div`
  font-size: 0.9rem;
  color: #777;
 
`
const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const ReviewTitle = styled.div`
font-weigth:bold;
font-size: 1rem;
`
const ReviewWrapper = styled.div`
display: flex;
flex-direction: column;
gap: 5px;
margin-bottom: 20px;
margin-top: 10px;
`

const ProductReviews = ({ product }) => {
  const [numStars, setNumStars] = useState(0)
  const [userReview, setUserReview] = useState({
    title: "",
    reviewContent: "",
  })
  const { title, reviewContent } = userReview
  const [postedReviews, setPostedReviews] = useState([])
  const productItem = { ...product[0] }
  const [isloading, setIsloading] = useState(false)

  const fetchAllreviews = async () => {
    try {
      const { data } = await axios.get(
        "/api/productReview?product=" + productItem._id
      )
      setIsloading(false)
      setPostedReviews(data)
    } catch (err) {
      console.error("Error fetching reviews.", err)
    }
  }
  
  useEffect(() => {
    
    setIsloading(true)
    fetchAllreviews()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserReview((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post("/api/productReview", {
        product: productItem._id,
        numStars,
        title,
        reviewContent,
      })
      setUserReview({ title: "", reviewContent: "" })
      setNumStars(0)
      setIsloading(true)
    fetchAllreviews()
    } catch (err) {
      console.error("Error posting reviews.", err)
    }
  }

  return (
    <div>
      <Title>Reviews</Title>
      <ColsWrapper>
        <div>
          <SubTitle>Add a review</SubTitle>
          <ReviewWrapper>
          <StarsRating numStars={numStars} setNumStars={setNumStars} />
          <form onSubmit={handleSubmit}>
            <InputPrimary
              type="text"
              name="title"
              value={title}
              placeholder="Ttile"
              onChange={handleChange}
            />
            <TextArea
              type="text"
              name="reviewContent"
              value={reviewContent}
              onChange={handleChange}
            />
            <ButtonPrimary type="submit" primary>
              Submit your review
            </ButtonPrimary>
          </form>
          </ReviewWrapper>

        </div>
        <div>
          <SubTitle>All reviews</SubTitle>
          {isloading ? (
            <Spinner fullWidth={true} />
          ) : postedReviews.length > 0 ? (
            postedReviews.map((review, index) => (
              <RevealWrapper key={review._id} delay={index * 50}>
                <ReviewWrapper>
                <ReviewHeader>
                  <StarsRating
                    numStars={review.numStars}
                    setNumStars={setNumStars}
                    disabled={1}
                    size="sm"
                  />
                  <StyledSmallNoteposted>
                    Posted at :{" "}
                    <time>
                      {new Date(review.createdAt).toLocaleString("sv-US")}
                    </time>
                  </StyledSmallNoteposted>
                </ReviewHeader>

                <ReviewTitle>
                {review.title}
                  </ReviewTitle>

                <StyledSmallDesc>{review.reviewContent}</StyledSmallDesc>

                
                </ReviewWrapper>
                <hr />
              </RevealWrapper>
            ))
          ) : (
            <p>No reviews :(</p>
          )}
        </div>
      </ColsWrapper>
    </div>
  )
}

export default ProductReviews
