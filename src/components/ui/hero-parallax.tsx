"use client";

import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export interface ParallaxProduct {
  title: string;
  link: string;
  thumbnail: string;
  tag?: string;
}

export const HeroParallax = ({
  products,
  header,
}: {
  products: ParallaxProduct[];
  header?: React.ReactNode;
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);

  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="relative z-10 h-[500vh] py-40 overflow-hidden antialiased flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      {header}
      <motion.div
        style={{ rotateX, rotateZ, translateY, opacity }}
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product, i) => (
            <ProductCard product={product} translate={translateX} key={`row1-${i}`} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product, i) => (
            <ProductCard product={product} translate={translateXReverse} key={`row2-${i}`} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product, i) => (
            <ProductCard product={product} translate={translateX} key={`row3-${i}`} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: ParallaxProduct;
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      key={product.title}
      className="group/product h-72 w-[30rem] relative flex-shrink-0 overflow-hidden rounded-lg"
    >
      <Link
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-full"
      >
        {/* Blurred background fill — same image, scaled up and blurred */}
        <Image
          src={product.thumbnail}
          fill
          sizes="480px"
          className="object-cover object-center scale-110 blur-md brightness-50 pointer-events-none select-none"
          alt=""
          aria-hidden="true"
        />
        {/* Crisp foreground image — contained, never cropped */}
        <Image
          src={product.thumbnail}
          fill
          sizes="480px"
          className="object-contain object-center relative z-10"
          alt={product.title}
        />
      </Link>
      {/* Hover overlay */}
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-70 bg-black pointer-events-none transition-opacity duration-300 z-20" />
      {/* Tag badge */}
      {product.tag && (
        <span className="absolute top-3 left-3 px-2 py-1 bg-accent-gold/95 backdrop-blur-sm text-neutral-black font-body font-bold text-[10px] uppercase tracking-[1px] rounded-full z-30">
          {product.tag}
        </span>
      )}
      {/* Title on hover */}
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white font-display text-[20px] transition-opacity duration-300 z-30">
        {product.title}
      </h2>
    </motion.div>
  );
};
