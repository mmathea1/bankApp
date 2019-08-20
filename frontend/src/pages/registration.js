import React, {Component} from "react";


class RegisterEmail extends Component {
    constructor(props) {
        super(props);
        this.codeTimerInterval = null;
        this.timeRemaining = 0;
        return (
            this.state = {
                responseMsg: '',
                task: '',
                otp: '',
                otpID: null,
                person: {},
                messageResponses: {
                    message: '',
                    type: '',
                    hidden: true,
                    onDismiss: 'onDismiss'
                },
            }
        )
    }

    componentWillMount () {
        $.fn.allchange = function (callback) {
            var me = this;
            var last = "";
            var infunc = function () {
                var text = $(me).val();
                if (text !== last) {
                    last = text;
                    callback();
                }
                setTimeout(infunc, 100);
            };
            setTimeout(infunc, 100);
        };

    }

    componentDidMount () {
        let input = $('input');
        document.getElementById('erroMessageDisplay').style.display = 'none';

        input.allchange(function () {
            var $this = $('input');

            if ($this.val()) {
                $this.addClass('used');
            } else {
                $this.removeClass('used');
            }
        });

        input.blur(function () {
            var $this = $(this);

            if ($this.val()) {
                console.log('adding class used');
                $this.addClass('used');
            } else {
                console.log('removing class used');
                $this.removeClass('used');
            }
        });

        var $ripples = $('.ripples');

        $ripples.on('click.Ripples', function (e) {

            var $this = $(this);
            var $offset = $this.parent().offset();
            var $circle = $this.find('.ripplesCircle');

            var x = e.pageX - $offset.left;
            var y = e.pageY - $offset.top;

            $circle.css({
                top: y + 'px',
                left: x + 'px'
            });

            $this.addClass('is-active');

        });

        $ripples.on('animationend webkitAnimationEnd mozAnimationEnd oanimationend MSAnimationEnd', function (e) {
            $(this).removeClass('is-active');
        });

        $('#signUpFormSubmitBtn').on('click', (event) => {
            "use strict";
            event.preventDefault();
            // this._verifyEmail();
        });

    }

    componentWillUnmount(){
        clearInterval(this.codeTimerInterval);
    }

    _toggleMessageDisplay = (message, type) => {
        $('#erroMessageDisplay').find('div:first').removeClass('positive').removeClass('negative');
        this.setState({responseMsg: message, responseMsgType: type}, () => {
                if (this.state.responseMsgType === 'success') {
                    $('#erroMessageDisplay').find('div:first').addClass('positive');
                } else {
                    $('#erroMessageDisplay').find('div:first').addClass('negative');
                }
                $('#erroMessageDisplay').show(1000);
                setTimeout(() => $('#erroMessageDisplay').hide(3000), 3000);
            }
        );
    };

    _isEmpty = (item) => {
        try {
            return typeof item === 'string' && (item === '' && item.trim() === '');
        }
        catch (error) {
            return true;
        }
    };


    _verifyEmail () {
        let emailValue = $('input[type=email][name=email]').val();
        let email = isEmailValid(emailValue, "Email ");

        if (email.isValid) {
            let params = {
                email: emailValue
            };
            console.log(params);
            $.ajax({
                url: registerURL,
                contentType: "application/json; charset=utf-8",
                type: 'POST',
                headers: {
                    "cache-control": "no-cache"
                },
                dataType: 'json',
                data: JSON.stringify(params),
                success: (data, textStatus, xhr) => {
                    console.log('move: ', data); // log
                    // $('#signUpForm').submit();
                    this.setState({otpID: data.otp}, () => {
                        this._toggleMessageDisplay(data.message, 'success');
                    });
                    setTimeout(() => {
                        this._showCodeVerificationModal()
                    }, 4000);


                },
                error: (xhr) => {

                    if (xhr.responseJSON !== undefined) {
                        this._toggleMessageDisplay(xhr.responseJSON.message, xhr.responseJSON.type);
                    } else {
                        this._toggleMessageDisplay('Fail. Please retry.', 'error');
                    }
                    console.log('form not sent');
                }
            });
        } else {
            this._toggleMessageDisplay(email.message, 'error');
        }

    }

    otpChange = (value)  => {
        console.log("otpChange value: ", value);
        this.setState({otp: value});
    }

    _showCodeVerificationModal () {
        $('#CodeVerificationModal')
            .modal('setting', 'closable', false)
            .modal('setting', 'transition', 'vertical flip')
            .modal('show');
        this.startCodeVerificationTicker();
    }

