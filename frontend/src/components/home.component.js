import React, { Component } from "react";
import { Link } from "react-router-dom";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      posts: [],
      showPublicOnly: true,
      currentUser: undefined
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    this.setState({ currentUser: user });

    UserService.getPublicContent().then(
      response => {
        this.setState({ content: response.data });
      },
      error => {
        this.setState({ content: "Welcome to SocialFeed!" });
      }
    );

    // Sample feed data
    this.setState({
      posts: [
        {
          id: 1,
          title: "Getting Started with React",
          content: "React is a powerful library for building user interfaces. This post shows how to get started with components and state management.",
          username: "react_dev",
          avatar: "https://ui-avatars.com/api/?name=React+Dev&background=61dafb&color=fff",
          likes: 42,
          comments: 8,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 2,
          title: "Spring Boot + JWT Tutorial",
          content: "Learn how to secure your Spring Boot applications with JSON Web Tokens. Complete authentication flow included!",
          username: "java_guru",
          avatar: "https://ui-avatars.com/api/?name=Java+Guru&background=6db33f&color=fff",
          likes: 128,
          comments: 23,
          createdAt: new Date(Date.now() - 172800000).toISOString()
        },
        {
          id: 3,
          title: "Full Stack Development Tips",
          content: "Best practices for building full stack applications with React and Spring Boot. From CORS to deployment.",
          username: "fullstack_pro",
          avatar: "https://ui-avatars.com/api/?name=Full+Stack&background=764ba2&color=fff",
          likes: 89,
          comments: 15,
          createdAt: new Date(Date.now() - 259200000).toISOString()
        },
        {
          id: 4,
          title: "Database Design Patterns",
          content: "Understanding relational database design for scalable applications. One-to-many and many-to-many relationships explained.",
          username: "db_master",
          avatar: "https://ui-avatars.com/api/?name=DB+Master&background=f59e0b&color=fff",
          likes: 67,
          comments: 12,
          createdAt: new Date(Date.now() - 345600000).toISOString()
        }
      ]
    });
  }

  toggleView = () => {
    this.setState(prevState => ({ showPublicOnly: !prevState.showPublicOnly }));
  };

  render() {
    const { content, posts, showPublicOnly, currentUser } = this.state;

    return (
      <div style={{ 
        minHeight: "100vh", 
        width: "100vw",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px 0",
        margin: 0,
        overflowX: "hidden",
        boxSizing: "border-box"
      }}>
        <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto", padding: "0 20px" }}>
          {/* Header Card */}
          <div className="card shadow-lg mb-4" style={{ 
            border: "none", 
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)"
          }}>
            <div className="card-body text-center p-4">
              <h2 style={{ color: "#343a40", fontWeight: "bold", marginBottom: "5px" }}>
                {content}
              </h2>
              <p className="text-muted mb-0">Connect, share, and discover amazing content</p>
            </div>
          </div>

          {/* Login/Signup Banner for Guests */}
          {!currentUser && (
            <div 
              className="card mb-4" 
              style={{ 
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                border: "none",
                borderRadius: "20px",
                color: "white"
              }}
            >
              <div className="card-body text-center p-4">
                <h4 className="mb-3" style={{ fontWeight: "700" }}>
                  <span style={{ marginRight: "10px" }}>🔒</span>
                  Join the Community
                </h4>
                <p className="mb-4">Sign up or login to see the full feed, like posts, and comment!</p>
                <div className="d-flex justify-content-center gap-3">
                  <Link to="/login" className="btn btn-light btn-lg" style={{ 
                    fontWeight: "600", 
                    borderRadius: "12px",
                    color: "#764ba2"
                  }}>
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-outline-light btn-lg" style={{ 
                    fontWeight: "600", 
                    borderRadius: "12px",
                    border: "2px solid white"
                  }}>
                    Sign Up
                  </Link>
                </div>
                <div className="mt-3">
                  <button 
                    onClick={this.toggleView}
                    className="btn btn-link text-white"
                    style={{ textDecoration: "underline" }}
                  >
                    {showPublicOnly ? "Preview Sample Feed" : "Hide Feed Preview"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Toggle for Logged In Users */}
          {currentUser && (
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 style={{ margin: 0, color: "white", fontWeight: "600" }}>
                {showPublicOnly ? "Public Content" : "Full Feed"}
              </h4>
              <button 
                onClick={this.toggleView}
                className="btn btn-light btn-sm"
                style={{ borderRadius: "10px", fontWeight: "600" }}
              >
                {showPublicOnly ? "Show Full Feed" : "Show Public Only"}
              </button>
            </div>
          )}

          {/* Feed Content */}
          {!showPublicOnly || currentUser ? (
            <div className="feed-container">
              {posts.map((post) => (
                <div 
                  key={post.id} 
                  className="card mb-4 shadow"
                  style={{ 
                    border: "none", 
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div className="card-body p-4">
                    {/* Post Header */}
                    <div className="d-flex align-items-center mb-3">
                      <img 
                        src={post.avatar} 
                        alt={post.username}
                        className="rounded-circle mr-3"
                        width="50"
                        height="50"
                        style={{ border: "3px solid #e9ecef" }}
                      />
                      <div>
                        <h6 className="mb-0 font-weight-bold" style={{ color: "#212529", fontSize: "1rem" }}>
                          {post.username}
                        </h6>
                        <small className="text-muted">
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </div>
                    </div>

                    {/* Post Content */}
                    <h5 className="card-title mb-3" style={{ color: "#343a40", fontWeight: "700", fontSize: "1.25rem" }}>
                      {post.title}
                    </h5>
                    <p className="card-text mb-4" style={{ color: "#6c757d", lineHeight: "1.7", fontSize: "1rem" }}>
                      {post.content}
                    </p>

                    {/* Post Actions */}
                    <div className="d-flex align-items-center pt-3" style={{ borderTop: "2px solid #f1f3f5" }}>
                      {currentUser ? (
                        <>
                          <button className="btn btn-sm mr-3" style={{ 
                            borderRadius: "20px", 
                            background: "#fff0f0", 
                            color: "#e74c3c",
                            border: "none",
                            padding: "8px 16px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px"
                          }}>
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                            </svg>
                            {post.likes}
                          </button>
                          <button className="btn btn-sm mr-3" style={{ 
                            borderRadius: "20px", 
                            background: "#e3f2fd", 
                            color: "#2196f3",
                            border: "none",
                            padding: "8px 16px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px"
                          }}>
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                            </svg>
                            {post.comments}
                          </button>
                          <button className="btn btn-sm" style={{ 
                            borderRadius: "20px", 
                            background: "#f3e5f5", 
                            color: "#9c27b0",
                            border: "none",
                            padding: "8px 16px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px"
                          }}>
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"/>
                            </svg>
                            Share
                          </button>
                        </>
                      ) : (
                        <div className="text-muted" style={{ fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "15px" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <svg width="16" height="16" fill="#e74c3c" viewBox="0 0 16 16">
                              <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                            </svg>
                            {post.likes} likes
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <svg width="16" height="16" fill="#2196f3" viewBox="0 0 16 16">
                              <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                            </svg>
                            {post.comments} comments
                          </span>
                          <Link to="/login" style={{ color: "#667eea", fontWeight: "600", textDecoration: "none" }}>
                            Login to interact
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Public Only View - Locked */
            <div 
              className="card text-center p-5 shadow-lg"
              style={{ 
                border: "none", 
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)"
              }}
            >
              <div className="mb-4">
                <div style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <svg width="40" height="40" fill="white" viewBox="0 0 16 16">
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                  </svg>
                </div>
              </div>
              <h4 className="text-muted mb-3">Feed is Hidden</h4>
              <p className="text-muted mb-4">Login or sign up to see what others are sharing!</p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/login" className="btn btn-primary btn-lg" style={{ 
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  fontWeight: "600"
                }}>
                  Login to View
                </Link>
                <button onClick={this.toggleView} className="btn btn-outline-secondary btn-lg" style={{ 
                  borderRadius: "12px",
                  fontWeight: "600"
                }}>
                  Preview Sample
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-5 mb-3">
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem" }}>
              © 2026 SocialFeed. Built with React + Spring Boot + MongoDB + JWT
            </p>
          </div>
        </div>
      </div>
    );
  }
}