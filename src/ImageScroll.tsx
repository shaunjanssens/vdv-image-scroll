import styled, {css} from "styled-components";
import React, {useEffect, useRef, useState, useCallback} from "react";

const mediaList = [
    {type: 'image', src: '/images/1.png'},
    {type: 'video', src: '/images/video.png', video: '/images/video.mp4'},
    {type: 'image', src: '/images/2.png'},
    {type: 'image', src: '/images/3.png'},
    {type: 'image', src: '/images/4.png'},
    {type: 'image', src: '/images/5.png'},
    {type: 'image', src: '/images/6.png'},
]

const thumbnailsHeight = "20vh";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr;
  height: 100vh;
  overflow: hidden;
  grid-gap: 4px;
`

const Thumbnails = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 100vh;
  scroll-snap-type: y mandatory;
  gap: 4px;

  &::-webkit-scrollbar {
    display: none;
  }
`

const Thumbnail = styled.div<{isActive: boolean;}>`
  flex: 0 0 ${thumbnailsHeight};
  height: ${thumbnailsHeight};
  scroll-snap-align: start;
  overflow: hidden;
  opacity: .6;
  transition: opacity .2s;
  cursor: pointer;
  
  img {
    width: 100%;
    height: ${thumbnailsHeight};
    object-fit: cover;
    object-position: center;
  }
  
  ${({isActive}) => isActive && css`opacity: 1`}
`

const Images = styled.div`
  overflow: scroll;
  scroll-snap-type: y mandatory;

  &::-webkit-scrollbar {
    display: none;
  }
`

const Image = styled.div`
  scroll-snap-align: start;
  
  img, video {
    width: 100%;
    height: 100vh;
    object-fit: cover;
    object-position: center;
  }
`

const ImageScroll = () => {
    const mediaListRef = useRef<HTMLDivElement | null>(null)
    const thumbnailRef = useRef<Array<HTMLDivElement | null>>([])
    const imageRef = useRef<Array<HTMLDivElement | null>>([])

    const [isHoverImageList, setIsHoverImageList] = useState(false)
    const [selectedImage, setSelectedImage] = useState<number>(0)

    const handleClickThumbnail = useCallback((index: number) => {
        imageRef.current[index]?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
    }, [])

    useEffect(() => {
        mediaListRef.current?.addEventListener('mouseenter', () => {
           setIsHoverImageList(true)
        })

        mediaListRef.current?.addEventListener('mouseleave', () => {
            setIsHoverImageList(false)
        })

        mediaListRef.current?.addEventListener("scroll", (event: any) => {
            const {scrollTop, clientHeight} = event.target
            const index = Math.ceil(scrollTop / clientHeight)
            setSelectedImage(index)

            if (isHoverImageList) {
                thumbnailRef.current[index]?.scrollIntoView({block: "end", inline: "nearest"})
            }
        })
    }, [isHoverImageList]);

    return (
        <>
        <Container>
            <Thumbnails>
                {mediaList.map(({type, src, video}, index) => (
                    <Thumbnail
                        key={`${src}-thumb`}
                        ref={ref => thumbnailRef.current[index] = ref}
                        isActive={index === selectedImage}
                        onClick={() => handleClickThumbnail(index)}
                    >
                        <img src={src} alt=""/>
                    </Thumbnail>
                ))}
            </Thumbnails>
            <Images ref={mediaListRef}>
                {mediaList.map(({type, src, video}, index) => (
                    <Image
                        key={src}
                        ref={ref => imageRef.current[index] = ref}
                    >
                        {type === 'image' && <img src={src} alt=""/>}
                        {type === 'video' && (
                            <video autoPlay muted loop>
                                <source src={video} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </Image>
                ))}
            </Images>
        </Container>
        </>
    )
}

export default ImageScroll