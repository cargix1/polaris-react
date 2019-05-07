import * as React from 'react';
import {Consumer} from '../Context';
import AppProvider from '../AppProvider';
import {mountWithAppProvider} from '../../../test-utilities';

describe('<AppProvider />', () => {
  it('updates polaris context when props change', () => {
    const Child: React.SFC<{}> = (_props) => (
      <Consumer>
        {({
          polaris: {
            link: {linkComponent},
          },
        }) => (linkComponent ? <div id="child" /> : null)}
      </Consumer>
    );
    const LinkComponent = () => <div />;

    const wrapper = mountWithAppProvider(
      <AppProvider>
        <Child />
      </AppProvider>,
    );

    expect(wrapper.find('#child')).toHaveLength(0);
    wrapper.setProps({linkComponent: LinkComponent});
    wrapper.update();
    expect(wrapper.find('#child')).toHaveLength(1);
  });
});
