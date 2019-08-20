import React, {Component} from "react";


export default  class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            responseMsg: '',
            responseType: ''
        };

    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    _handleForgotPassword = () => {

    };

    render(){
        return(

            <div className="sixteen wide tablet">
                <div className="ui grid">
                    <div className="row">
                        <div className="four wide column" style={{padding: 60,backgroundColor:"#4D335B"}}>
                            <div className="ui middle aligned center aligned grid">
                                <div className="column">
                                    <div id="erroMessageDisplay">
                                        <div className="ui message">
                                            <i className="close icon"></i>
                                            <div className="header">
                                                {this.state.responseMsg}
                                            </div>
                                        </div>
                                        <br /><br /><br />
                                    </div>
                                    <h2 className="ui teal image header">
                                        <img className="image" style={{width:"70%",height:"4%",marginBottom:10}}
                                             src=""/>

                                    </h2>
                                    <div className="content">
                                        <span style={{color:"#f7f7f7",fontSize:18}}>Login to your account</span>
                                    </div>
                                    <form id="loginForm" className="ui form" method="post" action="" >
                                        <div style={{marginRight:100,marginLeft:100,margin:30}}>
                                            <div className="field">
                                                <input
                                                    style={{height:50}}
                                                    id="email" type="text" name="email" />
                                                <span className="highlight"/><span className="bar"/>
                                            </div>
                                            <div className="field">
                                                <input
                                                    style={{height:50}}
                                                    id="password" type="password" name="password"/>
                                                <span className="highlight"/><span className="bar"/>
                                            </div>
                                            <button id="loginFormSubmitBtn"
                                                    // style={{height:50,borderRadius:25,backgroundColor:"#AC498E"}}
                                                    className="ui fluid large submit button button-login">
                                                Login
                                                <div className="ripples buttonRipples">
                                                    <span className="ripplesCircle"/>
                                                </div>
                                            </button>
                                        </div>

                                    </form>
                                    <i className="lock icon"  style={{textAlign:"left",color:"#AC498E",paddingLeft:20}}/>
                                    <a href="#" className="right floated "
                                       style={{textAlign:"left",color:"#AC498E",paddingLeft:20,fontSize:16,
                                       }}
                                       onClick={this._handleForgotPassword}
                                    >Forgot Password?</a>
                                    <i className="plus icon"  style={{textAlign:"left",color:"#AC498E",paddingLeft:20}}/>
                                    <a href="" className="right floated "
                                       style={{textAlign:"left",color:"#AC498E",paddingLeft:20,fontSize:16,
                                       }}
                                    >Register Instead</a>
                                </div>
                            </div>

                        </div>
                        <div className="twelve wide column landing-color">
                            <div className="segment">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}
