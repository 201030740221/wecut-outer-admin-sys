import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import {
  Menu, Dropdown,Popover, message,DatePicker,Radio,InputNumber,
  Icon,Table, Tag, Form, Select, Upload,
  Input, Row, Col, Modal, Button,Pagination ,Transfer} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const createForm = Form.create;

//import BaseForm from '../../common/base-form';
import FormSelectBox from '../../common/form-select-box';

var TheForm = React.createClass({
  componentDidMount() {
    this.props.form.setFieldsValue({
      eat: true,
      sleep: true,
      beat: true,
    });
  },

  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  handleSubmit(e) {
     if(this.props.handleSubmit){
        this.props.handleSubmit();
      }
  },

  checkBirthday(rule, value, callback) {
    if (value && value.getTime() >= Date.now()) {
      callback(new Error('你不可能在未来出生吧!'));
    } else {
      callback();
    }
  },

  userChange(val){
  if(this.props.userChange){
      this.props.userChange(val);
    }
  },

  selectBoxChange(type,value){
    if(this.props.selectBoxChange){
      this.props.selectBoxChange(type,value);
    }
  },
  publishChange(e){
    let value = e.target.value;
    if(this.props.publishChange){
      this.props.publishChange(value);
    }
  },
  onPublishTimeChange(_time){
    if(this.props.onPublishTimeChange){
      this.props.onPublishTimeChange(_time);
    }
  },
  onUploaderChange(fileList){
    if(this.props.onUploaderChange){
      this.props.onUploaderChange(fileList);
    }
  },

  selectCallBack(selectedRowKeys,_data){
    if(this.props.selectCallBack){
      this.props.selectCallBack(selectedRowKeys,_data);
    }
  },

  render() {

    let self = this;

    let { getFieldProps } = this.props.form;

    let formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
    };

    let {channels,tags,usertaggroup , publish_type} = this.props;
    console.log(this.props);

    let publish_which = '';
      if(+publish_type==1){
        /*publish_which = (
            <div>
              <FormItem
                {...formItemLayout}
                label="立即发布：">
                 <span className="">
                  <span className="u-ml-10">推荐间隔</span>
                  <span>
                    <InputNumber id="instart" className="" type="text" placeholder="" style={{width:'50',padding:'3'}} />
                  </span>
                  <span className="u-ml-10">到</span>
                  <span>
                    <InputNumber id="inend" className="" type="text" placeholder="" style={{width:'50',marginLeft:'10',padding:'3'}} />
                  </span>
                  <span className="">分钟发布</span>
                </span>
              </FormItem>
            </div>
          );*/
          publish_which = null;
      }
      else if(+publish_type==2){
         publish_which = (
            <div>
              <FormItem
                {...formItemLayout}
                label="定时发布：">
                <LimitPublish onPublishTimeChange={this.onPublishTimeChange}/>
              </FormItem>
            </div>
          );
      }

    return (
      <Form horizontal form={this.props.form}>
        <h3 className="panel-heading u-mb-20">基本信息</h3>
        <FormItem
          {...formItemLayout}
          label="内容主题：">
          <Input type="textarea" id="topic" rows="4" />
        </FormItem>
         <h3 className="panel-heading u-mb-20">发布信息</h3>
        <FormItem
          {...formItemLayout}
          label="选择频道：">

          <FormSelectBox
              data={channels}
              selectCallBack={this.selectCallBack}
           />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="选择发布用户：">
          <Select placeholder="请选择发布用户" style={{ width: '100%' }} onChange={this.userChange}>
          {
            usertaggroup.map((item,key)=>{
              return(
                   <Option value={item.usertagid} key={key}>{item.name}</Option>
                )
            })
          }
          </Select>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="选择内容标签：">
          <Select
            multiple
            placeholder="请选择内容标签"
            style={{ width: '100%' }}
            defaultValue={[]}
            onChange={self.selectBoxChange.bind(null,'tags')}
            >
          {
            tags.map((item,key)=>{
              return(
                   <Option key={item.name+":"+item.tagid}>
                    {item.name}
                   </Option>
                )
            })
          }
          </Select>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="发布时间：">
          <RadioGroup defaultValue="1" onChange={this.publishChange}>
            <Radio value="1">立即发布</Radio>
            <Radio value="2">定时发布</Radio>
          </RadioGroup>
        </FormItem>

        {publish_which}

        <h3 className="panel-heading u-mb-20">发布内容</h3>
         <FormItem
          {...formItemLayout}
          label="发布内容：">
           <Uploader onUploaderChange={self.onUploaderChange} />
        </FormItem>

        <h3 className="panel-heading u-mb-20">提交</h3>
        <FormItem
          wrapperCol={{ span: 12, offset: 4}} >
          <Button type="primary" onClick={this.handleSubmit}>确定</Button>

        </FormItem>
      </Form>
    );
  },
});
TheForm = createForm()(TheForm);

