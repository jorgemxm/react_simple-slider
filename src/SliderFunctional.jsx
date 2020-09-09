import React, { useEffect, useReducer, useRef } from 'react';
import { Arrow, Dots, Slide, StyledSlider, StyledWrapper } from './StyledComponents';
import { slidesData } from './mockData';

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
