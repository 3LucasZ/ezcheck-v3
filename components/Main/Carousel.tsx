import {
  Box,
  Flex,
  Text,
  Image,
  IconButton,
  Icon,
  useBreakpointValue,
  AspectRatio,
  VStack,
  HStack,
} from "@chakra-ui/react";
import Router from "next/router";

import { MouseEventHandler, useRef, useState } from "react";
import { IconType } from "react-icons";
import { FiChevronLeft, FiChevronRight, FiEye } from "react-icons/fi";
import { genGradient } from "services/gradientGenerator";

import { throttle } from "lodash";
import _ from "lodash";

type CarouselProps = {
  cards: {
    image: string;
    dbImage: boolean;
    title: string;
    url: string;
  }[];
};
export default function Carousel({ cards }: CarouselProps) {
  const cols =
    useBreakpointValue(
      {
        base: 1,
        sm: 2,
        md: 3,
      },
      { fallback: "md", ssr: false }
    ) || 3;
  const [cur, setCur] = useState(0);
  const cnt = cards.length;

  //absorbing
  const prev = () => {
    setCur((s) => Math.max(s - 1, 0));
  };
  const next = () => {
    setCur((s) => Math.min(s + 1, cnt - 1));
  };

  //cyclic
  // const prev = () => {
  //   setCur(cur === 0 ? cnt - 1 : cur - 1);
  // };
  // const next = () => {
  //   setCur(cur === cnt - 1 ? 0 : cur + 1);
  // };

  const carouselStyle = {
    transition: "all .5s",
    ml: `-${cur * (100 / cols)}%`,
  };

  return (
    <Flex px={"2"} alignItems="center" justifyContent="center">
      <Flex w="full" overflow="hidden" pos="relative">
        <Flex h="250px" py="4" w="full" {...carouselStyle}>
          {cards.map((card, id) => (
            <CarouselCard
              image={card.image}
              dbImage={card.dbImage}
              title={card.title}
              url={card.url}
              id={id}
              cols={cols}
            />
          ))}
        </Flex>
        {/* carousel side whitespace cover ups */}
        <Box left="0" h="100%" w="9px" bg="white" pos={"absolute"} />
        <Box right="0" h="100%" w="9px" bg="white" pos={"absolute"} />
        {/* control buttons */}
        <CarouselControl
          onClick={prev}
          left="0"
          top="50%"
          icon={FiChevronLeft}
        />
        <CarouselControl
          onClick={next}
          right="0"
          top="50%"
          icon={FiChevronRight}
        />
      </Flex>
    </Flex>
  );
}

type CarouselCardProps = {
  image: string;
  dbImage: boolean;
  title: string;
  url: string;
  id: number;
  cols: number;
};
function CarouselCard(props: CarouselCardProps) {
  return (
    <Box
      key={`slide-${props.id}`}
      minH="100%"
      minW={`${100 / props.cols}%`}
      maxW={`${100 / props.cols}%`}
      px="3"
    >
      <Box
        rounded={"lg"}
        // borderWidth={"1px"}
        boxShadow={"md"}
        h="100%"
        alignContent={"center"}
        overflow={"clip"}
      >
        <Box
          minH="75%"
          maxH="75%"
          w="100%"
          bgGradient={genGradient(props.title)}
          alignContent={"center"}
          overflow="clip"
        >
          <Image
            src={props.image ? (props.dbImage ? "/api" : "") + props.image : ""}
            hidden={props.image.length < 5}
            h="100%"
            w="100%"
            fit={"contain"}
          />
        </Box>
        <HStack h="25%" px="3" w="100%">
          <Text
            noOfLines={1}
            w="100%"
            // bgGradient={genGradient(props.title)}
            // bgClip="text"
          >
            {props.title}
          </Text>
          <Icon
            as={FiEye}
            rounded={"full"}
            bg="gray.200"
            _hover={{ bg: "gray.300" }}
            p={2}
            boxSize={"8"}
            onClick={() => Router.push(props.url)}
          />
        </HStack>
      </Box>
    </Box>
  );
}

type CarouselControlProps = {
  onClick: MouseEventHandler;
  left?: number | string;
  right?: number | string;
  top?: number | string;
  bottom?: number | string;
  icon: IconType;
};
function CarouselControl(props: CarouselControlProps) {
  const throttledOnClick = useRef(throttle(props.onClick, 500));
  return (
    <Icon
      as={props.icon}
      boxSize={10}
      color="white"
      position="absolute"
      left={props.left}
      right={props.right}
      top={props.top}
      mt="-22px"
      onClick={throttledOnClick.current}
      _hover={{
        opacity: 0.6,
        bg: "black",
        cursor: "pointer",
      }}
      opacity={0.3}
      bg={"black"}
      rounded={"full"}
      py="1.5"
    />
  );
}

// const slides = [
//   "https://images.pexels.com/photos/2599537/pexels-photo-2599537.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
//   "https://images.pexels.com/photos/2714581/pexels-photo-2714581.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
//   "https://images.pexels.com/photos/2878019/pexels-photo-2878019.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
//   "https://images.pexels.com/photos/1142950/pexels-photo-1142950.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
//   "https://images.pexels.com/photos/3124111/pexels-photo-3124111.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
// ];