    _hideCodeVerificationModal () {
        $('#CodeVerificationModal')
            .modal('hide');
    }

    _showPersonInfoModal () {
        $('#PersonInfoModal')
            .modal('setting', 'closable', false)
            .modal('setting', 'transition', 'vertical flip')
            .modal('show');
    }

    _hidePersonInfoModal () {
        $('#PersonInfoModal')
            .modal('hide');
    }

    _showPasswordChangeModal () {
        $('#PasswordChangeModal')
            .modal('setting', 'closable', false)
            .modal('setting', 'transition', 'vertical flip')
            .modal('show');
    }

    _hidePasswordChangeModal () {
        $('#PasswordChangeModal')
            .modal('hide');
    }

    confirmOTPCode() {

        clearInterval(this.codeTimerInterval);

        let params = {
            otp: this.state.otp,
            otpID: this.state.otpID
        };
        console.log("confirmOTPCode: ", params);

        $.ajax({
            url: verifyOTPURL,
            contentType: "application/json; charset=utf-8",
            type: 'POST',
            headers: {
                "cache-control": "no-cache"
            },
            dataType: 'json',
            data: JSON.stringify(params),
            success: (data, textStatus, xhr) => {
                console.log('verifyOTP: ', data); // log
                this.setState({person: data.person}, () => {
                    this._hideCodeVerificationModal();
                    setTimeout(() => {
                        this._showPersonInfoModal()
                    }, 4000);
                });
            },
            error: (xhr) => {
                if (!isNullUndefined(xhr.responseJSON)) {
                    this._notificationAlert(xhr.responseJSON.message,  xhr.responseJSON.type, 3000);
                } else {
                    this._notificationAlert('Something went wrong. Please Retry', 'error', 3000);

                }
            }
        });
    }

    savePersonDetails () {
        console.log("save person details: ", this.state.person);
        let personDetails = this.state.person;
        $.ajax({
            url: confirmPersonDetailsURL,
            contentType: "application/json; charset=utf-8",
            type: 'POST',
            headers: {
                "cache-control": "no-cache"
            },
            dataType: 'json',
            data: JSON.stringify(personDetails),
            success: (data, textStatus, xhr) => {
                console.log('savePersonDetails: ', data); // log
                console.log('savePersonDetails xhr: ', xhr); // log
                this._notificationAlert(data.message, data.type, 3000);
                this._hidePersonInfoModal();
                setTimeout(() => {
                    this._showPasswordChangeModal();
                }, 4000);
            },
            error: (xhr) => {
                if (!isNullUndefined(xhr.responseJSON)) {
                    this._notificationAlert(xhr.responseJSON.message, xhr.responseJSON.type, 3000);
                } else {
                    this._notificationAlert('Something went wrong. Please Retry', 'error', 3000);

                }
            }
        });

    }

    cancelPersonDetails () {
        console.log("cancelling person details: ");
        this.setState({person: null}, () => {
            this._hidePersonInfoModal();
        })

    }

    _notificationAlert = (message, type, timeoutValue) => {
        let timeout = 2500;  // 2.5 seconds
        if (!isNullUndefined(timeoutValue) && !isNaN(timeoutValue)) {
            timeout = timeoutValue;
        }
        this.setState({
            messageResponses: {
                message: message,
                type: type,
                hidden: false
            }
        }, () => setTimeout(() => this.setState({
            messageResponses: {
                message: '',
                type: '',
                hidden: true
            }
        }), timeout));
    }


    handleChangePassword () {
        let pword = $('input[type=password][name=newPassword]').val();
        let pwordConfirm = $('input[type=password][name=confirmNewPassword]').val();
        console.log('pword: ',pword);
        console.log('pwordConfirm: ',pwordConfirm);

        if ((pword === '' || pword === null || pword === undefined) ||
            (pwordConfirm === '' || pwordConfirm === null || pwordConfirm === undefined)) {
            this._notificationAlert('Password fields cannot be empty.', 'error');
            return;
        }

        if (pword !== pwordConfirm) {
            this._notificationAlert('Passwords do not match.', 'error');
            return;
        }

        const strongPasswordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');

        if (!strongPasswordRegex.test(pword)) {
            this._notificationAlert('Weak password. Must contain at least 1 uppercase character, ' +
                '1 lowercase character, 1 symbol, and must be at least 8 characters long.', 'error');
            return;
        }


        let params = {
            password: pword,
            person: this.state.person.id
        };

        console.log("CHANGING PASSWORD: ", params);

        $.ajax({
            url: setNewPasswordURL,
            contentType: "application/json; charset=utf-8",
            type: 'POST',
            headers: {
                "cache-control": "no-cache"
            },
            dataType: 'json',
            data: JSON.stringify(params),
            async: false,
            success: (data, textStatus, xhr) => {
                console.log("updated password",data);
                this._notificationAlert(data.message, 'info');
                $('input[type=password][name=newPassword]').val('');
                $('input[type=password][name=confirmNewPassword]').val('');
                this._hidePasswordChangeModal();
                window.location.replace('/');

            },
            error: (xhr, textStatus, errorThrown) => {
                console.log(textStatus);
                if (xhr.responseJSON !== undefined) {
                    this._notificationAlert(xhr.responseJSON.message, 'error'); // type: xhr.responseJSON.status,
                } else {
                    this._notificationAlert('Change password fail. Your provided current password may be incorrect.', 'error');
                }
            }
        });
    }


