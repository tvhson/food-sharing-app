import React from 'react';
import {Text as RNText, StyleProp, TextProps, TextStyle} from 'react-native';

import {getFontFamily} from '../../utils/fonts';
import Colors from '../../global/Color';
import {moderateScale} from '../../utils/scale';

export type IFontTypes =
  | 'regular'
  | 'medium'
  | 'bold'
  | 'light'
  | 'semibold'
  | 'italic';

export interface CustomTextProps extends TextProps {
  /**
   * Overwrite style for text
   * @default undefined
   */
  style?: StyleProp<TextStyle>;

  /**
   * Type of font to be used
   * @default 'regular'
   */
  fontType?: IFontTypes;

  /**
   * Font size in pixels
   * @default 14
   */
  size?: number;

  /**
   * Line height in pixels
   * @default size * 1.5
   */
  lineHeight?: number;

  /**
   * Text color
   * @default theme.colors.textPrimary
   * @required
   */
  textColor?: string;
}

export const fontFamilies: Record<IFontTypes, TextStyle> = {
  bold: {
    fontFamily: getFontFamily('bold'),
    fontWeight: '700',
  },
  light: {
    fontFamily: getFontFamily('light'),
    fontWeight: '300',
  },
  medium: {
    fontFamily: getFontFamily('medium'),
    fontWeight: '500',
  },
  regular: {
    fontFamily: getFontFamily('regular'),
    fontWeight: '400',
  },
  semibold: {
    fontFamily: getFontFamily('semibold'),
    fontWeight: '600',
  },
  italic: {
    fontFamily: getFontFamily('regular'),
    fontWeight: '400',
    fontStyle: 'italic',
  },
};

/**
 * A customizable text component that supports various font families and styles
 * @param {StyleProp<TextStyle>} [props.style] - Custom style overrides for the text
 * @param {IFontTypes} [props.fontType='regular'] - The font family and style to use
 * @param {number} [props.size=textSizes.body] - Font size in scale units
 * @param {number} [props.lineHeight] - Line height of the text
 * @param {string} [props.textColor] - Color of the text (defaults to theme's black)
 * @param {React.ReactNode} props.children - The text content to display
 */

export function CustomText(props: CustomTextProps) {
  const {
    style,
    children,
    size = 14,
    textColor = Colors.gray800,
    lineHeight,
    fontType = 'regular',
  } = props;

  return (
    <RNText
      allowFontScaling={false}
      {...props}
      style={[
        {
          ...fontFamilies[fontType],
          color: textColor,
          fontSize: moderateScale(size),
          ...(lineHeight && {lineHeight: moderateScale(lineHeight)}),
        },
        style,
      ]}>
      {children}
    </RNText>
  );
}
