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

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: "",
      password: "",
      loading: false,
      message: ""
    };
  }

  onChangeUsername(e) {
    this.setState({ username: e.target.value });
  }

  onChangePassword(e) {
    this.setState({ password: e.target.value });
  }

  handleLogin(e) {
    e.preventDefault();

    this.setState({ message: "", loading: true });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.login(this.state.username, this.state.password).then(
        () => {
          this.props.router.navigate("/profile");
          window.location.reload();
        },
        error => {
          const resMessage =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            loading: false,
            message: resMessage
          });
        }
      );
    } else {
      this.setState({ loading: false });
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
                  <span style={{ fontSize: "2rem", color: "white" }}>🔐</span>
                </div>
                <h3 className="font-weight-bold" style={{ color: "#343a40", marginBottom: "5px" }}>
                  Welcome Back!
                </h3>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  Sign in to access your feed
                </p>
              </div>

              <Form
                onSubmit={this.handleLogin}
                ref={c => { this.form = c; }}
              >
                {/* Username Field */}
                <div className="form-group mb-4">
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
                      placeholder="Enter your username"
                      value={this.state.username}
                      onChange={this.onChangeUsername}
                      validations={[required]}
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
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label htmlFor="password" style={{ 
                      fontWeight: "600", 
                      color: "#495057",
                      fontSize: "0.9rem",
                      margin: 0
                    }}>
                      Password
                    </label>
                    <Link to="#" style={{ 
                      fontSize: "0.8rem", 
                      color: "#667eea",
                      textDecoration: "none"
                    }}>
                      Forgot password?
                    </Link>
                  </div>
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
                      placeholder="Enter your password"
                      value={this.state.password}
                      onChange={this.onChangePassword}
                      validations={[required]}
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

                {/* Remember Me */}
                <div className="form-group mb-4">
                  <div className="custom-control custom-checkbox">
                    <input type="checkbox" className="custom-control-input" id="rememberMe" />
                    <label className="custom-control-label" htmlFor="rememberMe" style={{ 
                      fontSize: "0.9rem", 
                      color: "#6c757d",
                      cursor: "pointer"
                    }}>
                      Remember me
                    </label>
                  </div>
                </div>

                {/* Login Button */}
                <div className="form-group mb-3">
                  <button
                    className="btn btn-primary btn-block"
                    disabled={this.state.loading}
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
                    {this.state.loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm mr-2"></span>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </div>

                {/* Error Message */}
                {this.state.message && (
                  <div className="form-group">
                    <div className="alert alert-danger" role="alert" style={{ 
                      borderRadius: "12px",
                      fontSize: "0.9rem",
                      border: "none",
                      background: "#fee2e2",
                      color: "#dc2626"
                    }}>
                      ❌ {this.state.message}
                    </div>
                  </div>
                )}

                <CheckButton style={{ display: "none" }} ref={c => { this.checkBtn = c; }} />
              </Form>

              {/* Sign Up Link */}
              <div className="text-center mt-4 pt-3" style={{ borderTop: "1px solid #e9ecef" }}>
                <p style={{ color: "#6c757d", fontSize: "0.9rem", margin: 0 }}>
                  Don't have an account?{" "}
                  <Link to="/register" style={{ 
                    color: "#667eea", 
                    fontWeight: "600",
                    textDecoration: "none"
                  }}>
                    Sign up
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

export default withRouter(Login);