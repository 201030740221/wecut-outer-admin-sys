'use strict';

import {Icon, Menu} from 'antd';
const SubMenu = Menu.SubMenu;

let SideBar = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState: function () {
    return {current: null};
  },
  handleMenu(item) {
    this.context.router.push(item.key);
    this.setState({current: item.key});
  },
  render() {
    let menus = [
      {
        title: '外部运营中心',
        subMenus: [
           {
            title: '发布管理',
            icon: 'folder-open',
            items: [
              {
                name: '内容发布',
                path: '/publish/content/list'
              }
            ]
          },
          {
            title: '发布账号管理',
            icon: 'solution',
            items: [
              {
                name: '账号列表',
                path: '/publish/account/list'
              }
            ]
          }
        ]
      }
    ];
    return (
      <aside className="aside-container">
        {menus.map(function (menu, index) {
          return (
            <div key={'menu-' + index}>
              <h4 className="aside-title">{menu.title}</h4>
              <Menu mode="inline" 
                    onClick={this.handleMenu} 
                    selectedKeys={[this.state.current]}
                    defaultOpenKeys={['sub-menu-0','sub-menu-1']}
                    >
                {menu.subMenus.map(function (subMenu, subIndex) {
                  return (
                    <SubMenu key={'sub-menu-' + subIndex} title={<span><Icon type={subMenu.icon}/>{subMenu.title}</span>}>
                      {subMenu.items.map(function (item) {
                        return <Menu.Item key={item.path}>{item.name}</Menu.Item>;
                      })}
                    </SubMenu>
                  );
                })}
              </Menu>
            </div>
          );
        }.bind(this))}
      </aside>
    );
  }
});

module.exports = SideBar;
