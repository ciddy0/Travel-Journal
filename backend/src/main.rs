use axum::{Router, routing::get};
mod db;
mod models;
mod routes;
mod services;

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

    // Build router
    let app = Router::new()
        .route(
            "/locations",
            get(routes::location::get_all_locations).post(routes::location::create_location),
        )
        .route(
            "/locations/{id}",
            get(routes::location::get_location_by_id)
                .put(routes::location::update_location)
                .delete(routes::location::delete_location),
        )
        .with_state(location_service);

    // Start server
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();

    println!("Server running on http://0.0.0.0:8080");
    axum::serve(listener, app).await.unwrap();
}
