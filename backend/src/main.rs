use axum::{
    Router,
    middleware::from_fn,
    routing::{delete, get, post, put},
};
mod auth;
mod db;
mod handlers;
mod middleware;
mod models;
mod routes;
mod services;

use crate::handlers::upload::{serve_image, upload_image};
use crate::middleware::auth::require_admin;
use crate::routes::auth::login;
use crate::routes::location::{
    create_location, delete_location, get_all_locations, get_location_by_id, update_location,
};

use tower_http::cors::{Any, CorsLayer};

#[tokio::main]
async fn main() {
    // Load .env file
    dotenvy::dotenv().ok();

    // Database connection
    let pool = db::establish_connection()
        .await
        .expect("Failed to connect to the database");

    // Create service
    let location_service = services::location::LocationService::new(pool);

    // add Cors layer
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);
    // Build router
    let app = Router::new()
        // Auth route
        .route("/login", post(login))
        // Public GET routes
        .route("/locations", get(get_all_locations))
        .route("/locations/{id}", get(get_location_by_id))
        .route("/uploads/{filename}", get(serve_image))
        // Merge with protected routes that require admin auth
        .merge(
            Router::new()
                .route("/locations", post(create_location))
                .route("/locations/{id}", put(update_location))
                .route("/locations/{id}", delete(delete_location))
                .route("/upload", post(upload_image))
                .layer(from_fn(require_admin)),
        )
        .layer(cors)
        .with_state(location_service);

    // Start server
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();

    println!("Server running on http://0.0.0.0:8080");
    axum::serve(listener, app).await.unwrap();
}
