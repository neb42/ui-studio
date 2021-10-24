import { defaultTokens } from '@faculty/adler-tokens';
import deepPurple from '@mui/material/colors/deepPurple';
import grey from '@mui/material/colors/grey';

const adlerTheme = {
  colors: defaultTokens.colors,
  fonts: defaultTokens.fonts,
  header: defaultTokens.header,
  boxshadow: defaultTokens.boxshadow,
  input: defaultTokens.input,
} as const;

const muiTheme = {
  palette: {
    primary: deepPurple,
    info: grey,
  },
  components: {
    MuiButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiFilledInput: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiFormHelperText: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiInputBase: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiInputLabel: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiListItem: {
      defaultProps: {
        dense: true,
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiFab: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTable: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTextField: {
      defaultProps: {
        margin: 'dense',
        size: 'small',
      },
    },
    MuiToolbar: {
      defaultProps: {
        variant: 'dense',
      },
    },
  },
} as const;

export const themeSettings = { ...adlerTheme, ...muiTheme };
