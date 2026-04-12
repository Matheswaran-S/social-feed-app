import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import { withRouter } from '../common/with-router';

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger py-2" role="alert" style={{ borderRadius: "8px", fontSize: "0.9rem" }}>
        ⚠️ This field is required!
      </div>
    );
  }
};

const email = value => {
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
    return (
      <div className="alert alert-danger py-2" role="alert" style={{ borderRadius: "8px", fontSize: "0.9rem" }}>
        ❌ Invalid email address!
      </div>
    );
  }
};

const vusername = value => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger py-2" role="alert" style={{ borderRadius: "8px", fontSize: "0.9rem" }}>
        ⚠️ Username must be 3-20 characters!
      </div>
    );
  }
};

const vpassword = value => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger py-2" role="alert" style={{ borderRadius: "8px", fontSize: "0.9rem" }}>
        ⚠️ Password must be 6-40 characters!
      </div>
    );
  }
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: "",
      email: "",
      password: "",
      successful: false,
      message: ""
    };
  }

  onChangeUsername(e) {
    this.setState({ username: e.target.value });
  }

  onChangeEmail(e) {
    this.setState({ email: e.target.value });
  }

  onChangePassword(e) {
    this.setState({ password: e.target.value });
  }

  handleRegister(e) {
    e.preventDefault();

    this.setState({ message: "", successful: false });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.register(this.state.username, this.state.email, this.state.password).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true
          });
        },
        error => {
          const resMessage =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage
          });
        }
      );
    }
  }

  render() {
    return (
      <div style={{ 
        minHeight: "100vh", 
        width: "100vw",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        margin: 0,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "auto"
      }}>
        <div style={{ width: "100%", maxWidth: "450px" }}>
          {/* Main Card */}
          <div className="card shadow-lg" style={{ 
            border: "none", 
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            width: "100%"
          }}>
            <div className="card-body p-4 p-md-5">
              {/* Logo/Avatar */}
              <div className="text-center mb-4">
                <div style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 15px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
                }}>
                  <span style={{ fontSize: "2rem", color: "white" }}>📝</span>
                </div>
                <h3 className="font-weight-bold" style={{ color: "#343a40", marginBottom: "5px" }}>
                  Create Account
                </h3>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  Join our community today
                </p>
              </div>

              <Form
                onSubmit={this.handleRegister}
                ref={c => { this.form = c; }}
              >
                {!this.state.successful && (
                  <>
                    {/* Username Field */}
                    <div className="form-group mb-3">
                      <label htmlFor="username" style={{ 
                        fontWeight: "600", 
                        color: "#495057",
                        fontSize: "0.9rem",
                        marginBottom: "8px",
                        display: "block"
                      }}>
                        Username
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" style={{ 
                            background: "#f8f9fa", 
                            border: "2px solid #e9ecef",
                            borderRight: "none",
                            borderRadius: "12px 0 0 12px",
                            padding: "12px 15px"
                          }}>
                            👤
                          </span>
                        </div>
                        <Input
                          type="text"
                          className="form-control"
                          name="username"
                          placeholder="Choose a username"
                          value={this.state.username}
                          onChange={this.onChangeUsername}
                          validations={[required, vusername]}
                          style={{
                            border: "2px solid #e9ecef",
                            borderLeft: "none",
                            borderRadius: "0 12px 12px 0",
                            padding: "12px 15px",
                            fontSize: "1rem",
                            height: "auto"
                          }}
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="form-group mb-3">
                      <label htmlFor="email" style={{ 
                        fontWeight: "600", 
                        color: "#495057",
                        fontSize: "0.9rem",
                        marginBottom: "8px",
                        display: "block"
                      }}>
                        Email
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" style={{ 
                            background: "#f8f9fa", 
                            border: "2px solid #e9ecef",
                            borderRight: "none",
                            borderRadius: "12px 0 0 12px",
                            padding: "12px 15px"
                          }}>
                            📧
                          </span>
                        </div>
                        <Input
                          type="text"
                          className="form-control"
                          name="email"
                          placeholder="Enter your email"
                          value={this.state.email}
                          onChange={this.onChangeEmail}
                          validations={[required, email]}
                          style={{
                            border: "2px solid #e9ecef",
                            borderLeft: "none",
                            borderRadius: "0 12px 12px 0",
                            padding: "12px 15px",
                            fontSize: "1rem",
                            height: "auto"
                          }}
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="form-group mb-4">
                      <label htmlFor="password" style={{ 
                        fontWeight: "600", 
                        color: "#495057",
                        fontSize: "0.9rem",
                        marginBottom: "8px",
                        display: "block"
                      }}>
                        Password
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" style={{ 
                            background: "#f8f9fa", 
                            border: "2px solid #e9ecef",
                            borderRight: "none",
                            borderRadius: "12px 0 0 12px",
                            padding: "12px 15px"
                          }}>
                            🔒
                          </span>
                        </div>
                        <Input
                          type="password"
                          className="form-control"
                          name="password"
                          placeholder="Create a password"
                          value={this.state.password}
                          onChange={this.onChangePassword}
                          validations={[required, vpassword]}
                          style={{
                            border: "2px solid #e9ecef",
                            borderLeft: "none",
                            borderRadius: "0 12px 12px 0",
                            padding: "12px 15px",
                            fontSize: "1rem",
                            height: "auto"
                          }}
                        />
                      </div>
                    </div>

                    {/* Sign Up Button */}
                    <div className="form-group mb-3">
                      <button
                        className="btn btn-primary btn-block"
                        style={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          border: "none",
                          borderRadius: "12px",
                          padding: "14px",
                          fontSize: "1rem",
                          fontWeight: "600",
                          boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                          transition: "all 0.3s ease",
                          width: "100%"
                        }}
                      >
                        Sign Up
                      </button>
                    </div>
                  </>
                )}

                {/* Success/Error Message */}
                {this.state.message && (
                  <div className="form-group">
                    <div
                      className={this.state.successful ? "alert alert-success" : "alert alert-danger"}
                      role="alert"
                      style={{ 
                        borderRadius: "12px",
                        fontSize: "0.9rem",
                        border: "none"
                      }}
                    >
                      {this.state.successful ? "✅ " : "❌ "}{this.state.message}
                    </div>
                  </div>
                )}

                <CheckButton style={{ display: "none" }} ref={c => { this.checkBtn = c; }} />
              </Form>

              {/* Login Link */}
              <div className="text-center mt-4 pt-3" style={{ borderTop: "1px solid #e9ecef" }}>
                <p style={{ color: "#6c757d", fontSize: "0.9rem", margin: 0 }}>
                  Already have an account?{" "}
                  <Link to="/login" style={{ 
                    color: "#667eea", 
                    fontWeight: "600",
                    textDecoration: "none"
                  }}>
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-4">
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem" }}>
              © 2024 bezKoder. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Register);