var Uploader = React.createClass({
   getInitialState() {
    return {
      fileList: []
    };
  },
  handleChange(info) {

    let fileList = info.fileList;

    // 1. 上传列表数量的限制
    //    只显示最近上传的一个，旧的会被新的顶掉
    //fileList = fileList.slice(-2);
    console.log(fileList,'33');

    // 2. 读取远程路径并显示链接
    fileList = fileList.map((file) => {
      if (file.response) {
        let _response = file.response;
        // 组件会将 file.url 作为链接进行展示
        file.url = _response.data.picUrl;
        file.uid = _response.data.id;
        file.thumbUrl = _response.data.picUrl;
      }
      return file;
    });

    // 3. 按照服务器返回信息筛选成功上传的文件
   /* fileList = fileList.filter((file) => {
      if (file.response) {
        return file.response.status === 'success';
      }
      return true;
    });*/

    if(this.props.onUploaderChange){
      this.props.onUploaderChange(fileList);
    }

    this.setState({ fileList });

  },
  render() {

    let _adminId = '';
    if(localStorage.getItem('adminId')){
      _adminId = localStorage.getItem('adminId');
    }
    const props = {
      action: apiConfig.apiHost+'/cms/publish/upload.php',
      data: {adminId:_adminId},
      onChange: this.handleChange,
      multiple: true,
      listType: 'picture-card'
    };

    let fileList = this.state.fileList;
    return (
      <Row className="">
        <Col span="6">
          <Upload {...props} fileList={this.state.fileList}>
              <Icon type="plus" />
              <div className="ant-upload-text">上传照片</div>
          </Upload>
        </Col>
        <Col span="12">
        {
          fileList.map(function(item,key){
            return(
              <div className="" key={key}>
                <textarea id={"upload_dec"+key} type="textarea" className="upload_dec" placeholder="描述"></textarea>
              </div>
            )
          })
        }
        </Col>

      </Row>
    );
  }
})

var LimitPublish = React.createClass({
   getInitialState() {
    return {

    };
  },
  onChange(value) {
    console.log('选择了时间：', value);
    if(this.props.onPublishTimeChange){
      this.props.onPublishTimeChange(value);
    }
  },

  render(){
    let self = this;
    return(
      <div>
        <span className="">
          <span>
            <DatePicker showTime format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间" onChange={self.onChange} />
          </span>

        </span>
      </div>
    )
  }
})

