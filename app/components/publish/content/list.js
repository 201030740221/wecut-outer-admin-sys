import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import {Popconfirm, message,Icon,Table,Form, Select,Input, Row, Col, Modal, Button,Tag } from 'antd';
const FormItem = Form.Item;

/*import BaseForm from '../common/base-form';*/

var FormSearch = React.createClass({
   getInitialState: function () {
        return {
         

        };
  },
  search(){
    if(this.props.onSearch){
      this.props.onSearch();
    }
  },

  handleChange(which,val){
    let self = this;

    if(this.props.changeHandle){
      this.props.changeHandle(which,val);
    }
  },
  addPublish(){
    if(this.props.addPublish){
      this.props.addPublish();
    }
  },
  render(){

    return (
       <div style={{marginBottom:'20'}}>
          <Row>
            <Col span="10">
              <div span="12" className='fl'>
               <Select 
                  defaultValue="-1" 
                  onChange={this.handleChange.bind(null,'search_type')}
                  style={{width:'120'}}
                  >
                  <Option value="-1">频道类型</Option>
                  <Option value="1">频道名</Option>
                  <Option value="2">频道ID</Option>
                  <Option value="3">频道主ID</Option>
                </Select>
              </div>
              <div span="12" className='fl'>
                <Input className="search_input" placeholder="please enter..." style={{marginLeft:'10'}} />
              </div>
            </Col>
            <Col span="3" style={{marginLeft:'10'}}>
               <Select  
                  defaultValue="-1" 
                  onChange={this.handleChange.bind(null,'search_channel')}
                  style={{width:'120'}}
               >
                  <Option value="-1">全部频道</Option>
                  <Option value="1">推荐频道</Option>
                  <Option value="0">非推荐频道</Option>
                </Select>
            </Col>
            <Col span="3" style={{marginLeft:'10'}}>
               <Select 
                  className="search_channel" 
                  defaultValue="-1" 
                  onChange={this.handleChange.bind(null,'has_tag')}
                  style={{width:'120'}}
               >
                  <Option value="-1">全部标签</Option>
                  <Option value="1">有标签</Option>
                  <Option value="0">无标签</Option>
                </Select>
            </Col>
          </Row>
          <Row className="u-mt-20">
            <Col span="12" style={{ textAlign: 'left' }}>
                <Button type="primary" onClick={this.addPublish}>新增发布</Button>
            </Col>
            <Col span="12" style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={this.search}>搜索</Button>
            </Col>
          </Row>
        </div>
      )
  }
});


var TagIndex = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState: function () {
        return {
          data: [],
          pagination: { pageSize:20, showQuickJumper:true },
          loading: false,
          firstLevelTag: [],
          secondLevelTag: [],

          searchtype: -1,
          isrec: -1,
          tagid:-1,
          istag: -1
        };
  },
  handleTableChange(pagination) {
    const pager = this.state.pagination;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });

    let _val = $('.search_input').val();
    let searchtype = this.state.searchtype,
        searchtext = _val,
        isrec  = this.state.isrec ,
        tagid = this.state.tagid,
        istag = this.state.istag;
    let _parmas = {
      searchtype: +searchtype,
      searchtext: searchtext||null,
      isrec: +isrec,
      tagid: +tagid,
      istag: +istag,
      index: pagination.current
    }

    this.fetch(_parmas);
  },
  fetch(params = {}) {

    let self = this;
    this.setState({ loading: true });

    if(localStorage.getItem('adminId')){
      params.adminId = localStorage.getItem('adminId');
    }

    reqwest({
      url: apiConfig.apiHost+'/cms/publish/list.php',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        const pagination = self.state.pagination;
        pagination.total = result.totalIndex*pagination.pageSize;

        //let firstLevelTag = result.data.firstLevelTag;
        let _arr = result.data.task;
        if(result.data.task.length>0){
           self.setState({
            loading: false,
            data: result.data.task,
            pagination,
          });
        }else{
          self.setState({
            loading: false
          });
        }
       
      }
    });
  },
  componentDidMount() {
    this.fetch();
  },
  componentWillReceiveProps(nextprops){
    this.fetch();
  },
  onSearch(){
    let _val = $('.search_input').val();
    let searchtype = this.state.searchtype,
        searchtext = _val,
        isrec  = this.state.isrec ,
        tagid = this.state.tagid,
        istag = this.state.istag;
    let _parmas = {
      searchtype: +searchtype,
      searchtext: searchtext||null,
      isrec: +isrec,
      tagid: +tagid,
      istag: +istag
    }
    this.fetch(_parmas);
  },
  changeHandle(){
    let which = arguments[0],
        val = arguments[1];
    switch(which){
      case 'search_type': 
          this.setState({
            searchtype: val
          })
          break;
      case 'search_channel': 
          this.setState({
            isrec: val
          })
          break;
      case 'tag_type': 
          this.setState({
            tagid: val
          })
          break;
      case 'has_tag': 
          this.setState({
            istag: val
          })
          break;
    }

  },
  //新增发布
  addPublish(){
    console.log(this);
    this.context.router.push('/publish/content/edit');
  },
  edit(pid,type){

    if(type=="edit"){
       message.error('该功能暂未开放');
       return;
    }
    this.context.router.push('/publish/content/view/'+pid);
  },
  endHandle(pid){
     let self = this;
     let _data = this.state.data;
     let params = { pid: pid};

      if(localStorage.getItem('adminId')){
        params.adminId = localStorage.getItem('adminId');
      }

      reqwest({
        url: apiConfig.apiHost+'/cms/publish/taskdel.php',
        method: 'post',
        data: params,
        type: 'json',
        success: (res) => {
          if(res.code){
            message.success(res.msg);
            _data.forEach((item)=>{
              if(item.pid==pid){
                item.isDel=0;
                item.status="已终止";
              }
            })
            self.setState({
              data: _data
            })

            
          }else{
            message.error(res.msg);
          }
        }
      }); 
  },

  render() {

    let self = this;

    if(this.state.loading){
      return (
        <Icon type="loading" />
      )
    }
    let columns = [{
      title: '发布时间',
      dataIndex: 'ptime'
    },{
      title: '主题内容',
      dataIndex: 'topic'
    },{
      title: '相关频道',
      dataIndex: 'chname'
    },{
      title: '相关标签',
      dataIndex: 'tagname'
    },{
      title: '内容数量',
      dataIndex: 'worksNum'
    },{
      title: '内容曝光',
      dataIndex: 'pageview'
    },{
      title: '状态',
      dataIndex: 'status'
    },{
      title: '操作人',
      dataIndex: 'admin'
    },{
      title: '管理',
      dataIndex: '',
      render(text,record){

        let end_node = '';
        if(+record.isDel==1){
          end_node = (
            <span>
              <span className="ant-divider"></span>
              <a href="javascript:;" onClick={self.endHandle.bind(null,record.pid)}>终止该任务</a>
            </span>
          )
        }
        return (
            <span>
              <a href="javascript:;" onClick={self.edit.bind(null,record.pid,'view')}>查看详情</a>
              {end_node}
            </span>
          )
      }
    }];

    return (
      <div className="right-container">
        <FormSearch 
          onSearch={this.onSearch}
          changeHandle={this.changeHandle}
          addPublish={this.addPublish}
        />
        <Table 
          showHeader
          columns={columns}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange} 
          bordered
          rowKey={record => record.pid}
          />
      </div>
    );
  }
});

module.exports = TagIndex;