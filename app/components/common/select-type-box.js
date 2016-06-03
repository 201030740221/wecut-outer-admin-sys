import {Select} from 'antd';
const Option = Select.Option;

var SelectTypeBox = React.createClass({
    getInitialState: function () {
        return {
         data:[]
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
    handleChange(value){

        if(this.props.onSelectChange){
          this.props.onSelectChange(value);
        }
    },
    searchHandle(value){

        if(this.props.onSearchHandle){
          this.props.onSearchHandle(value);
        }
    },
    render(){

      let self = this;
      let data = this.state.data;

      if(this.props.type=='channels'){
       console.log(data,'data');

      }

      return (
          <div>
              <Select multiple 
                style={{ width: '100%' }}
                searchPlaceholder="请选择"
                onChange={self.handleChange}
                onSearch={self.searchHandle}
                >
                {
                  data.map((item,key)=>{
                    return (
                        <Option key={item.key}>{item.value}</Option>
                      )
                  })
                }
              </Select>
          </div>
        )
    }
})

module.exports = SelectTypeBox;