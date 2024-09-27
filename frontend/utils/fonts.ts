import {Platform} from 'react-native';

const isIOS = Platform.OS === 'ios';

export const fontFamilies = {
  SFPRODISPLAY: {
    regular: isIOS ? 'SFProDisplay-Regular' : 'SFProDisplayRegular',
    semibold: isIOS ? 'SFProDisplay-Semibold' : 'SFProDisplaySemibold',
    bold: isIOS ? 'SFProDisplay-Bold' : 'SFProDisplayBold',
    light: isIOS ? 'SFProDisplay-Light' : 'SFProDisplayLight',
    medium: isIOS ? 'SFProDisplay-Medium' : 'SFProDisplayMedium',
    black: isIOS ? 'SFProDisplay-Black' : 'SFProDisplayBlack',
    heavy: isIOS ? 'SFProDisplay-Heavy' : 'SFProDisplayHeavy',
    thin: isIOS ? 'SFProDisplay-Thin' : 'SFProDisplayThin',
    ultralight: isIOS ? 'SFProDisplay-Ultralight' : 'SFProDisplayUltralight',
  },
};

export const getFontFamily = (
  weight: keyof typeof fontFamilies.SFPRODISPLAY,
) => {
  const selectedFontFamily = fontFamilies.SFPRODISPLAY;
  return selectedFontFamily[weight];
};
