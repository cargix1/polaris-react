import * as React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import {ClientApplication} from '@shopify/app-bridge';
import Intl from '../Intl';
import Link from '../Link';
import StickyManager from '../StickyManager';
import ScrollLockManager from '../ScrollLockManager';
import {
  ThemeContext,
  Consumer as ThemeProviderConsumer,
} from '../../../ThemeProvider';
import AppProviderContext from '../../Context';

export type ReactComponent<P, C> =
  | React.ComponentClass<P> & C
  | React.SFC<P> & C;

export interface WithAppProviderProps {
  polaris: {
    intl: Intl;
    link: Link;
    stickyManager: StickyManager;
    scrollLockManager: ScrollLockManager;
    theme?: ThemeContext;
    appBridge?: ClientApplication<{}>;
  };
}

export interface Options {
  inScrollable?: boolean;
}

function withScrollable<P, T>(WrappedComponent: ReactComponent<P, T>) {
  class WithScrollable extends React.Component {
    static contextTypes = WrappedComponent.contextTypes;
    private stickyManager: StickyManager = new StickyManager();

    render() {
      return (
        <AppProviderContext.Consumer>
          {(polaris) => (
            <AppProviderContext.Provider
              value={{
                ...polaris,
                stickyManager: this.stickyManager,
              }}
            >
              <WrappedComponent {...this.props} />
            </AppProviderContext.Provider>
          )}
        </AppProviderContext.Consumer>
      );
    }
  }

  return WithScrollable;
}

export default function withAppProvider<OwnProps>({
  inScrollable,
}: Options = {}) {
  return function addProvider<C>(
    WrappedComponent: ReactComponent<OwnProps & WithAppProviderProps, C>,
  ): React.ComponentClass<OwnProps> & C {
    // eslint-disable-next-line react/prefer-stateless-function
    class WithProvider extends React.Component<OwnProps, never> {
      static contextTypes = WrappedComponent.contextTypes;

      render() {
        return (
          <AppProviderContext.Consumer>
            {(polaris) => {
              return (
                <ThemeProviderConsumer>
                  {({polarisTheme}) => {
                    const polarisContext = {
                      ...polaris,
                      theme: polarisTheme,
                    };

                    if (Object.keys(polaris).length < 1) {
                      throw new Error(
                        `The <AppProvider> component is required as of v2.0 of Polaris React. See
                                    https://polaris.shopify.com/components/structure/app-provider for implementation
                                    instructions.`,
                      );
                    }

                    return (
                      <WrappedComponent
                        {...this.props}
                        polaris={polarisContext}
                      />
                    );
                  }}
                </ThemeProviderConsumer>
              );
            }}
          </AppProviderContext.Consumer>
        );
      }
    }

    let WithScrollable;
    if (inScrollable) {
      WithScrollable = withScrollable(WithProvider);
    }

    const FinalComponent = hoistStatics(
      WithScrollable || WithProvider,
      WrappedComponent as React.ComponentClass<any>,
    );

    return FinalComponent as React.ComponentClass<OwnProps> & C;
  };
}
