import { message,Icon,Table,Form, Select,Input, Row, Col, Modal, Button,Pagination } from 'antd';
const Option = Select.Option;

var FormSelectBox = React.createClass({
    getInitialState: function () {
        return {
         data:[],
         record: [],
         visible: false,
         pagination: { pageSize:20, showQuickJumper:true },
          selectedRowKeys: [],  // 这里配置默认勾选列
          loading: false,
        };
    },
    componentDidMount: function () {
      this.setState({
        data: this.props.data
      })
    },
    componentWillReceiveProps(nextProps) {
      this.setState({
        data: nextProps.data
      })
    },
    fetch(params = {}) {

      let self = this;
      this.setState({ loading: true });

      if(localStorage.getItem('adminId')){
        params.adminId = localStorage.getItem('adminId');
      }

      reqwest({
        url: apiConfig.apiHost+'/cms/publish/searchchannel.php',
        method: 'get',
        data: params,
        type: 'json',
        success: (result) => {
          const pagination = self.state.pagination;
          pagination.total = result.totalIndex*pagination.pageSize;
           let channels = result.data.channels;
            channels.forEach((item)=>{
              item.key = item.chid;
              item.value = item.name;
            })
          self.setState({
            loading: false,
            data: channels,
            pagination,
          });
        }
      });
    },
    handleTableChange(pagination) {
      const pager = this.state.pagination;
      pager.current = pagination.current;
      this.setState({
        pagination: pager,
      });
      this.fetch({
        searchtext: $('#keyword').val(),
        index: pagination.current
      });
    },
    searchChangeHandle(e){
      let val = e.target.value;
      let params = {
        searchtext: val
      }
      this.fetch(params);
    },

    // 弹出框
    showModal(record) {
      this.setState({
        visible: true,
        record: record
      });
    },
    handleOk() {
      console.log(this.state.record);
      this.setState({
        confirmLoading: true
      });

      this.setState({
          visible: false,
          confirmLoading: false
        });
      this.props.selectCallBack(this.state.selectedRowKeys,this.state.data);
    },
    handleCancel() {
      console.log('点击了取消');
      this.setState({
        visible: false
      });
    },

    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.setState({ selectedRowKeys });
    },

    render(){

      let self = this;
      let data = this.state.data;

      let { loading, selectedRowKeys } = this.state;
      let rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
      };
      let hasSelected = selectedRowKeys.length > 0;
      let columns = [{
        title: '频道名',
        dataIndex: 'name',
      }];

      return (
          <div>
              {
                selectedRowKeys.map((item,key)=>{
                  let _name='' , this_id = '';
                  data.map((_item,_key)=>{
                    if(item==_item.key){
                      _name = _item.name;
                      this_id = item;
                    }
                  })
                  return(
                      <span className="small_btn mr-5" key={key}>{_name}</span>
                    )
                })
              }
             <span className="small_btn green" onClick={this.showModal.bind(null,data)}>选择频道</span>

              <Modal title="频道选择器"
                visible={this.state.visible}
                onOk={this.handleOk}
                confirmLoading={this.state.confirmLoading}
                onCancel={this.handleCancel}>
               <div style={{height:'400',overflow:'auto'}}>
                  <div style={{ marginBottom: 16 }}>
                      <Input id="keyword" placeholder="搜索关键字" onChange={this.searchChangeHandle} />
                     <span style={{ marginLeft: 8 }}>{hasSelected ? `选择了 ${selectedRowKeys.length} 个对象` : ''}</span>
                  </div>
                  <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={data}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    onChange={this.handleTableChange}
                    bordered
                    rowKey={record => record.chid}
                    />
                </div>
              </Modal>
          </div>
        )
    }
})

module.exports = FormSelectBox;
