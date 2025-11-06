import React from "react";

export default function Profile() {
  const handleLogout = () => {
    // perform sign out (firebase signOut) or clear tokens then redirect
    window.location.href = "/";
  };

  return (
    <div>
      <div className="card" style={{padding:18, marginBottom:12}}>
        <h2>Your Profile</h2>
        <p style={{color:'#c8cbff'}}>Update your info or view account details.</p>
      </div>

      <div className="card" style={{padding:18}}>
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <div style={{width:72,height:72, borderRadius:12, background:'rgba(255,255,255,0.06)'}} />
          <div>
            <div style={{fontWeight:700}}>Sahan</div>
            <div style={{color:'#bfc6ff'}}>sahan@example.com</div>
          </div>
        </div>

        <div style={{marginTop:16}}>
          <button onClick={handleLogout} className="nav-btn" style={{background:'#ff6b6b', color:'white', padding:'10px 16px', borderRadius:8}}>Logout</button>
        </div>
      </div>
    </div>
  );
}