    textChanged = (event) => {
        let values = this.state.person;
        values['' + event.target.name + ''] = event.target.value;
        console.log("textChanged: ", values);
        this.setState({person: values});
    }

    _userNameChanged = (event) => {
        let values = this.state.person;
        values.credentials.userName = event.target.value;
        this.setState({person: values});
    }

    idTypeChanged = (passedValue) => {
        let tmp = this.state.person;
        tmp.idType.code = passedValue.value;
        this.setState({
            person: tmp
        });
    }

    startCodeVerificationTicker () {
        const startCountDown = new Date().getTime();
        const endCountDown = startCountDown + (1000 * 30);
        this.timeRemaining = (endCountDown - startCountDown) / 1000;
        this.codeTimerInterval = setInterval(() => {
            this.timeRemaining--;
            if (this.timeRemaining <= 0) {
                clearInterval(this.codeTimerInterval);
            }
            this.forceUpdate();
        }, 1000);


    }


    resendVerificationEmail () {
       this._hideCodeVerificationModal();
       if(!isNullUndefined(this.state.otpID)){
           let emailValue = $('input[type=email][name=email]').val();
           let email = isEmailValid(emailValue, "Email ");

           if (email.isValid) {
               let params = {
                   email: emailValue,
                   otpID: this.state.otpID
               };
               console.log(params);
               $.ajax({
                   url: resendVerificationCodeURL,
                   contentType: "application/json; charset=utf-8",
                   type: 'POST',
                   headers: {
                       "cache-control": "no-cache"
                   },
                   dataType: 'json',
                   data: JSON.stringify(params),
                   success: (data, textStatus, xhr) => {
                       console.log('move: ', data); // log
                       // $('#signUpForm').submit();
                       this.setState({otpID: data.otp}, () => {
                           this._toggleMessageDisplay(data.message, 'success');
                       });
                       setTimeout(() => {
                           this._showCodeVerificationModal()
                       }, 4000);


                   },
                   error: (xhr) => {

                       if (xhr.responseJSON !== undefined) {
                           this._toggleMessageDisplay(xhr.responseJSON.message, xhr.responseJSON.type);
                       } else {
                           this._toggleMessageDisplay('Fail. Please retry.', 'error');
                       }
                       console.log('form not sent');
                   }
               });
           } else {
               this._toggleMessageDisplay(email.message, 'error');
           }
       }
    }

