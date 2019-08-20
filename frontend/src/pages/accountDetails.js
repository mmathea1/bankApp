import {Form, Input} from "reactstrap";


var UserAccount = React.createClass({
    getInitialState: function () {
        return {
            selectedUser : null,
            task: 'Edit ',
            updatePassword : false,
            profileImageFileName: null,
            userGmailAddress: null,
            getImageFromGoogle: false,
            displayEditPersonDetailsForm : false,
            messageResponses: {
                message: '',
                type: '',
                hidden: true,
                onDismiss: 'onDismiss'
            }
        }
    },

    componentWillMount: function() {
        this._getLoggedInUser();
    },

    componentDidMount() {
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
        $('.custom.example .ui.embed').embed({
            source      : 'youtube',
            id          : 'O6Xo21L0ybE',
            placeholder : '/assets/images/15.png'
        });

        $('.menu .item')
            .tab();
    },



    _notificationAlert : function(message, type) {
        this.setState({messageResponses: {
                message: message,
                type: type,
                hidden: false
            }}, () => setTimeout(() => this.setState({
            messageResponses: {
                message: '',
                type: '',
                hidden: true
            }
        }), 2500));
    },

    _getLoggedInUser : function() {

        let paramArray = {};
        // paramArray.user = identity;
        let params = JSON.stringify(paramArray);

        jQuery.ajax({
            url: getLoggedInUserURL,
            contentType: "application/json; charset=utf-8",
            type: 'POST',
            headers: {
                "cache-control": "no-cache"
            },
            dataType: 'json',
            data: params,
            async : false,
            success: function(data, textStatus, xhr) {
                console.log('This user: ', data); // log
                this.setState({selectedUser : data});
            }.bind(this),
            error: function(xhr, textStatus, errorThrown) {
                if (xhr.responseJSON !== undefined) {
                    this._notificationAlert(xhr.responseJSON.message, 'info'); // type: xhr.responseJSON.status,
                } else {
                    this._notificationAlert('Error! Retrieve user details fail!', 'info');
                }
            }
        });
    },

    _handleUpdateDetailsClick : function() {
        this.setState({displayEditPersonDetailsForm: true});
    },

    _textChanged : function(event){
        var values = this.state.selectedUser;
        values['' + event.target.name + ''] = event.target.value;
        this.setState( { selectedUser: values });
    },

    _idTypeChanged: function (passedValue) {
        var tmp = this.state.selectedUser;
        tmp.idType.code = passedValue.value;
        this.setState({
            selectedUser: tmp
        });
    },

    _handleUpdatePersonDetailsClick: function () {
        // this._startPageLoader();
        let user = this.state.selectedUser;
        delete user.username;
        user.urlOrigin = getURLOrigin();
        var params = JSON.stringify(user);
        $.ajax({
            async: false,
            url: updateUserURL,
            contentType: "application/json; charset=utf-8",
            method: 'POST',
            headers: {
                "cache-control": "no-cache"
            },
            dataType: 'json',
            data: params,
            cache: false,
            success: function (data) {
                this.setState({displayEditPersonDetailsForm: false}, () => {
                    this._notificationAlert(data.message, 'info'); // type: data.type
                    window.location.reload();
                });
            }.bind(this),
            error: function (xhr, status, err) {
                // this._stopPageLoader();
                if (xhr.responseJSON !== undefined) {
                    this._notificationAlert(xhr.responseJSON.message, 'info'); // type: xhr.responseJSON.status,
                } else {
                    this._notificationAlert('Error! Update details fail!', 'info');
                }
            }.bind(this)
        });
    },

    _cancelPerson : function() {
        this.setState({displayEditPersonDetailsForm : false});
    },

    fileValueChanged: function (event) {
        // let photoFile = this.state.selectedUser.photoFile;
        let photoValue = event.target.value;
        this.setState({profileImageFileName: photoValue});
    },

    profileImageFilesUploadClick : function () {
        let propertyFileInput = "#profileImageUpload";
        $(propertyFileInput).click();
    },

    _saveProfilePicture : function () {
        let profileImageFormData = new FormData();
        let ppFileName = "#profileImageUpload";
        profileImageFormData.append('profileImageUpload', $(ppFileName)[0].files[0]);
        console.log("imageData: ", profileImageFormData.get('profileImageUpload'));

        $.ajax({
            url: saveProfileImageURL,
            type: 'POST',
            headers: {
                "cache-control": "no-cache"
            },
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            async: false,
            cache: false,
            data: profileImageFormData,
            dataType: 'json',
            // data: params,
            success: (data, textStatus, xhr) => {
                console.log('data ', data);// log
                // this.setState({profileImageFileName: data});
                window.location.reload();
                //
            },
            error: (xhr) => {
                if (xhr.responseJSON !== undefined) {
                    return this._notificationAlert(xhr.responseJSON.message, xhr.responseJSON.type);
                }

            }
        });

    },

    getProfileImageFromGoogle: function () {
        var gmailAddress = this.state.userGmailAddress;
        // let submitURL = getGooglePlusImageURL + gmailAddress +"?alt=json";

        // console.log('url ', submitURL);// log
        console.log('url ', getGooglePlusImageURL + "?emailAddress=" + gmailAddress);// log
        $.ajax({
            // url: submitURL,
            url: getGooglePlusImageURL + "?emailAddress=" + gmailAddress,
            type: 'POST',
            dataType: 'json',
            data: gmailAddress,
            headers: {
                "cache-control": "no-cache"
            },
            success: (data, textStatus, xhr) => {
                console.log('textStatus ', textStatus);// log
                console.log('url ', getGooglePlusImageURL + "?emailAddress=" + gmailAddress);// log
                // console.log('url ', submitURL);// log
                if(data === 'success'){
                    window.location.reload();
                }
                //
            },
            error: (xhr) => {
                if (xhr.responseJSON !== undefined) {
                    window.location.reload();
                    return this._notificationAlert(xhr.responseJSON.message, xhr.responseJSON.type);
                }

            }
        });
    },

    getUserGmailAddress: function (event) {
        //text is a valid email
        //email ends with @gmail.com
        var gmailAddress = event.target.value;
        // let validEmail = new RegExp('^[\\w.+\\-]+@gmail\\.com$');
        // if(gmailAddress.match(validEmail)){
        //
        // }

        this.setState( { userGmailAddress: gmailAddress });
        // console.log("gmail: ", gmailAddress);
    },

    _handleChangePassword : function() {

        let currentPword = $('input[type=password][name=currentPassword]').val();
        let pword = $('input[type=password][name=newPassword]').val();
        let pwordConfirm = $('input[type=password][name=confirmNewPassword]').val();
        // console.log('currentPword: ',currentPword);
        // console.log('pword: ',pword);
        // console.log('pwordConfirm: ',pwordConfirm);

        if (currentPword === '' || currentPword === null || currentPword === undefined ||
            pword === '' || pword === null || pword === undefined ||
            pwordConfirm === '' || pwordConfirm === null || pwordConfirm === undefined) {
            this._notificationAlert('Password fields cannot be empty.', 'error');
            return;
        };
        if (pword !== pwordConfirm) {
            this._notificationAlert('Passwords do not match.', 'error');
            return;
        };

        var strongPasswordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');

        if(!strongPasswordRegex.test(pword)) {
            this._notificationAlert('Weak password. Must contain at least 1 uppercase character, '+
                '1 lowercase character, 1 symbol, and must be at least 8 characters long.', 'error');
            return;
        }

        let paramArray = {};
        paramArray.currentPassword = currentPword;
        paramArray.password = pword;
        // paramArray.user = identity;
        let params = JSON.stringify(paramArray);

        $.ajax({
            url: changePasswordURL,
            contentType: "application/json; charset=utf-8",
            type: 'POST',
            headers: {
                "cache-control": "no-cache"
            },
            dataType: 'json',
            data: params,
            async : false,
            success: (data, textStatus, xhr) => {
                this._notificationAlert(data.message, 'info');
                $('input[type=password][name=currentPassword]').val('');
                $('input[type=password][name=newPassword]').val('');
                $('input[type=password][name=confirmNewPassword]').val('');
                this.setState({updatePassword : false});
            },
            error: (xhr, textStatus, errorThrown) => {
                if (xhr.responseJSON !== undefined) {
                    this._notificationAlert(xhr.responseJSON.message, 'error'); // type: xhr.responseJSON.status,
                } else {
                    this._notificationAlert('Change password fail. Your provided current password may be incorrect.', 'error');
                }
            }
        });
    },


    render: function() {
        let profileImageFile = this.state.selectedUser
            && this.state.selectedUser.photoFile;

        let profileImage = null;

        var pattern = new RegExp('(http)?s?:?(\/\/[^"]*\.(?:png|jpg|jpeg|gif|png|svg))','i');
        if(!pattern.test(profileImageFile)) {
            profileImage = (getProfileImageURL + '?filename=' + profileImageFile);
        } else {
            profileImage = profileImageFile;
        }

        return (
            <div className="ui container">
                <div className="ui hidden marginTop120"></div>
                <Notification messageResponses={this.state.messageResponses}/>
                <div className="ui grid">
                    <div className="four wide column">

                        <div className="ui attached segment">
                            <div className="ui attached form">
                                <div  className="ui  segment">

                                    <img className="ui centered small circular image"
                                        // src={this.state.profileImageFileName}
                                         src={!isEmptyString(profileImageFile) ? profileImage : ''}
                                         alt="profile picture"

                                    />
                                    <div className="left floated center aligned column AccountTop ">
                                        <h2 style={{padding:20}}>{this.state.selectedUser && this.state.selectedUser.name}</h2>
                                    </div>
                                </div>
                                <div className="ui horizontal divider">
                                    Profile Details
                                </div>
                                <div className="ui segment">
                                    <div className="ui relaxed divided list" style={{padding: 40}}>
                                        <div className="item">
                                            <i className="at icon"></i>
                                            <div className="content">
                                                <span className="userLabel" > Username :</span>
                                                <span className="userLabelout">{this.state.selectedUser && this.state.selectedUser.username}</span>
                                            </div>
                                        </div>

                                        <div className="item">
                                            <i className="envelope icon"></i>
                                            <div className="content">
                                                <label className="userLabel">Email :</label>
                                                <label className="userLabelout">{this.state.selectedUser && this.state.selectedUser.email}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="twelve wide column">
                        <div className="ui attached segment">
                            <div className="ui segment">
                                <div className="ui top attached tabular menu">
                                    <a className='active item' data-tab="profile">Update Profile Details</a>
                                    <a className='item' data-tab="password">Update Password</a>
                                    <a className='item' data-tab="p-picture">Change Profile Picture</a>
                                </div>
                                <div className="ui bottom attached segment  active tab" data-tab="profile">
                                    {
                                        // this.state.displayEditPersonDetailsForm &&
                                        // this.state.displayEditPersonDetailsForm && (
                                        //TODO: create custom component for person form
                                        <Form
                                            person={this.state.selectedUser}
                                            task={this.state.task}
                                            textChanged={this._textChanged}
                                            idTypeChanged={this._idTypeChanged}
                                            savePerson={this._handleUpdatePersonDetailsClick}
                                            cancelPerson={this._cancelPerson}
                                        />
                                        // )
                                    }
                                </div>
                                <div className="ui bottom attached segment tab" data-tab="password">
                                    {
                                        // this.state.updatePassword && (
                                        <div>
                                            <div className="ui small form">
                                                <div className="two fields">
                                                    <div className="field">
                                                        <label>Current Password</label>

                                                        <input id="inputColor" placeholder= "Current Password" type="password" name="currentPassword" />
                                                    </div>
                                                    <div className="field">
                                                        <label>Enter New Password</label>
                                                        <input id="inputColor" placeholder="Enter New Password" type="password"name="newPassword" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ui small form">
                                                <div className="two fields">
                                                    <div className="field">
                                                        <label>Confirm New Password</label>
                                                        <input id="inputColor" placeholder="Confirm New Password" type="password" name="confirmNewPassword" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ui bottom  attached segment">
                                                    <button className="ui positive button"
                                                            onClick={this._handleChangePassword}>Change Password</button>
                                                </div>
                                        </div>

                                    }
                                </div>
                                <div className="ui bottom attached segment tab" data-tab="p-picture">
                                    <div className="ui small form">
                                        <div className="two fields">

                                            <div className="field">
                                                <div>
                                                    <Input
                                                        type={'file'}
                                                        fileName={this.state.profileImageFileName && this.state.profileImageFileName}
                                                        name={'profileImageUpload'}
                                                        id={"profileImageUpload"}
                                                        htmlFor={'profileImageUpload'}
                                                        accept=".jpg, .jpeg, .JPEG, .JPG, .png"
                                                        multiple={false}
                                                        isrequired={true}
                                                        handleChange={this.fileValueChanged}
                                                        label="Upload from PC"
                                                        onClick={this.profileImageFilesUploadClick}
                                                    />
                                                </div>

                                                <button className="ui labeled icon secondary button"
                                                        style={{marginTop:20}}
                                                        onClick={this._saveProfilePicture}>
                                                    <i className="camera icon"></i>
                                                    Save Picture </button>

                                            </div>
                                            <div className="field">
                                                <div>
                                                    <Input id={'gmailAddress'}
                                                           type={'email'}
                                                           name={'gmailAddress'}
                                                           placeholder="janeDoe@gmail.com"
                                                           value={this.state.userGmailAddress}
                                                           onChange={this.getUserGmailAddress}
                                                           label="Enter a valid Gmail Address"
                                                    />

                                                </div>

                                                <button className="ui labeled right floated icon secondary button"
                                                        style={{marginTop:20}}
                                                        onClick={this.getProfileImageFromGoogle}>
                                                    <i className="google icon"></i>
                                                    Upload from Google
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

});

ReactDOM.render( <UserAccount />, document.getElementById( 'appContent' ) );
