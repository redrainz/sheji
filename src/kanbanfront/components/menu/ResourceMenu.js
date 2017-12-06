/**
 * Created by chenzl on 2017/9/05.
 */
/*eslint-disable*/
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import Icons from 'Icons';
import Routes from 'RouteMap';
import { observer, inject } from 'mobx-react';
import menuStore from '../../stores/MenuStore';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const styles = {
  menuIcon: {
    lineHeight: '22px',
    margin: '10px',
    marginLeft: '-12px',
    fontSize: '15px',
    textAlign: 'center'
  }
};

@observer
class ResourceMenu extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const resourceMenu = menuStore.getResourceMenuData;
    let data;
    let menuItems = [];
    if (resourceMenu && resourceMenu.length != 0) {
      data = resourceMenu;
      data.menus.map((item, index) => {
        menuItems.push(
          <Menu.Item
            key={item.code}
          >
            <NavLink to={Routes[item.code]}>
              <span>
                <Icon style={styles.menuIcon} type={Icons[item.code]} />
                <span style={{lineHeight: 'inherit'}}><FormattedMessage id={item.code != null ? item.code : 'null'}
                  defaultMessage={item.code != null ? item.code : 'null'} /></span>
              </span>
            </NavLink>
          </Menu.Item>
        );
      });
    }

    return (
      <div style={{ height: '100%' }}>
        {data ? (
          <Menu mode="vertical" style={{ height: '100%' }} defaultOpenKeys={["home"]}>
            <MenuItemGroup key={data.code}
              title={<FormattedMessage id={data.code} defaultMessage={data.code} />}>
              {menuItems}
            </MenuItemGroup>
          </Menu>
        ) : ''}
      </div>
    );
  }
}

export default ResourceMenu;
