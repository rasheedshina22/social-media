import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Switch from 'react-ios-switch';
import FormField from '../../../ultils/Form/FormField';
import './profilesetting.scss';
import { update, generateData } from '../../../ultils/Form/FormActions';
import { User, Lock } from 'tabler-icons-react'
import { updateprofileimgfile, updateprofileimg, changeProfile, updateprofile, auth } from '../../../../actions/user_action';
import { withRouter } from 'react-router-dom';
import { Button, CircularProgress, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert'
import Layout from '../../Layout/index';

class EditAccount extends Component {
    state = {
        privateMode: false,
        inputValue: "",
        settingState: 'profile',
        edited: false,
        formError: false,
        formSuccess: false,
        loading: false,
        setSnack: false,
        severity: "",
        message: "",
        formData: {
            email: {
                element: 'input',
                value: '',
                config: {
                    placeholder: 'Email của bạn',
                    label: 'Email',
                    name: 'email',
                    options: [],
                },
                validation: {
                    required: true,
                    email: true
                },
                valid: false,
                touched: false,
                validationMessage: '',
                showlabel: false
            },
            name: {
                element: 'input',
                value: '',
                config: {
                    placeholder: 'Tên của bạn',
                    label: 'Tên',
                    name: 'name',
                    options: [],
                },
                validation: {
                    required: false,
                },
                valid: false,
                touched: false,
                validationMessage: '',
                showlabel: false
            },
            bio: {
                element: 'textarea',
                value: '',
                config: {
                    placeholder: 'Mô tả về bản thân bạn',
                    label: 'Tiểu sử',
                    name: 'bio',
                    options: [],
                },
                validation: {
                    required: false,
                },
                valid: false,
                touched: false,
                validationMessage: '',
                showlabel: false
            },
            userName: {
                element: 'input',
                value: '',
                config: {
                    placeholder: 'Tên tài khoản',
                    label: 'Tên tài khoản',
                    name: 'userName',
                    options: [],
                },
                validation: {
                    required: false,
                },
                valid: false,
                touched: false,
                validationMessage: '',
                showlabel: false
            },
        },
    }

    updateFields = (newFormData) => {
        this.setState({
            formData: newFormData
        })

    }
    submitForm = (event) => {
        this.setState({ loading: true })
        event.preventDefault();
        this.state.formData.privateMode = this.state.privateMode;
        let dataToSubmit = generateData(this.state.formData, 'update_pro')
        this.props.dispatch(changeProfile(this.props.user.userData._id, dataToSubmit))
            .then(response => {
                console.log(response)
                this.props.dispatch(auth());
                this.setState({ loading: false, setSnack: true, severity: "success", message: "Thành công" })
            })
    }

    updateForm = (element) => {
        const newFormdata = update(element, this.state.formData, 'update_pro');
        this.setState({
            formError: false,
            formData: newFormdata
        });
        this.setState({ edited: true })
    }
    onFileChange = async (event) => {
        this.setState({ loading: true })
        await this.props.dispatch(updateprofileimgfile(event.target.files[0]));
        await this.props.dispatch(updateprofileimg(this.props.user.img ? this.props.user.img.url : 0));
        await this.props.dispatch(auth());
        // await Headers.props.dispatch(updateprofileimg(this.props.user.img ? this.props.user.img.url : 0));
        await this.setState({ loading: false, setSnack: true, severity: "success", message: "Thành công"  });
        return (
            <Layout>
            </Layout>
        )
    }
    getUserForm() {
        this.state.formData.bio.value = this.props.user.userData.bio;
        this.state.formData.userName.value = this.props.user.userData.userName;
        this.state.formData.name.value = this.props.user.userData.name;
        this.state.formData.email.value = this.props.user.userData.email;
        const formData = this.state.formData;
        this.setState({ edited: false });
        this.updateFields(formData);
    }

    componentDidMount() {
        this.getUserForm();
    }

    handleSetting = (type) => {
        this.setState({ settingState: type })
    }

    render() {

        return (
            <Layout page="account">
                <div className="editAccount">
                    <div className="tittle">
                        <h3 >Chỉnh sửa tài khoản</h3>
                    </div>
                    <div className="row  no-gutters ">
                        {
                            this.state.settingState == 'profile' ?
                                <form className="col-xl-12 no-gutters setting_detail" onSubmit={(event) => this.submitForm(event)}>

                                    <div className="row  no-gutters  setting_type">
                                        <div className="col-xl-2  no-gutters  label">
                                            {
                                                this.state.loading ?
                                                    <div class="overlay"><CircularProgress style={{ color: '#5477D5' }} thickness={7} />
                                                    </div>

                                                    :
                                                    ''
                                            }

                                            <img src={this.props.user.userData.avt}></img>
                                        </div>
                                        <div className="col-xl-10 field">
                                            <h2>{this.props.user.userData.userName}</h2>
                                            <label className="custom-file-upload">
                                                <input type="file" onChange={this.onFileChange} />
                                                <h6>Chỉnh sửa ảnh đại diện</h6>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="row  no-gutters  setting_type">
                                        <div className="col-xl-2  no-gutters  label">
                                            <h3>Tên tài khoản</h3>
                                        </div>
                                        <div className="col-xl-10  field">
                                            <FormField
                                                //Có thể để trống phần description nên k cần xử lý event onChange,..
                                                id={'userName'}
                                                formData={this.state.formData.userName}
                                                change={(element) => this.updateForm(element)}

                                            />
                                        </div>
                                    </div>

                                    <div className="row  no-gutters  setting_type">
                                        <div className="col-xl-2  no-gutters  label">
                                            <h3>Tên</h3>
                                        </div>
                                        <div className="col-xl-10  field">
                                            <FormField
                                                //Có thể để trống phần description nên k cần xử lý event onChange,..
                                                id={'name'}
                                                formData={this.state.formData.name}
                                                change={(element) => this.updateForm(element)}
                                            />
                                        </div>
                                    </div>

                                    <div className="row  no-gutters  setting_type">
                                        <div className="col-xl-2  no-gutters  label">
                                            <h3>Email</h3>
                                        </div>
                                        <div className="col-xl-10   field">
                                            <FormField
                                                //Có thể để trống phần description nên k cần xử lý event onChange,..
                                                id={'email'}
                                                formData={this.state.formData.email}
                                                change={(element) => this.updateForm(element)}
                                            />
                                        </div>
                                    </div>

                                    <div className="row  no-gutters  setting_type">
                                        <div className="col-xl-2  no-gutters  label">
                                        </div>
                                        {
                                            this.state.edited ?
                                                <div className="col-xl-10  field">
                                                <Button className="send_btn" onClick={(event) => { this.submitForm(event) }}>
                                                        Gửi
                                                </Button>
                                                </div>
                                                :
                                                <div className="col-xl-10  field">
                                                    <Button className="send_btn disable" disabled="true" onClick={(event) => { this.submitForm(event) }}>
                                                        Cập nhật
                                            </Button>
                                                </div>
                                        }
                                    </div>
                                </form>
                                :
                                ''
                        }
                        
                    </div>
                    
                </div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    open={this.state.setSnack}
                    onClose={() => this.setState({ setSnack: false })}
                    autoHideDuration={1000}
                >
                    <MuiAlert elevation={6} variant="filled" severity={this.state.severity} >{this.state.message}</MuiAlert>
                </Snackbar>
            </Layout>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}

export default connect(mapStateToProps)(withRouter(EditAccount));