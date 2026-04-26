import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetAdminMeQuery } from "../ADMIN_REDUX_MANAGEMENT/adminAuthApi";
import { selectAdminStatus, selectAdminUser } from "../ADMIN_REDUX_MANAGEMENT/adminAuthSlice";
import { ROLES } from "../roles";

const VALID_ADMIN_ROLES = Object.values(ROLES);

const decodeToken = (token) => {
    try {
        if (!token) return null;
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) return null;
        return payload;
    } catch { return null; }
};

const AdminLoadingScreen = () => (
    <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", background: "#000", gap: "16px"
    }}>
        <div style={{
            width: "40px", height: "40px", border: "3px solid #1f1f1f",
            borderTop: "3px solid #f7a221", borderRadius: "50%",
            animation: "adminSpin 0.8s linear infinite"
        }} />
        <p style={{ color: "#555", fontSize: "11px", fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
            Verifying access…
        </p>
        <style>{`@keyframes adminSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
);

const AdminPrivateRoute = ({ children }) => {
    const location   = useLocation();
    const status     = useSelector(selectAdminStatus);
    const user       = useSelector(selectAdminUser);

    const token   = localStorage.getItem("accessToken");
    const payload = decodeToken(token);

    // Only hit /auth/me when we genuinely don't know the answer yet (idle on hard-refresh)
    // Once status is authenticated OR unauthenticated — never call again
    const skip = !token || !payload || status === "authenticated" || status === "unauthenticated";
    const { isFetching } = useGetAdminMeQuery(undefined, { skip });

    // ── 1. No token or expired token → login ─────────────────────────────
    if (!token || !payload) {
        return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
    }

    // ── 2. Regular user role → no-access ─────────────────────────────────
    if (payload.role === "user") {
        return <Navigate to="/no-access" replace />;
    }

    // ── 3. Unknown role → unauthorized ────────────────────────────────────
    if (!VALID_ADMIN_ROLES.includes(payload.role)) {
        return <Navigate to="/admin/unauthorized" replace />;
    }

    // ── 4. Still waiting for /auth/me on hard-refresh ────────────────────
    if (isFetching || status === "idle" || status === "loading") {
        return <AdminLoadingScreen />;
    }

    // ── 5. Server confirmed: not valid ────────────────────────────────────
    if (status === "unauthenticated" || !user) {
        return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
    }

    // ── 6. All good ───────────────────────────────────────────────────────
    return children;
};

export default AdminPrivateRoute;

// // components/ADMIN_SEGMENT/ADMIN_LOGIN_SEGMENT/AdminPrivateRoute.jsx
// // ─────────────────────────────────────────────────────────────────────────────
// // DECISION TABLE:
// //
// //   No token at all              → /admin/login
// //   Token exists, role = "user"  → /no-access        (funny 403 page)
// //   Token exists, role unknown   → /no-access
// //   Token exists, invalid role   → /admin/unauthorized
// //   Token expired (decode fails) → /admin/login
// //   status loading / idle        → spinner (never redirect early)
// //   Valid admin role confirmed   → render children
// //
// // ROLE CHECK STRATEGY:
// //   We decode the accessToken client-side FIRST for an instant decision
// //   (no waiting on /auth/me). The /auth/me call still runs in the background
// //   to confirm with the server — if the server disagrees, the slice flips
// //   status to "unauthenticated" and the guard re-evaluates automatically.
// //
// //   This means:
// //   - Regular users are bounced instantly, no spinner
// //   - Valid admins see the dashboard instantly on hard refresh
// //   - Tampered tokens are caught server-side via /auth/me
// // ─────────────────────────────────────────────────────────────────────────────

// import { Navigate, useLocation } from "react-router-dom";
// import { useSelector }           from "react-redux";
// import { useGetAdminMeQuery }    from "../ADMIN_REDUX_MANAGEMENT/adminAuthApi";
// import {
//   selectAdminStatus,
//   selectAdminUser,
// }                                from "../ADMIN_REDUX_MANAGEMENT/adminAuthSlice";
// import { ROLES }                 from "../roles";

// const VALID_ADMIN_ROLES = Object.values(ROLES); // all roles from roles.js
// const USER_ROLE         = "user";               // regular customer role

// // ── Decode JWT payload without verification ──────────────────────────────────
// // Server already verified it on issue. We just read the claims.
// // Returns null if token is missing, malformed, or expired.
// const decodeToken = (token) => {
//   try {
//     if (!token) return null;
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     // Reject locally-expired tokens (exp is in seconds)
//     if (payload.exp && payload.exp * 1000 < Date.now()) return null;
//     return payload;
//   } catch {
//     return null;
//   }
// };

// // ── Full-screen spinner ───────────────────────────────────────────────────────
// const AdminLoadingScreen = () => (
//   <div style={{
//     minHeight:      "100vh",
//     display:        "flex",
//     flexDirection:  "column",
//     alignItems:     "center",
//     justifyContent: "center",
//     background:     "#000",
//     gap:            "16px",
//   }}>
//     <div style={{
//       width:        "40px",
//       height:       "40px",
//       border:       "3px solid #1f1f1f",
//       borderTop:    "3px solid #f7a221",
//       borderRadius: "50%",
//       animation:    "adminSpin 0.8s linear infinite",
//     }} />
//     <p style={{
//       color:         "#555",
//       fontSize:      "11px",
//       fontWeight:    700,
//       letterSpacing: "0.2em",
//       textTransform: "uppercase",
//     }}>
//       Verifying access…
//     </p>
//     <style>{`@keyframes adminSpin { to { transform: rotate(360deg); } }`}</style>
//   </div>
// );

// // ─────────────────────────────────────────────────────────────────────────────

// const AdminPrivateRoute = ({ children }) => {
//   const location = useLocation();
//   const status   = useSelector(selectAdminStatus);
//   const user     = useSelector(selectAdminUser);

//   // ── Step 1: decode token instantly (synchronous) ─────────────────────────
//   const token   = localStorage.getItem("accessToken");
//   const payload = decodeToken(token);

//   // ── Step 2: fire /auth/me in background to server-confirm the session ────
//   // Skip if no token — nothing to verify.
//   // Even if status is already "authenticated" (seeded from slice), this runs
//   // once to confirm with the server. RTK Query deduplicates the call.
//   const { isFetching } = useGetAdminMeQuery(undefined, {
//     skip: !token,
//   });

//   // ── Step 3: instant role decision from decoded token ─────────────────────

//   // No token or token is expired/malformed → go to login
//   if (!token || !payload) {
//     return (
//       <Navigate
//         to="/admin/login"
//         replace
//         state={{ from: location.pathname }}
//       />
//     );
//   }

//   // Token exists but role is "user" (regular customer) → funny 403 page
//   if (payload.role === USER_ROLE) {
//     console.log('first,', payload.role)
//     return <Navigate to="/no-access" replace />;
//   }

//   // Token exists but role is not in VALID_ADMIN_ROLES and not "user"
//   // (unknown / future role) → no-access as well — they definitely shouldn't
//   // be seeing the unauthorized page meant for almost-admins
//   if (!VALID_ADMIN_ROLES.includes(payload.role)) {
//     return <Navigate to="/admin/unauthorized" replace />;
//   }

//   // ── Step 4: role is valid admin — now check server-confirmed slice status ─
//   // While /auth/me is in-flight and slice hasn't confirmed yet, show spinner.
//   // This only happens on hard refresh when deriveInitialState found a valid
//   // token but /auth/me hasn't responded yet.
//   if (status === "idle" || status === "loading" || (isFetching && status !== "authenticated")) {
//     return <AdminLoadingScreen />;
//   }

//   // /auth/me came back and server said no → something wrong (tampered token?)
//   if (status === "unauthenticated" || !user) {
//     return (
//       <Navigate
//         to="/admin/login"
//         replace
//         state={{ from: location.pathname }}
//       />
//     );
//   }

//   // ── Step 5: all checks passed — render the protected dashboard ───────────
//   return children;
// };

// export default AdminPrivateRoute;