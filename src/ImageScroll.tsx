import styled, {css} from "styled-components";
import React, {useEffect, useRef, useState, UIEvent, useCallback} from "react";

const imageList = [
    'https://images.unsplash.com/photo-1458312732998-763933ed4896',
    'https://images.unsplash.com/photo-1515031245064-22453e134337',
    'https://images.unsplash.com/photo-1542850802-8a047a726d4e',
    'https://images.unsplash.com/photo-1540365118882-946449a2ce17',
    'https://images.unsplash.com/photo-1541772995526-c5bcdbd5307f',
    'https://images.unsplash.com/photo-1553955023-75b1347c6c0f',
    'https://images.unsplash.com/photo-1593929999438-ce13d4544a1f'
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
  
  img {
    width: 100%;
    height: 100vh;
    object-fit: cover;
    object-position: center;
  }
`

const ImageScroll = () => {
    const imageListRef = useRef<HTMLDivElement | null>(null)
    const thumbnailRef = useRef<Array<HTMLDivElement | null>>([])
    const imageRef = useRef<Array<HTMLDivElement | null>>([])

    const [isHoverImageList, setIsHoverImageList] = useState(false)
    const [selectedImage, setSelectedImage] = useState<number>(0)

    const handleClickThumbnail = useCallback((index: number) => {
        imageRef.current[index]?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
    }, [])

    useEffect(() => {
        imageListRef.current?.addEventListener('mouseenter', (event: any) => {
           setIsHoverImageList(true)
        })

        imageListRef.current?.addEventListener('mouseleave', (event: any) => {
            setIsHoverImageList(false)
        })

        imageListRef.current?.addEventListener("scroll", (event: any) => {
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
                {imageList.map((image, index) => (
                    <Thumbnail
                        key={`${image}-thumb`}
                        ref={ref => thumbnailRef.current[index] = ref}
                        isActive={index === selectedImage}
                        onClick={() => handleClickThumbnail(index)}
                    >
                        <img src={`${image}?q=80&w=300&auto=format&fit=crop`} alt=""/>
                    </Thumbnail>
                ))}
            </Thumbnails>
            <Images ref={imageListRef}>
                {imageList.map((image, index) => (
                    <Image
                        key={image}
                        ref={ref => imageRef.current[index] = ref}
                    >
                        <img src={`${image}?q=80&w=800&auto=format&fit=crop`} alt=""/>
                    </Image>
                ))}
            </Images>
        </Container>
        </>
    )
}

export default ImageScroll