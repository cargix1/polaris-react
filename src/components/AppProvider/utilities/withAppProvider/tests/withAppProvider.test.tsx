import * as React from 'react';
import {mount} from 'enzyme';
import {Provider} from '../../../Context';
import withAppProvider from '../withAppProvider';

describe('withAppProvider', () => {
  it('throws when polaris is not defined', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const Child: React.SFC<{}> = (_props) => <div />;

    const WrappedComponent = withAppProvider<any>()(Child);

    const fn = () => {
      mount(
        <Provider value={{} as any}>
          <WrappedComponent />
        </Provider>,
      );
      consoleSpy.mockRestore();
    };
    expect(fn).toThrowError();
  });
});
