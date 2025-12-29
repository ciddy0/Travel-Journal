use crate::auth::jwt::verify_jwt;
use axum::{
    extract::Request,
    http::{HeaderMap, StatusCode},
    middleware::Next,
    response::Response,
};

// use in the future if i add features where i need authenticated users
pub async fn require_auth(
    headers: HeaderMap,
    mut request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let auth_header = headers
        .get("Authorization")
        .and_then(|h| h.to_str().ok())
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or(StatusCode::UNAUTHORIZED)?;

    // verify JWT and extract claims
    let claims = verify_jwt(token).map_err(|_| StatusCode::UNAUTHORIZED)?;

    // add claims to request extensions so handlers can access them
    request.extensions_mut().insert(claims);

    Ok(next.run(request).await)
}

pub async fn require_admin(
    headers: HeaderMap,
    request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let auth_header = headers
        .get("Authorization")
        .and_then(|h| h.to_str().ok())
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let claims = verify_jwt(token).map_err(|_| StatusCode::UNAUTHORIZED)?;

    // Check if user is admin
    if claims.role != "admin" {
        return Err(StatusCode::FORBIDDEN);
    }

    Ok(next.run(request).await)
}
