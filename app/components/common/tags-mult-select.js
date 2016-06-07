import {Select} from 'antd';
const Option = Select.Option;

var TagsSelect = React.createClass({
    getInitialState: function () {
        return {
         tagList:[],
        };
    },
    componentDidMount: function () {
      let self = this;
      let _parmas = {};

      if(localStorage.getItem('adminId')){
        _parmas.adminId = localStorage.getItem('adminId');
      }

      reqwest({
        url: apiConfig.apiHost+'/cms/publish/taglist.php',
        method: 'post',
        data: _parmas,
        type: 'json',
        success: (res) => {
          if(res.code){
            self.setState({
              tagList: res.data
            })
          }else{
             message.error(result.msg);
          }

        }
      });
    },
    componentWillReceiveProps(nextProps) {

    },
    tagChange(key,value){
      if(this.props.tagChange){
        this.props.tagChange(key,value);
      }

    },
    render(){

      let self = this;
      let tagList = this.state.tagList;
      let key = this.props.log;

      return (
          <div>
            <Select
               showSearch
               id="tagid"
               defaultValue={'二次元'}
               placeholder=""
               style={{ width: '100%' }}
               onChange={self.tagChange.bind(null,key)}
               >
              {
                tagList.map((_item,_key)=>{
                  return(
                    <Option value={_item.tagid} key={_key}>{_item.name}</Option>
                  )
                })
              }
            </Select>
          </div>
        )
    }
})

module.exports = TagsSelect;
