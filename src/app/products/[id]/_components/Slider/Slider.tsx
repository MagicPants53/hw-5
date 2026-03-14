"use client";

import { useState, type FC } from "react";
import Image from "next/image";

import ArrowDownIcon from "@/shared/components/icons/ArrowDownIcon";

import styles from "./Slider.module.scss";

type SliderProps = {
  imgPaths?: string[];
  width?: number;
  height?: number;
};

const Slider: FC<SliderProps> = ({ imgPaths, width, height }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!imgPaths) return;

  return (
    <div className={styles.slider} style={{ width: width, height: height }}>
      <div
        className={styles.slider_content}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {imgPaths.map((path, index) => (
          <div key={index} className={styles.slide}>
            <Image alt="" src={path}  fill  sizes="100%"/>
          </div>
        ))}
      </div>
      <button
        className={`${styles.btn} ${styles.btn_prev}`}
        onClick={() =>
          setCurrentSlide(
            (currentSlide - 1 + imgPaths.length) % imgPaths.length,
          )
        }
      >
        <ArrowDownIcon
          style={{ transform: "rotate(90deg)" }}
          color="secondary"
        />
      </button>
      <button
        className={`${styles.btn} ${styles.btn_next}`}
        onClick={() => setCurrentSlide((currentSlide + 1) % imgPaths.length)}
      >
        <ArrowDownIcon
          style={{ transform: "rotate(-90deg)" }}
          color="secondary"
        />
      </button>
    </div>
  );
};

export default Slider;
