import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();

  // Theme state - properly initialized from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });

  // Animation states
  const [animatePost, setAnimatePost] = useState(null);
  const [animateLike, setAnimateLike] = useState(null);
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' or 'profile'

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    // Apply theme class to body for global styling
    document.body.style.background = darkMode 
      ? "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)"
      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    document.body.style.margin = "0";
    document.body.style.minHeight = "100vh";
  }, [darkMode]);

  // Theme styles - Fixed CSS-in-JS approach
  const theme = {
    light: {
      bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      card: "rgba(255, 255, 255, 0.95)",
      text: "#1a1a2e",
      muted: "#6c757d",
      border: "rgba(0,0,0,0.1)",
      primary: "#667eea",
      secondary: "#764ba2",
      input: "#ffffff",
      shadow: "0 8px 32px rgba(0,0,0,0.1)",
      hover: "rgba(102, 126, 234, 0.1)",
      danger: "#ef4444"
    },
    dark: {
      bg: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      card: "rgba(25, 25, 50, 0.8)",
      text: "#ffffff",
      muted: "#a0a0c0",
      border: "rgba(255,255,255,0.1)",
      primary: "#ff6b6b",
      secondary: "#4ecdc4",
      input: "rgba(255,255,255,0.1)",
      shadow: "0 8px 32px rgba(0,0,0,0.4)",
      hover: "rgba(255, 107, 107, 0.1)",
      danger: "#ff4757"
    }
  };

  const currentTheme = darkMode ? theme.dark : theme.light;

  // Load posts from localStorage
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('social_posts');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: 1,
        username: "tech_enthusiast",
        content: "Just deployed my first full-stack application! React + Node.js + MongoDB 🚀 The learning curve was steep but totally worth it. #coding #webdev",
        likes: 24,
        comments: [
          { id: 1, username: "developer_jane", text: "Congratulations! That's a huge milestone! 🎉" },
          { id: 2, username: "code_master", text: "What was the hardest part for you?" }
        ],
        time: "2 hours ago",
        liked: false,
        showComments: false,
        avatar: "T"
      },
      {
        id: 2,
        username: "design_guru",
        content: "Dark mode is not just a trend, it's a lifestyle. Working on some new UI components with glassmorphism effects. What do you think? 🎨",
        likes: 18,
        comments: [],
        time: "4 hours ago",
        liked: false,
        showComments: false,
        avatar: "D"
      },
      {
        id: 3,
        username: "startup_founder",
        content: "Coffee ☕ + Code 💻 = Productivity 📈. Early morning coding sessions are the best!",
        likes: 45,
        comments: [
          { id: 1, username: "night_owl", text: "I'm more of a night coder myself 😄" }
        ],
        time: "6 hours ago",
        liked: false,
        showComments: false,
        avatar: "S"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('social_posts', JSON.stringify(posts));
  }, [posts]);

  const [newPost, setNewPost] = useState("");
  const [commentText, setCommentText] = useState({});

  const handleLogout = () => {
    AuthService.logout();
    window.location.href = "/login";
  };

  const handleLike = (postId) => {
    setAnimateLike(postId);
    setTimeout(() => setAnimateLike(null), 300);
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked };
      }
      return post;
    }));
  };

  const handleCreatePost = () => {
    if (newPost.trim() === "") return;
    
    const post = {
      id: Date.now(),
      username: currentUser.username,
      content: newPost,
      likes: 0,
      comments: [],
      time: "Just now",
      liked: false,
      showComments: false,
      avatar: currentUser.username[0].toUpperCase()
    };
    
    setAnimatePost(post.id);
    setPosts([post, ...posts]);
    setNewPost("");
    setTimeout(() => setAnimatePost(null), 500);
  };

  const toggleComments = (postId) => {
    setPosts(posts.map(post => post.id === postId ? { ...post, showComments: !post.showComments } : post));
  };

  const handleAddComment = (postId) => {
    const text = commentText[postId];
    if (!text?.trim()) return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, { id: Date.now(), username: currentUser.username, text }] };
      }
      return post;
    }));
    setCommentText({ ...commentText, [postId]: "" });
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  // Calculate stats
  const userPosts = posts.filter(p => p.username === currentUser.username);
  const totalLikes = userPosts.reduce((acc, p) => acc + p.likes, 0);
  const totalComments = userPosts.reduce((acc, p) => acc + p.comments.length, 0);

  return (
    <div style={{ 
      minHeight: "100vh",
      width: "100%",
      background: currentTheme.bg,
      color: currentTheme.text,
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      overflowX: "hidden",
      position: "relative"
    }}>
      {/* Global Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px ${currentTheme.primary}; }
          50% { box-shadow: 0 0 20px ${currentTheme.primary}, 0 0 40px ${currentTheme.secondary}; }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        * {
          box-sizing: border-box;
        }
        html, body {
          margin: 0;
          padding: 0;
          min-height: 100vh;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
        }
        ::-webkit-scrollbar-thumb {
          background: ${currentTheme.primary};
          border-radius: 4px;
        }
      `}</style>

      {/* Animated Background Particles */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden"
      }}>
        {[...Array(15)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: `${Math.random() * 6 + 4}px`,
            height: `${Math.random() * 6 + 4}px`,
            background: darkMode ? "rgba(255,107,107,0.4)" : "rgba(255,255,255,0.5)",
            borderRadius: "50%",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 15 + 15}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 5}s`
          }} />
        ))}
      </div>

      {/* Fixed Navbar - Fixed positioning issue */}
      <nav style={{
        background: darkMode ? "rgba(15, 15, 40, 0.95)" : "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${currentTheme.border}`,
        padding: "15px 30px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: currentTheme.shadow
      }}>
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%"
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "20px",
              boxShadow: `0 0 20px ${currentTheme.primary}50`,
              animation: "glow 3s infinite"
            }}>
              S
            </div>
            <h1 style={{ 
              margin: 0, 
              background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "800",
              fontSize: "24px",
              letterSpacing: "-0.5px"
            }}>
              SocialFeed
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div style={{
            display: "flex",
            gap: "10px",
            background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            padding: "5px",
            borderRadius: "12px"
          }}>
            <button
              onClick={() => setActiveTab('feed')}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                background: activeTab === 'feed' ? currentTheme.primary : "transparent",
                color: activeTab === 'feed' ? "white" : currentTheme.muted,
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.3s ease"
              }}
            >
              🏠 Home
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                background: activeTab === 'profile' ? currentTheme.primary : "transparent",
                color: activeTab === 'profile' ? "white" : currentTheme.muted,
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.3s ease"
              }}
            >
              👤 Profile
            </button>
          </div>

          {/* Right Side Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                background: darkMode 
                  ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" 
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "42px",
                height: "42px",
                cursor: "pointer",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
                transform: "scale(1)"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.1) rotate(15deg)";
                e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1) rotate(0deg)";
                e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
              }}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* User Info */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "6px 12px",
              background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              borderRadius: "25px"
            }}>
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "14px"
              }}>
                {currentUser.username[0].toUpperCase()}
              </div>
              <span style={{ 
                color: currentTheme.text, 
                fontSize: "14px",
                fontWeight: "600"
              }}>
                @{currentUser.username}
              </span>
            </div>

            {/* Logout Button - Now properly visible */}
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: `2px solid ${currentTheme.danger}`,
                color: currentTheme.danger,
                borderRadius: "8px",
                padding: "10px 20px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = currentTheme.danger;
                e.target.style.color = "white";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = currentTheme.danger;
                e.target.style.transform = "translateY(0)";
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content - Fixed padding to prevent navbar overlap */}
      <div style={{
        paddingTop: "100px",
        paddingBottom: "40px",
        paddingLeft: "20px",
        paddingRight: "20px",
        minHeight: "100vh",
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
        display: "flex",
        gap: "30px"
      }}>
        {/* Left Sidebar - Stats & User Info */}
        <div style={{
          width: "320px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          position: "sticky",
          top: "100px",
          height: "fit-content"
        }}>
          {/* User Profile Card */}
          <div style={{
            background: currentTheme.card,
            borderRadius: "20px",
            padding: "30px",
            boxShadow: currentTheme.shadow,
            border: `1px solid ${currentTheme.border}`,
            textAlign: "center",
            animation: "slideIn 0.5s ease-out"
          }}>
            <div style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "40px",
              margin: "0 auto 20px",
              boxShadow: `0 10px 30px ${currentTheme.primary}50`,
              border: `4px solid ${currentTheme.card}`
            }}>
              {currentUser.username[0].toUpperCase()}
            </div>
            <h2 style={{ margin: "0 0 5px 0", fontSize: "24px", fontWeight: "700" }}>
              {currentUser.username}
            </h2>
            <p style={{ 
              color: currentTheme.muted, 
              margin: "0 0 20px 0",
              fontSize: "14px"
            }}>
              Full Stack Developer
            </p>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "15px",
              paddingTop: "20px",
              borderTop: `1px solid ${currentTheme.border}`
            }}>
              <div>
                <div style={{ 
                  fontSize: "24px", 
                  fontWeight: "800",
                  color: currentTheme.primary
                }}>
                  {userPosts.length}
                </div>
                <div style={{ fontSize: "12px", color: currentTheme.muted }}>Posts</div>
              </div>
              <div>
                <div style={{ 
                  fontSize: "24px", 
                  fontWeight: "800",
                  color: currentTheme.primary
                }}>
                  {totalLikes}
                </div>
                <div style={{ fontSize: "12px", color: currentTheme.muted }}>Likes</div>
              </div>
              <div>
                <div style={{ 
                  fontSize: "24px", 
                  fontWeight: "800",
                  color: currentTheme.primary
                }}>
                  {totalComments}
                </div>
                <div style={{ fontSize: "12px", color: currentTheme.muted }}>Comments</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{
            background: currentTheme.card,
            borderRadius: "20px",
            padding: "25px",
            boxShadow: currentTheme.shadow,
            border: `1px solid ${currentTheme.border}`,
            animation: "slideIn 0.6s ease-out"
          }}>
            <h3 style={{ 
              margin: "0 0 20px 0", 
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <span style={{ fontSize: "20px" }}>📊</span>
              Network Stats
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                borderRadius: "10px"
              }}>
                <span style={{ color: currentTheme.muted, fontSize: "14px" }}>Total Posts</span>
                <span style={{ fontWeight: "700", color: currentTheme.primary }}>{posts.length}</span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                borderRadius: "10px"
              }}>
                <span style={{ color: currentTheme.muted, fontSize: "14px" }}>Total Likes</span>
                <span style={{ fontWeight: "700", color: currentTheme.primary }}>
                  {posts.reduce((acc, p) => acc + p.likes, 0)}
                </span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                borderRadius: "10px"
              }}>
                <span style={{ color: currentTheme.muted, fontSize: "14px" }}>Total Comments</span>
                <span style={{ fontWeight: "700", color: currentTheme.primary }}>
                  {posts.reduce((acc, p) => acc + p.comments.length, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Feed */}
        <div style={{ flex: 1, maxWidth: "800px" }}>
          {/* Create Post */}
          <div style={{
            background: currentTheme.card,
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "25px",
            boxShadow: currentTheme.shadow,
            border: `1px solid ${currentTheme.border}`,
            animation: "slideIn 0.3s ease-out"
          }}>
            <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "18px",
                flexShrink: 0
              }}>
                {currentUser.username[0].toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <textarea
                  style={{
                    width: "100%",
                    padding: "15px",
                    borderRadius: "16px",
                    border: `2px solid ${currentTheme.border}`,
                    background: currentTheme.input,
                    color: currentTheme.text,
                    resize: "none",
                    minHeight: "80px",
                    fontSize: "16px",
                    fontFamily: "inherit",
                    outline: "none",
                    transition: "all 0.3s ease"
                  }}
                  placeholder="What's happening?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  onFocus={(e) => {
                    e.target.style.borderColor = currentTheme.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${currentTheme.primary}30`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = currentTheme.border;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleCreatePost}
                disabled={!newPost.trim()}
                style={{
                  background: newPost.trim() 
                    ? `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
                    : currentTheme.muted,
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  padding: "12px 28px",
                  cursor: newPost.trim() ? "pointer" : "not-allowed",
                  fontWeight: "600",
                  fontSize: "15px",
                  boxShadow: newPost.trim() ? `0 4px 15px ${currentTheme.primary}50` : "none",
                  transition: "all 0.3s ease",
                  transform: "scale(1)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
                onMouseEnter={(e) => {
                  if (newPost.trim()) {
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.boxShadow = `0 6px 20px ${currentTheme.primary}70`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = newPost.trim() ? `0 4px 15px ${currentTheme.primary}50` : "none";
                }}
              >
                Post 🚀
              </button>
            </div>
          </div>

          {/* Feed Title */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginBottom: "20px",
            padding: "0 10px"
          }}>
            <div style={{
              width: "4px",
              height: "24px",
              background: `linear-gradient(180deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
              borderRadius: "2px"
            }}></div>
            <h3 style={{ 
              margin: 0, 
              color: currentTheme.text,
              fontSize: "20px",
              fontWeight: "700"
            }}>
              {activeTab === 'feed' ? 'Community Feed' : 'My Posts'}
            </h3>
            <div style={{
              marginLeft: "auto",
              padding: "6px 12px",
              background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              borderRadius: "20px",
              fontSize: "13px",
              color: currentTheme.muted
            }}>
              {activeTab === 'feed' ? posts.length : userPosts.length} posts
            </div>
          </div>

          {/* Posts Feed */}
          {(activeTab === 'feed' ? posts : userPosts).map((post, index) => (
            <div 
              key={post.id} 
              style={{
                background: currentTheme.card,
                borderRadius: "20px",
                padding: "25px",
                marginBottom: "20px",
                boxShadow: currentTheme.shadow,
                border: `1px solid ${currentTheme.border}`,
                animation: animatePost === post.id 
                  ? "slideIn 0.5s ease-out" 
                  : `slideIn ${0.1 * (index + 1)}s ease-out`,
                transform: animatePost === post.id ? "scale(1.01)" : "scale(1)",
                transition: "all 0.3s ease"
              }}
            >
              {/* Post Header */}
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "flex-start", 
                marginBottom: "15px" 
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "20px",
                    boxShadow: `0 4px 15px ${currentTheme.primary}40`
                  }}>
                    {post.avatar || post.username[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ 
                      fontWeight: "700", 
                      color: currentTheme.text,
                      fontSize: "16px",
                      marginBottom: "2px"
                    }}>
                      @{post.username}
                    </div>
                    <div style={{ 
                      color: currentTheme.muted, 
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      <span style={{ 
                        width: "6px", 
                        height: "6px", 
                        background: "#4ade80", 
                        borderRadius: "50%",
                        display: "inline-block"
                      }}></span>
                      {post.time}
                    </div>
                  </div>
                </div>
                {post.username === currentUser.username && (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: currentTheme.danger,
                      cursor: "pointer",
                      fontSize: "13px",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      transition: "all 0.2s",
                      opacity: "0.7"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = darkMode ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.1)";
                      e.target.style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "transparent";
                      e.target.style.opacity = "0.7";
                    }}
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>

              {/* Post Content */}
              <p style={{ 
                color: currentTheme.text, 
                fontSize: "16px", 
                lineHeight: "1.6",
                marginBottom: "20px",
                paddingLeft: "65px",
                whiteSpace: "pre-wrap"
              }}>
                {post.content}
              </p>

              {/* Actions */}
              <div style={{
                display: "flex",
                gap: "12px",
                paddingTop: "15px",
                borderTop: `1px solid ${currentTheme.border}`,
                paddingLeft: "65px"
              }}>
                <button
                  onClick={() => handleLike(post.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 20px",
                    borderRadius: "25px",
                    border: "none",
                    background: post.liked 
                      ? `linear-gradient(135deg, #ef4444, #f87171)`
                      : darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                    color: post.liked ? "white" : currentTheme.text,
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "600",
                    transition: "all 0.2s ease",
                    transform: animateLike === post.id ? "scale(1.2)" : "scale(1)",
                    boxShadow: post.liked ? "0 4px 15px rgba(239,68,68,0.4)" : "none"
                  }}
                >
                  <span style={{ fontSize: "18px" }}>{post.liked ? "❤️" : "🤍"}</span>
                  {post.likes}
                </button>

                <button
                  onClick={() => toggleComments(post.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 20px",
                    borderRadius: "25px",
                    border: "none",
                    background: post.showComments
                      ? `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
                      : darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                    color: post.showComments ? "white" : currentTheme.text,
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "600",
                    transition: "all 0.2s ease"
                  }}
                >
                  <span>💬</span>
                  {post.comments.length}
                </button>

                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 20px",
                    borderRadius: "25px",
                    border: "none",
                    background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                    color: currentTheme.text,
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "600",
                    transition: "all 0.2s ease",
                    marginLeft: "auto"
                  }}
                >
                  <span>↗️</span>
                  Share
                </button>
              </div>

              {/* Comments Section */}
              {post.showComments && (
                <div style={{
                  marginTop: "20px",
                  marginLeft: "65px",
                  padding: "20px",
                  background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                  borderRadius: "16px",
                  animation: "slideIn 0.3s ease-out"
                }}>
                  <h6 style={{ 
                    color: currentTheme.muted, 
                    fontSize: "13px", 
                    marginBottom: "15px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "1px"
                  }}>
                    Comments ({post.comments.length})
                  </h6>

                  {post.comments.length === 0 ? (
                    <p style={{ 
                      color: currentTheme.muted, 
                      fontSize: "14px", 
                      marginBottom: "15px", 
                      fontStyle: "italic",
                      textAlign: "center",
                      padding: "20px"
                    }}>
                      No comments yet. Be the first to share your thoughts! 💭
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "15px" }}>
                      {post.comments.map((comment, cidx) => (
                        <div 
                          key={comment.id} 
                          style={{
                            padding: "12px 15px",
                            background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)",
                            borderRadius: "12px",
                            animation: "slideIn 0.2s ease-out",
                            border: `1px solid ${currentTheme.border}`
                          }}
                        >
                          <div style={{ 
                            color: currentTheme.primary, 
                            fontWeight: "700", 
                            fontSize: "13px",
                            marginBottom: "4px"
                          }}>
                            @{comment.username}
                          </div>
                          <p style={{ 
                            color: currentTheme.text, 
                            fontSize: "14px", 
                            margin: 0,
                            lineHeight: "1.4"
                          }}>
                            {comment.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment */}
                  <div style={{ display: "flex", gap: "12px" }}>
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText[post.id] || ""}
                      onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      style={{
                        flex: 1,
                        padding: "12px 18px",
                        borderRadius: "25px",
                        border: `2px solid ${currentTheme.border}`,
                        background: currentTheme.input,
                        color: currentTheme.text,
                        fontSize: "14px",
                        outline: "none",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = currentTheme.primary;
                        e.target.style.boxShadow = `0 0 0 3px ${currentTheme.primary}30`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = currentTheme.border;
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      disabled={!commentText[post.id]?.trim()}
                      style={{
                        padding: "12px 24px",
                        borderRadius: "25px",
                        border: "none",
                        background: commentText[post.id]?.trim() 
                          ? `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
                          : currentTheme.muted,
                        color: "white",
                        cursor: commentText[post.id]?.trim() ? "pointer" : "not-allowed",
                        fontWeight: "600",
                        fontSize: "14px",
                        transition: "all 0.2s ease",
                        transform: "scale(1)"
                      }}
                      onMouseEnter={(e) => {
                        if (commentText[post.id]?.trim()) {
                          e.target.style.transform = "scale(1.05)";
                          e.target.style.boxShadow = `0 4px 15px ${currentTheme.primary}60`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Empty State */}
          {(activeTab === 'profile' && userPosts.length === 0) && (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              color: currentTheme.muted
            }}>
              <div style={{ fontSize: "60px", marginBottom: "20px" }}>📝</div>
              <h3 style={{ margin: "0 0 10px 0", color: currentTheme.text }}>No posts yet</h3>
              <p style={{ margin: 0 }}>Share your first thought with the community!</p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Trending/Info */}
        <div style={{
          width: "300px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          position: "sticky",
          top: "100px",
          height: "fit-content"
        }}>
          {/* Trending Topics */}
          <div style={{
            background: currentTheme.card,
            borderRadius: "20px",
            padding: "25px",
            boxShadow: currentTheme.shadow,
            border: `1px solid ${currentTheme.border}`,
            animation: "slideIn 0.7s ease-out"
          }}>
            <h3 style={{ 
              margin: "0 0 20px 0", 
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <span style={{ fontSize: "20px" }}>🔥</span>
              Trending
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {['#webdevelopment', '#reactjs', '#codinglife', '#tech', '#innovation'].map((tag, idx) => (
                <div key={idx} style={{
                  padding: "12px",
                  background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  border: `1px solid transparent`
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = currentTheme.hover;
                  e.target.style.borderColor = currentTheme.primary;
                  e.target.style.transform = "translateX(5px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
                  e.target.style.borderColor = "transparent";
                  e.target.style.transform = "translateX(0)";
                }}
                >
                  <div style={{ 
                    color: currentTheme.primary, 
                    fontWeight: "600",
                    fontSize: "14px"
                  }}>
                    {tag}
                  </div>
                  <div style={{ 
                    color: currentTheme.muted, 
                    fontSize: "12px",
                    marginTop: "2px"
                  }}>
                    {Math.floor(Math.random() * 50 + 10)} posts today
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div style={{
            background: currentTheme.card,
            borderRadius: "20px",
            padding: "25px",
            boxShadow: currentTheme.shadow,
            border: `1px solid ${currentTheme.border}`,
            animation: "slideIn 0.8s ease-out"
          }}>
            <h3 style={{ 
              margin: "0 0 15px 0", 
              fontSize: "16px",
              color: currentTheme.muted
            }}>
              System Status
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "13px"
              }}>
                <span style={{ color: "#4ade80" }}>●</span>
                <span style={{ color: currentTheme.text }}>Backend Connected</span>
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "13px"
              }}>
                <span style={{ color: "#4ade80" }}>●</span>
                <span style={{ color: currentTheme.text }}>Database Active</span>
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "13px"
              }}>
                <span style={{ color: "#4ade80" }}>●</span>
                <span style={{ color: currentTheme.text }}>JWT Authenticated</span>
              </div>
            </div>
            <div style={{
              marginTop: "15px",
              paddingTop: "15px",
              borderTop: `1px solid ${currentTheme.border}`,
              fontSize: "11px",
              color: currentTheme.muted,
              wordBreak: "break-all"
            }}>
              Token: {currentUser.accessToken.substring(0, 20)}...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;