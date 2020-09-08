import React, { useEffect, useReducer, useRef } from 'react';
import styled from "styled-components";
import { slidesData } from './mockData';

export const StyledWrapper = styled.div`
position: relative;
height: 100vh;
width: 100vw;
margin: 0 auto;
overflow: hidden;
`;

export const StyledSlider = styled.div`
transform: translateX(-${props => props.translate}px);
transition: transform ease-out ${props => props.transition}s;
height: 100%;
width: ${props => props.width}px;
display: flex;
`;

const StyledSlide = styled.div`
flex: 0 0 100%;
height: 100%;
width: 100%;
background-image: url('${props => props.content}');
background-size: cover;
background-repeat: no-repeat;
background-position: center;
`

const StyledArrow = styled.div`
color: black;
display: flex;
position: absolute;
top: 50%;
${props => props.direction === 'right' ? `right: 25px` : `left: 25px`};
height: 50px;
width: 50px;
justify-content: center;
background: white;
border-radius: 50%;
cursor: pointer;
align-items: center;
transition: transform ease-in 0.1s;
&:hover {
  transform: scale(1.1);
}
img {
  transform: translateX(${props => props.direction === 'left' ? '-2' : '2'}px);
  &:focus {
    outline: 0;
  }
}`;

const Dot = styled.div`
padding: 10px;
margin-right: 5px;
cursor: pointer;
border-radius: 50%;
background: ${props => props.active ? 'black' : 'white'};
`;

const StyledDots = styled.div`
position: absolute;
bottom: 25px;
width: 100%;
display: flex;
align-items: center;
justify-content: center;
`;

const Slide = ({ content }) => <StyledSlide content={content} />

const Dots = ({ activeIndex, handleClick }) => (
  <StyledDots>
    {slidesData.map((slide, i) => (
      <Dot key={slide} active={activeIndex === i} onClick={() => handleClick(i)} />
    ))}
  </StyledDots>
)

const Arrow = ({ direction, handleClick }) =>
  <StyledArrow direction={direction} onClick={handleClick}>{direction === "left" ? "<" : ">"}</StyledArrow>;

const getWidth = () => window.innerWidth


/**
 * Slider component
 * @param {number} autoPlayTimer -
 * @returns {JSX.Element}
 */
function Slider({ autoPlayTimer }) {
  const [ state, setState ] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      activeIndex: 0,
      translate: 0,
      transition: 0.5,
      slides: []
    }
  )

  const { activeIndex, slides, translate, transition } = state;

  const interval = useRef()
  const createSlidesRef = useRef()
  const nextSlideRef = useRef()
  const autoPlayTimerRef = useRef(autoPlayTimer)

  useEffect(() => {
    nextSlideRef.current = goNextSlide
    createSlidesRef.current = onCreateSlides
  })

  useEffect(() => {
    const nextSlide = () => { nextSlideRef.current() }
    const createSlides = () => { createSlidesRef.current() }
    createSlides()

    interval.current = setInterval(nextSlide, autoPlayTimerRef.current);
    const listener = window.addEventListener('transitionend', createSlides)

    return () => {
      clearInterval(interval)
      window.removeEventListener('transitionend', listener)
    }
  }, [])


  useEffect(() => {
    transition === 0 && setState({ transition: 0.5 })
  }, [transition])


  function goPrevSlide() {
    const index = activeIndex === 0
      ? slidesData.length - 1
      : activeIndex - 1

    setState({
      activeIndex: index,
      translate: 0
    })
  }


  function goNextSlide() {
    const index = activeIndex === slidesData.length - 1
      ? 0
      : activeIndex + 1

    setState({
      activeIndex: index,
      translate: translate + getWidth()
    })
  }


  function gotoToSlide(slideIdx) {
    setState({
      activeIndex: slideIdx,
      translate: slideIdx * getWidth()
    })
  }


  function onCreateSlides() {
    let images = [];

    if (activeIndex === slidesData.length - 1) {
      images = [slidesData[slidesData.length - 2], slidesData[slidesData.length - 1], slidesData[0]];
    } else if (activeIndex === 0) {
      images = [slidesData[slidesData.length - 1], slidesData[0], slidesData[1]];
    } else {
      images = slidesData.slice(activeIndex - 1, activeIndex + 2)
    }

    setState({
      slides: images,
      transition: 0,
      translate: getWidth()
    })
  }


  return (
    <StyledWrapper>
      <StyledSlider
        translate={translate}
        transition={transition}
        width={getWidth()}
      >
        {slides.map((slide, i) => (
          <Slide key={slide + i} content={slide} />
        ))}
      </StyledSlider>

      <Arrow direction="left" handleClick={() => { clearInterval(interval.current); goPrevSlide(); }} />
      <Arrow direction="right" handleClick={() => { clearInterval(interval.current); goNextSlide(); }} />

      <Dots activeIndex={activeIndex} handleClick={gotoToSlide} />
    </StyledWrapper>
  );
}

Slider.defaultProps = {
  autoPlayTimer: 2000
}

export default Slider
