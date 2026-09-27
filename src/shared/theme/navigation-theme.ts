import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';

// Espelha os tokens de `global.css` para header e fundo das telas nativas.
export const lightNavigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(37, 99, 235)',
    background: 'rgb(248, 250, 252)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(15, 23, 42)',
    border: 'rgb(226, 232, 240)',
  },
};

export const darkNavigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: 'rgb(96, 165, 250)',
    background: 'rgb(2, 6, 23)',
    card: 'rgb(15, 23, 42)',
    text: 'rgb(241, 245, 249)',
    border: 'rgb(30, 41, 59)',
  },
};
