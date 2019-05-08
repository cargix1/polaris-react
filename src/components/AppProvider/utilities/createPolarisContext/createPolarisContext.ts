import {PolarisContext} from '../../../types';
import {
  createThemeContext,
  ThemeProviderContext as CreateThemeContext,
} from '../../../ThemeProvider';
import {AppProviderProps} from '../../types';
import StickyManager from '../StickyManager';
import createAppProviderContext, {
  CreateAppProviderContext,
} from '../createAppProviderContext';

export interface CreatePolarisContext extends AppProviderProps {
  stickyManager?: StickyManager;
}

export function createPolarisContext(): PolarisContext;
export function createPolarisContext(
  contextOne: CreateAppProviderContext | CreateThemeContext,
): PolarisContext;
export function createPolarisContext(
  contextOne: CreateAppProviderContext | CreateThemeContext,
  contextTwo: CreateAppProviderContext | CreateThemeContext,
): PolarisContext;
export default function createPolarisContext(
  contextOne?: CreateAppProviderContext | CreateThemeContext,
  contextTwo?: CreateAppProviderContext | CreateThemeContext,
): PolarisContext {
  let appProviderContext: CreateAppProviderContext | undefined;
  let themeContext: CreateThemeContext | undefined;
  if (contextOne && 'logo' in contextOne) {
    themeContext = contextOne as CreateThemeContext;
    appProviderContext = contextTwo as CreateAppProviderContext;
  } else {
    appProviderContext = contextOne;
    themeContext = contextTwo as CreateThemeContext | undefined;
  }

  const appProvider = appProviderContext
    ? createAppProviderContext(appProviderContext)
    : createAppProviderContext();
  const theme = themeContext
    ? createThemeContext(themeContext)
    : createThemeContext();

  return {...appProvider, theme};
}