var Index = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
    getInitialState: function () {
        return {
        	source: {},
        	loading: true,
          fileList: [],
          chids:[],
          tagids:[],
          usertagid: '1',
          channels: [],
          tags: [],
          usertaggroup: [],

          publish_type: 1,
          ptime: '',

        };
    },
    componentDidMount: function () {
       this.getFormData();
    },
    componentWillReceiveProps(nextprops){
      this.getFormData();
    },

    getFormData(){
       let self = this;

        let params = {};
       if(localStorage.getItem('adminId')){
          params.adminId = localStorage.getItem('adminId');
        }

       reqwest({
          url: apiConfig.apiHost+'/cms/publish/search.php',
          method: 'get',
          data: params,
          type: 'json',
          success: (result) => {

            let channels = result.data.channels;
            let tags = result.data.tags;
            let usertaggroup = result.data.usertaggroup;
            channels.forEach((item)=>{
              item.key = item.chid;
              item.value = item.name;
            })
            tags.forEach((item)=>{
              item.key = item.tagid;
              item.value = item.name;
            })
            usertaggroup.forEach((item)=>{
              item.key = item.usertagid;
              item.value = item.name;
            })

            self.setState({
              channels: channels,
              tags: tags,
              usertaggroup: usertaggroup
            })
          }
        });
    },

    selectBoxChange(type,value){
      let self = this;
      console.log(value,'value',type);
      switch(type){
        case 'channels':
              self.setState({ chids: value });
              break;
        case 'tags':
              self.setState({ tagids: value });
              break;
      }
    },
    onSearchHandle(type,value){
      let self = this;
      console.log(value,'value',type);
       let params = {searchtext: value};
       if(localStorage.getItem('adminId')){
          params.adminId = localStorage.getItem('adminId');
        }

      reqwest({
          url: apiConfig.apiHost+'/cms/publish/searchchannel.php',
          method: 'get',
          data: params,
          type: 'json',
          success: (res) => {
            let channels = res.data.channels;
            channels.forEach((item)=>{
              item.key = item.chid;
              item.value = item.name;
            })
            console.log(channels);
            self.setState({
              channels: channels

            })
          }
        });
    },

    userChange(val){
      this.setState({
        usertagid: val
      })
    },

    publishChange(val){
      console.log(val);
      this.setState({
        publish_type: val
      })
    },
    onPublishTimeChange(_time){
      this.setState({
        ptime: _time
      })
    },

    onUploaderChange(fileList){
      console.log(fileList,'66');
      this.setState({fileList});
    },

    selectCallBack(selectData,_data){
      let data = this.state.channels , ot;
      ot = data.concat(_data);
      console.log(data,'selectData');
      this.setState({ chids: selectData ,channels:ot});
    },
    handleSubmit(){
      let self = this;
      let fileList = self.state.fileList;
      let pics = [];
      fileList.forEach((item,key)=>{
        let _item = {};
        _item.id = +item.uid;
        _item.description = $('#upload_dec'+key).val();
        pics.push(_item);
      })

      let tagids = self.state.tagids, _tagids = [];
      tagids.forEach((item,key)=>{
        let _sp = item.split(":");
        console.log(_sp[1],'tagid');
        _tagids.push(_sp[1]);
      })

      let _parmas = {
        topic: $('#topic').val()||'',
        chids: self.state.chids,
        tagids: _tagids,
        usertagid: self.state.usertagid,
        ptype: self.state.publish_type,
        ptime: self.state.ptime,
        images: pics
      }
      if(localStorage.getItem('adminId')){
        _parmas.adminId = localStorage.getItem('adminId');
      }
      console.log(_parmas,"_parmas");
      reqwest({
        url: apiConfig.apiHost+'/cms/publish/add.php',
        method: 'post',
        data: _parmas,
        type: 'json',
        success: (result) => {
          if(result.code){
             message.success('新增成功');
             setTimeout(function(){ self.context.router.push('/publish/content/list'); } , 2000);
          }else{
             message.error(result.msg);
          }

        }
      });
    },

    render: function () {

    	let self = this;
      return (
          <TheForm
            channels={this.state.channels}
            tags={this.state.tags}
            usertaggroup={this.state.usertaggroup}
            publish_type={this.state.publish_type}
            fileList={this.state.fileList}

            userChange={this.userChange}
            selectBoxChange={this.selectBoxChange}
            publishChange={this.publishChange}
            onPublishTimeChange={this.onPublishTimeChange}
            onUploaderChange={this.onUploaderChange}
            selectCallBack={this.selectCallBack}
            handleSubmit={this.handleSubmit}
          />
        );
    }
});

module.exports = Index;
