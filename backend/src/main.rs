use axum::{Router, routing::get};
use sqlx::postgres::PgPoolOptions;

mod models;
mod routes;
mod services;

#[tokio::main]
async fn main() {
    // Load .env file
    dotenvy::dotenv().ok();

    // Database connection
    let database_url =
        std::env::var("DATABASE_URL").expect("DATABASE_URL must be set in .env file");

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to database");

    // Create service
    let location_service = services::location::LocationService::new(pool);

    // Build router
    let app = Router::new()
        .route(
            "/locations",
            get(routes::location::get_all_locations).post(routes::location::create_location),
        )
        .route("/locations/{id}", get(routes::location::get_location_by_id)) // Changed :id to {id}
        .with_state(location_service);

    // Start server
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();

    println!("Server running on http://0.0.0.0:8080");
    axum::serve(listener, app).await.unwrap();
}