    render () {
        return (
            <div className="sixteen wide tablet">
                <div className="ui grid">
                    <div className="row">
                        <div className="four wide column" style={{padding: 60, backgroundColor: "#4D335B"}}>
                            <div className="ui middle aligned center aligned grid">
                                <div className="column">
                                    <div id="erroMessageDisplay">
                                        <div className="ui message">
                                            <i className="close icon"></i>
                                            <div className="header">
                                                {this.state.responseMsg}
                                            </div>
                                        </div>
                                        <br/><br/><br/>
                                    </div>
                                    <h2 className="ui teal image header">
                                        <img className="image" style={{width: "70%", height: "4%", marginBottom: 10}}
                                             src=""/>

                                    </h2>
                                    <div className="content">
                                        <span
                                            style={{color: "#f7f7f7", fontSize: 18}}>Enter a valid email address</span>
                                    </div>
                                    <form id="signUpForm" className="ui form">
                                        <div style={{marginRight: 100, marginLeft: 100, margin: 30}}>
                                            <div className="field">
                                                <input
                                                    style={{height: 50}}
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    onSubmit={() => {this._verifyEmail()}}
                                                />
                                                <span className="highlight"/><span className="bar"/>
                                            </div>

                                            <button id="signUpFormSubmitBtn"
                                                // style={{height:50,borderRadius:25,backgroundColor:"#AC498E"}}
                                                    className="ui fluid large submit button button-login"
                                                    onClick={() => {
                                                        this._verifyEmail()
                                                    }}>
                                                Verify Email Address
                                                <div className="ripples buttonRipples">
                                                    <span className="ripplesCircle"/>
                                                </div>
                                            </button>
                                        </div>
                                    </form>

                                    <i className="plus icon"
                                       style={{textAlign: "left", color: "#AC498E", paddingLeft: 20}}/>
                                    <a href="/login" className="right floated "
                                       style={{
                                           textAlign: "left", color: "#AC498E", paddingLeft: 20, fontSize: 16,
                                       }}
                                    >Login Instead</a>
                                </div>
                            </div>

                        </div>
                        <div className="twelve wide column landing-color">
                            <div className="segment">


                            </div>
                        </div>
                        <div className="ui container">
                            <div className="bodyContent ui center aligned floating message">
                                {
                                    <CodeVerification otp={this.state.otp}
                                                      otpChange={this.otpChange}
                                                      confirmOTPCode={this.confirmOTPCode}
                                                      timeRemaining={this.timeRemaining}
                                                      messageResponses={this.state.messageResponses}
                                                      resendVerificationEmail = {this.resendVerificationEmail}

                                    />
                                }
                                {
                                    <PersonInfo person={this.state.person}
                                                messageResponses={this.state.messageResponses}
                                                savePersonDetails={this.savePersonDetails}
                                                cancelPersonDetails={this.cancelPersonDetails}
                                                idTypeChanged={this.idTypeChanged}
                                                textChanged={this.textChanged}
                                    />
                                }
                                {
                                    <PasswordChange handleChangePassword={this.handleChangePassword}
                                                    messageResponses={this.state.messageResponses}
                                    />
                                }
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        )
    }
}

class CodeVerification extends Component{

    render () {
        return (
            <div id="CodeVerificationModal" className="large ui modal">
                <Notification messageResponses={this.props.messageResponses} scrollToTop={false}/>
                <OTPVerificationInput
                    inputLength={6}
                    value={this.props.otp}
                    validInputType={'number'}
                    onChange={this.props.otpChange}
                    confirmCode={this.props.confirmOTPCode}
                    confirmCodeBtnText={"Confirm Code"}
                    name={"verCodeInput"}


                />
                {
                    this.props.timeRemaining > 0 && (
                        <div>
                            <p style={{fontSize: 100, marginLeft: 100}}> {this.props.timeRemaining} </p>
                        </div>
                    )
                }
                {
                    this.props.timeRemaining === 0 &&
                    (
                        <div className="ui animated fade button" onClick={this.props.resendVerificationEmail}>
                            <div className="visible content" >I have not receive a code</div>
                            <div className="hidden content">
                                Resent!
                            </div>
                        </div>
                    )
                }

            </div>
        );
    }
}

class PersonInfo extends Component {
    render () {
        return (
            <div id="PersonInfoModal" className="fullscreen ui modal">
                <Notification messageResponses={this.props.messageResponses} scrollToTop={false}/>
                <PersonForm
                    person={this.props.person}
                    policy='inclusion'
                    packageBox={['idType', 'idNumber', 'credentials.userName']}
                    idTypeChanged={this.props.idTypeChanged}
                    textChanged={this.props.textChanged}
                    savePerson={this.props.savePersonDetails}
                    cancelPerson={this.props.cancelPersonDetails}
                />
            </div>
        )
    }
}

class PasswordChange extends Component{
    render () {
        return (
            <div id="PasswordChangeModal" className="large ui modal">
                <div className=" ui segment">

                    <div className="center aligned segment">
                        <h2 className="ui top center aligned attached header">Set a new password</h2>
                        <Notification messageResponses={this.props.messageResponses} scrollToTop={false}/>
                        <div className="ui small form">
                            <div className="two fields">
                                <div className="field">
                                    <label>Enter New Password</label>
                                    <input id="inputColor"
                                           placeholder="Enter New Password"
                                           type="password"
                                           name="newPassword"/>
                                </div>
                                <div className="field">
                                    <label>Confirm New Password</label>
                                    <input id="inputColor"
                                           placeholder="Confirm New Password"
                                           type="password"
                                           name="confirmNewPassword"/>
                                </div>
                            </div>
                        </div>
                        <div className="ui bottom  attached segment">
                            <button className="ui positive button"
                                    onClick={this.props.handleChangePassword}>Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


ReactDOM.render(<RegisterEmail/>, document.getElementById('content'));
