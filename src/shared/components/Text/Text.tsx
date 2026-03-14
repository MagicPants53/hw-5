import * as React from 'react';

import { Roboto } from 'next/font/google';

import styles from './Text.module.scss';

export type TextProps = {
  /** Дополнительный класс */
  className?: string;
  /** Стиль отображения */
  view?: 'title' | 'button' | 'subtitle' | 'p-20' | 'p-18' | 'p-16' | 'p-14';
  /** Html-тег */
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span';
  /** Начертание шрифта */
  weight?: 'normal' | 'medium' | 'bold';
  /** Контент */
  children: React.ReactNode;
  /** Цвет */
  color?: 'primary' | 'secondary' | 'accent';
  /** Максимальное кол-во строк */
  maxLines?: number;
};

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const Text: React.FC<TextProps> = ({
  className = '',
  view,
  tag = 'p',
  weight,
  children,
  color,
  maxLines,
}) => {
  const viewClass = view ? `text_${view}` : '';
  const colorClass = color ? `color_${color}` : '';

  const classes = [roboto.className, styles.text_component, styles[viewClass], styles[colorClass], className].join(
    ' '
  );

  const props: React.HTMLAttributes<HTMLElement> = {
    className: classes,
    style: { fontWeight: weight === 'medium' ? '500' : weight },
  };

  if (maxLines) {
    props.style = {
      ...props.style,
      WebkitLineClamp: maxLines,
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    };
  }

  return React.createElement(tag, props, children);
};

export default Text;
