use crate::auth::jwt::create_jwt;
use axum::{Json, http::StatusCode};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct LoginRequest {
    username: String,
    password: String,
}

#[derive(Serialize)]
pub struct LoginResponse {
    token: String,
}

pub async fn login(Json(payload): Json<LoginRequest>) -> Result<Json<LoginResponse>, StatusCode> {
    // hardcode admin credentials for now (will update maybe later)
    let admin_username = std::env::var("ADMIN_USERNAME").unwrap_or_else(|_| "admin".to_string());
    let admin_password = std::env::var("ADMIN_PASSWORD").expect("ADMIN_PASSWORD must be set");

    if payload.username != admin_username || payload.password != admin_password {
        return Err(StatusCode::UNAUTHORIZED);
    }

    // Generate JWT token
    let token = create_jwt(payload.username, "admin".to_string())
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(LoginResponse { token }))
}
